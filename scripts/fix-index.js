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

async function fixIndex() {
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
        const collection = db.collection('links');

        // List current indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(i => i.name));

        // Drop the alias_1 index if it exists
        const aliasIndex = indexes.find(i => i.name === 'alias_1');
        if (aliasIndex) {
            console.log('Dropping alias_1 index...');
            await collection.dropIndex('alias_1');
            console.log('Index dropped successfully!');
        } else {
            console.log('alias_1 index not found');
        }

        // Close connection
        await mongoose.connection.close();
        console.log('Done!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

fixIndex();

