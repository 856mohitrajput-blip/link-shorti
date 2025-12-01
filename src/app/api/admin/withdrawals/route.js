import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/Users';

/**
 * Admin Withdrawals API
 * Get all pending/approved withdrawal requests
 */
export async function GET() {
  try {
    await connectDB();

    // Find all withdrawals with pending or approved requests in history
    const withdrawals = await Withdrawal.find({
      'history.status': { $in: ['Pending', 'Approved'] }
    }).lean();

    // Extract pending/approved requests with user info
    const requests = [];
    
    for (const withdrawal of withdrawals) {
      const user = await User.findOne({ email: withdrawal.userEmail }).select('fullName email').lean();
      
      for (const item of withdrawal.history) {
        if (item.status === 'Pending' || item.status === 'Approved') {
          requests.push({
            ...item,
            userEmail: withdrawal.userEmail,
            userName: user?.fullName || 'Unknown',
            withdrawalDetails: withdrawal.withdrawalDetails,
          });
        }
      }
    }

    // Sort by date (newest first)
    requests.sort((a, b) => new Date(b.date) - new Date(a.date));

    return NextResponse.json({ success: true, requests }, { status: 200 });
  } catch (error) {
    console.error('Admin withdrawals fetch error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Update withdrawal status (approve/complete/cancel/return)
 */
export async function POST(request) {
  try {
    const { userEmail, withdrawalId, action, reason } = await request.json();

    if (!userEmail || !withdrawalId || !action) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const validActions = ['approve', 'complete', 'cancel', 'return'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }

    await connectDB();

    const withdrawal = await Withdrawal.findOne({ userEmail });
    if (!withdrawal) {
      return NextResponse.json(
        { success: false, message: "Withdrawal record not found" },
        { status: 404 }
      );
    }

    // Find the specific withdrawal request
    const historyIndex = withdrawal.history.findIndex(h => h.withdrawalId === withdrawalId);
    if (historyIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    const historyItem = withdrawal.history[historyIndex];
    const amount = historyItem.totalAmount;

    // Update status based on action
    switch (action) {
      case 'approve':
        if (historyItem.status !== 'Pending') {
          return NextResponse.json(
            { success: false, message: "Can only approve pending requests" },
            { status: 400 }
          );
        }
        withdrawal.history[historyIndex].status = 'Approved';
        break;

      case 'complete':
        if (historyItem.status !== 'Approved') {
          return NextResponse.json(
            { success: false, message: "Can only complete approved requests" },
            { status: 400 }
          );
        }
        withdrawal.history[historyIndex].status = 'Complete';
        withdrawal.pendingBalance -= amount;
        withdrawal.totalWithdrawn += amount;
        break;

      case 'cancel':
        if (historyItem.status !== 'Pending' && historyItem.status !== 'Approved') {
          return NextResponse.json(
            { success: false, message: "Can only cancel pending or approved requests" },
            { status: 400 }
          );
        }
        withdrawal.history[historyIndex].status = 'Cancelled';
        withdrawal.pendingBalance -= amount;
        withdrawal.availableBalance += amount;
        break;

      case 'return':
        if (historyItem.status !== 'Pending' && historyItem.status !== 'Approved') {
          return NextResponse.json(
            { success: false, message: "Can only return pending or approved requests" },
            { status: 400 }
          );
        }
        withdrawal.history[historyIndex].status = 'Returned';
        withdrawal.pendingBalance -= amount;
        withdrawal.availableBalance += amount;
        break;
    }

    // Add reason if provided
    if (reason) {
      withdrawal.history[historyIndex].adminNote = reason;
    }

    await withdrawal.save();

    return NextResponse.json({
      success: true,
      message: `Withdrawal ${action}ed successfully`,
    }, { status: 200 });
  } catch (error) {
    console.error('Admin withdrawal update error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
