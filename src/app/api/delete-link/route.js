// File: /api/links/delete/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import Links from '@/models/Links';

export async function DELETE(request) {
    try {
        await connectDB();

        const { linkId, userEmail } = await request.json();

        if (!linkId || !userEmail) {
            return NextResponse.json({ error: 'Link ID and user email are required' }, { status: 400 });
        }

        // Find the link by ID and ensure it belongs to the user
        const result = await Links.deleteOne({ _id: linkId, userEmail });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Link not found or not authorized to delete' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Link successfully deleted' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting link:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}