const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load env manually
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length) {
            process.env[key.trim()] = valueParts.join('=').trim();
        }
    });
}

// Define which fields SHOULD be unique (legitimate unique constraints)
const LEGITIMATE_UNIQUE_FIELDS = {
    'users': ['email'],
    'links': ['shortUrl', 'alias'], // alias is sparse unique
    'withdrawals': ['userEmail'],
    'statistics': ['userEmail'],
    'admins': ['phoneNumber'],
    'contacts': [] // No unique fields needed
};

// Fields that should NEVER have unique indexes (usually nested array fields)
const PROBLEMATIC_PATTERNS = [
    /^history\./,  // Any field starting with history.
    /\.\w+\.\w+/,  // Any nested field (field.subfield)
];

function isProblematicIndex(indexKey, collectionName) {
    const keyStr = Object.keys(indexKey)[0];
    
    // Check if it matches problematic patterns
    for (const pattern of PROBLEMATIC_PATTERNS) {
        if (pattern.test(keyStr)) {
            return true;
        }
    }
    
    // Check if it's a legitimate unique field
    const legitimateFields = LEGITIMATE_UNIQUE_FIELDS[collectionName] || [];
    if (legitimateFields.includes(keyStr)) {
        return false; // This is legitimate
    }
    
    // If it's a unique index on a nested field, it's problematic
    if (keyStr.includes('.')) {
        return true;
    }
    
    return false;
}

async function fixAllIndexes() {
    try {
        let uri = process.env.MONGODB_URI;
        // Remove surrounding quotes if present
        if (uri && (uri.startsWith('"') || uri.startsWith("'"))) {
            uri = uri.slice(1, -1);
        }
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected!\n');

        const db = mongoose.connection.db;
        
        // Get all collection names
        const collections = await db.listCollections().toArray();
        console.log(`Found ${collections.length} collections\n`);
        console.log('='.repeat(80));
        
        let totalFixed = 0;
        let totalChecked = 0;

        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            const collection = db.collection(collectionName);
            
            console.log(`\n📋 Checking collection: ${collectionName}`);
            console.log('-'.repeat(80));
            
            try {
                const indexes = await collection.indexes();
                totalChecked += indexes.length;
                
                console.log(`Found ${indexes.length} index(es):`);
                
                for (const index of indexes) {
                    const indexName = index.name;
                    const indexKey = index.key || {};
                    const isUnique = index.unique === true;
                    const keyStr = Object.keys(indexKey)[0] || 'unknown';
                    
                    // Skip _id index
                    if (indexName === '_id_') {
                        console.log(`  ✓ ${indexName}: ${JSON.stringify(indexKey)} (system index - skipping)`);
                        continue;
                    }
                    
                    // Check if this is a problematic unique index
                    if (isUnique && isProblematicIndex(indexKey, collectionName)) {
                        console.log(`  ❌ PROBLEMATIC: ${indexName}: ${JSON.stringify(indexKey)} (unique on nested/array field)`);
                        console.log(`     Attempting to drop...`);
                        
                        try {
                            await collection.dropIndex(indexName);
                            console.log(`     ✅ Successfully dropped index: ${indexName}`);
                            totalFixed++;
                        } catch (dropError) {
                            // Try dropping by key pattern
                            try {
                                await collection.dropIndex(indexKey);
                                console.log(`     ✅ Successfully dropped index by key pattern`);
                                totalFixed++;
                            } catch (dropError2) {
                                console.log(`     ⚠️  Failed to drop: ${dropError2.message}`);
                            }
                        }
                    } else if (isUnique) {
                        // Check if it's a legitimate unique field
                        const legitimateFields = LEGITIMATE_UNIQUE_FIELDS[collectionName] || [];
                        if (legitimateFields.includes(keyStr)) {
                            console.log(`  ✓ ${indexName}: ${JSON.stringify(indexKey)} (unique - LEGITIMATE)`);
                        } else {
                            console.log(`  ⚠️  ${indexName}: ${JSON.stringify(indexKey)} (unique - review if needed)`);
                        }
                    } else {
                        console.log(`  ✓ ${indexName}: ${JSON.stringify(indexKey)} (non-unique)`);
                    }
                }
            } catch (error) {
                console.log(`  ⚠️  Error checking collection: ${error.message}`);
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log(`\n📊 Summary:`);
        console.log(`   Collections checked: ${collections.length}`);
        console.log(`   Indexes checked: ${totalChecked}`);
        console.log(`   Problematic indexes fixed: ${totalFixed}`);
        console.log('\n✅ All collections checked and fixed!\n');

        // Close connection
        await mongoose.connection.close();
        console.log('Connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

fixAllIndexes();

