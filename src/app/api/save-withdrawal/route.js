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

        // Use findOneAndUpdate with upsert to avoid race conditions with unique index
        const withdrawalDoc = await Withdrawal.findOneAndUpdate(
            { userEmail },
            { 
                $set: { withdrawalDetails: details },
                $setOnInsert: {
                    availableBalance: 0,
                    pendingBalance: 0,
                    totalWithdrawn: 0,
                    history: []
                }
            },
            { 
                upsert: true, 
                new: true,
                setDefaultsOnInsert: true
            }
        );

        return NextResponse.json({ 
            message: 'Withdrawal details updated successfully.', 
            updatedWithdrawal: withdrawalDoc 
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating withdrawal details:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}