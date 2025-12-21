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

async function fixWithdrawalIndex() {
    try {
        let uri = process.env.MONGODB_URI;
        // Remove surrounding quotes if present
        if (uri && (uri.startsWith('"') || uri.startsWith("'"))) {
            uri = uri.slice(1, -1);
        }
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected!');

        const db = mongoose.connection.db;
        const collection = db.collection('withdrawals');

        // List current indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(i => ({ name: i.name, key: i.key })));

        // Find and drop the history.withdrawalId unique index
        const problematicIndex = indexes.find(i => 
            i.key && i.key['history.withdrawalId'] === 1 && i.unique === true
        );

        if (problematicIndex) {
            console.log('Found problematic unique index:', problematicIndex.name);
            console.log('Dropping index:', problematicIndex.name);
            try {
                await collection.dropIndex(problematicIndex.name);
                console.log('Index dropped successfully!');
            } catch (dropError) {
                // Try dropping by key pattern if name doesn't work
                console.log('Trying to drop by key pattern...');
                await collection.dropIndex({ 'history.withdrawalId': 1 });
                console.log('Index dropped successfully by key pattern!');
            }
        } else {
            console.log('No problematic unique index on history.withdrawalId found');
            // Check if there's any index on history.withdrawalId at all
            const anyHistoryIndex = indexes.find(i => 
                i.key && i.key['history.withdrawalId']
            );
            if (anyHistoryIndex) {
                console.log('Found non-unique index on history.withdrawalId:', anyHistoryIndex.name);
                console.log('This is fine - no action needed');
            }
        }

        // List indexes after fix
        const indexesAfter = await collection.indexes();
        console.log('\nIndexes after fix:', indexesAfter.map(i => ({ name: i.name, key: i.key })));

        // Close connection
        await mongoose.connection.close();
        console.log('\nDone!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

fixWithdrawalIndex();

