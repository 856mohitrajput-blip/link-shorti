import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import Links from '@/models/Links';

async function generateUniqueShortKey(length = 7) { 
    let key;
    let existingLink;
    do {
        key = Math.random().toString(36).substr(2, length);
        existingLink = await Links.findOne({ shortUrl: key }).select('_id');
    } while (existingLink);
    
    return key;
}


export async function POST(request) {
    try {
        await connectDB();

        const { originalUrl, userEmail } = await request.json();

        if (!originalUrl || !userEmail) {
            return NextResponse.json({ error: 'Original URL and user email are required' }, { status: 400 });
        }
        
        const shortUrlKey = await generateUniqueShortKey(7);
        const safeOriginalUrl = originalUrl.startsWith('http') ? originalUrl : `https://${originalUrl}`;

        const newLink = await Links.create({
            userEmail,
            originalUrl: safeOriginalUrl,
            shortUrl: shortUrlKey, 
            clicks: 0,
            createdAt: new Date(),
        });

        return NextResponse.json({ 
            message: 'Link successfully created', 
            newLink 
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating link:', error);
        if (error.code === 11000) {
             const key = Object.keys(error.keyPattern)[0];
             if (key === 'shortUrl') {
                 return NextResponse.json({ error: 'A rare clash occurred in short URL generation. Please try again.' }, { status: 500 });
             }
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}