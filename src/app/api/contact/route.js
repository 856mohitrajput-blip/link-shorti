import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import ContactModel from '@/models/Contacts';

export async function POST(request) {
    try {
        const { fullName, email, message } = await request.json();
        
        await connectDB();

        const newContact = new ContactModel({
            fullName,
            email,
            message,
        });

        await newContact.save();

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
