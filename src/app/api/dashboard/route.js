// File: /api/dashboard/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig'; 
import Statistics from '@/models/Statistics';
import Links from '@/models/Links'; 
import Withdrawal from '@/models/Withdrawal';

export async function POST(request) {
    try {
        await connectDB();

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Fetch ALL data concurrently for the given email
        const [statistics, links, withdrawal] = await Promise.all([
            Statistics.findOne({ userEmail: email }),
            Links.find({ userEmail: email }).sort({ createdAt: -1 }),
            Withdrawal.findOne({ userEmail: email })
        ]);

        return NextResponse.json({
            statistics,
            links, 
            withdrawal,
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}