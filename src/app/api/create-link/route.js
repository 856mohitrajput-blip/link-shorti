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

        const { originalUrl, alias, userEmail } = await request.json();

        if (!originalUrl || !userEmail || !alias) {
            return NextResponse.json({ error: 'Original URL, a unique alias (name), and user email are required' }, { status: 400 });
        }
        
        let shortUrlKey;
        const sanitizedAlias = alias.trim();
        
        const existingLinkWithAlias = await Links.findOne({ alias: sanitizedAlias });
        if (existingLinkWithAlias) {
            return NextResponse.json({ 
                error: `The alias/name "${sanitizedAlias}" is already in use. Please choose another name.` 
            }, { status: 409 });
        }
        
        shortUrlKey = await generateUniqueShortKey(7);
        
        const safeOriginalUrl = originalUrl.startsWith('http') ? originalUrl : `https://${originalUrl}`;


        const newLink = await Links.create({
            userEmail,
            originalUrl: safeOriginalUrl,
            shortUrl: shortUrlKey, 
            alias: sanitizedAlias,
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
             if (key === 'alias') {
                 return NextResponse.json({ error: 'This custom alias is already taken. Please choose a unique name.' }, { status: 409 });
             } else if (key === 'shortUrl') {
                 return NextResponse.json({ error: 'A rare clash occurred in short URL generation. Please try again.' }, { status: 500 });
             }
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}