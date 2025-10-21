import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import Withdrawal from '@/models/Withdrawal';

export async function PUT(request) { 
    try {
        await connectDB();

        const { userEmail, details } = await request.json();

        if (!userEmail || !details) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        const withdrawalDoc = await Withdrawal.findOneAndUpdate(
            { userEmail },
            { $set: { withdrawalDetails: details } }, 
            { new: true, runValidators: true, upsert: true }
        );

        if (!withdrawalDoc) {
            return NextResponse.json({ error: 'Withdrawal account not found/created for this user' }, { status: 404 });
        }

        return NextResponse.json({ 
            message: 'Withdrawal details updated successfully.', 
            updatedWithdrawal: withdrawalDoc 
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating withdrawal details:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}