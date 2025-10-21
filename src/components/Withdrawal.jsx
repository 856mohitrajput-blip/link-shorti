"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { 
    Wallet, Hourglass, CircleCheck, ThumbsUp, XCircle, Undo2, Info, Save,
    CreditCard, Pencil
} from 'lucide-react';

const BalanceCard = ({ icon: Icon, title, amount, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-6 border-slate-200/80">
        <div className={`p-4 rounded-full ${color}`}><Icon className="w-7 h-7 text-white" /></div>
        <div>
            <p className="text-slate-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{formatCurrency(amount)}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const statusStyles = {
        Pending: { icon: Hourglass, color: 'text-orange-600 bg-orange-100' },
        Approved: { icon: ThumbsUp, color: 'text-blue-600 bg-blue-100' },
        Complete: { icon: CircleCheck, color: 'text-green-600 bg-green-100' },
        Cancelled: { icon: XCircle, color: 'text-slate-600 bg-slate-100' },
        Returned: { icon: Undo2, color: 'text-red-600 bg-red-100' },
    };
    const { icon: Icon, color } = statusStyles[status] || statusStyles.Cancelled;
    return (
        <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium ${color}`}>
            <Icon className="w-3 h-3" />
            {status}
        </span>
    );
};

const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(parseFloat(amount))) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
};


const WithdrawalDetailsForm = ({ 
    details, 
    setDetails, 
    onSubmit, 
    isSaving, 
    isDetailsSaved, 
    initialSavedDetails 
}) => {
    const { selectedMethod, paypal, upi, bank } = details;
    const allMethods = ['PayPal', 'UPI', 'Bank Transfer'];

    const [isEditing, setIsEditing] = useState(!isDetailsSaved);

    const handleMethodChange = (method) => {
        if (!isEditing || isSaving) return;

        setDetails(prev => {
            const newDetails = {
                ...prev,
                selectedMethod: method,
            };

            let activeKey = method.toLowerCase().replace(' ', '');
            if (method === 'Bank Transfer') {
                activeKey = 'bank';
            }
            if (isDetailsSaved && initialSavedDetails?.selectedMethod === method) {
                newDetails[activeKey] = initialSavedDetails[activeKey] || {};
            } else {
                newDetails[activeKey] = {};
            }

            return newDetails;
        });
    };

    const handleCancelEdit = useCallback(() => {
        if (isSaving) return;

        if (isDetailsSaved && initialSavedDetails) {
            const activeKey = initialSavedDetails.selectedMethod.toLowerCase().replace(' ', '');
            setDetails({
                selectedMethod: initialSavedDetails.selectedMethod,
                paypal: initialSavedDetails.paypal || {},
                upi: initialSavedDetails.upi || {},
                bank: initialSavedDetails.bank || {},
            });
            setIsEditing(false);
        } else {
            setDetails({
                selectedMethod: 'PayPal',
                paypal: {},
                upi: {},
                bank: {}
            });
            setIsEditing(true);
        }
    }, [isSaving, isDetailsSaved, initialSavedDetails, setDetails]);

    const handleDetailChange = (method, field) => (e) => {
        let methodKey = method.toLowerCase().replace(' ', '');
        if (method === 'Bank Transfer') {
            methodKey = 'bank';
        }
        
        setDetails(prev => ({
            ...prev,
            [methodKey]: {
                ...prev[methodKey],
                [field]: e.target.value,
            }
        }));
    };

    const renderMethodInputs = () => {
        const disabled = !isEditing || isSaving;
        switch (selectedMethod) {
            case 'PayPal':
                return (
                    <div className="w-full">
                        <label className="block text-sm font-medium text-slate-700 mb-1">PayPal Email</label>
                        <input
                            type="email"
                            value={paypal?.email || ''}
                            onChange={handleDetailChange('PayPal', 'email')}
                            placeholder="paypal@example.com"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                            required
                            disabled={disabled}
                        />
                    </div>
                );
            case 'UPI':
                return (
                    <div className="w-full">
                        <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID</label>
                        <input
                            type="text"
                            value={upi?.id || ''}
                            onChange={handleDetailChange('UPI', 'id')}
                            placeholder="yourname@bankupi"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                            required
                            disabled={disabled}
                        />
                    </div>
                );
            case 'Bank Transfer':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Account Holder Name</label>
                            <input type="text" value={bank?.accountHolderName || ''} onChange={handleDetailChange('Bank Transfer', 'accountHolderName')} placeholder="Full Name" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed" required disabled={disabled} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                            <input type="text" value={bank?.bankName || ''} onChange={handleDetailChange('Bank Transfer', 'bankName')} placeholder="e.g., State Bank of India" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed" required disabled={disabled} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                            <input type="text" value={bank?.accountNumber || ''} onChange={handleDetailChange('Bank Transfer', 'accountNumber')} placeholder="0123456789" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed" required disabled={disabled} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label>
                            <input type="text" value={bank?.ifscCode || ''} onChange={handleDetailChange('Bank Transfer', 'ifscCode')} placeholder="ABCD0001234" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed" required disabled={disabled} />
                        </div>
                    </div>
                );
            default:
                return <p className="text-sm text-slate-500">Select a withdrawal method above.</p>;
        }
    };

    const buttonText = isDetailsSaved ? 'Update Details' : 'Save Details';

    return (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5"/> Payout Method
                {isDetailsSaved && !isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="ml-auto px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors flex items-center gap-1"
                    >
                        <Pencil className="w-3 h-3"/> Edit
                    </button>
                )}
            </h3>
            
            <p className='text-sm text-slate-600 mb-4'>
                {isDetailsSaved && !isEditing 
                    ? `Current method: ${selectedMethod}. Click 'Edit' to change or update details.` 
                    : "Select one method to use for all your future withdrawals. Only the details for the selected method will be saved."
                }
            </p>
            
            <div className="flex flex-wrap gap-3 mb-6">
                {allMethods.map(method => (
                    <button
                        key={method}
                        onClick={() => handleMethodChange(method)}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                            selectedMethod === method
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-slate-700 border border-slate-300 hover:bg-indigo-50 hover:border-indigo-300'
                        }`}
                        disabled={isSaving || !isEditing}
                    >
                        {method}
                    </button>
                ))}
            </div>

            <div className="mb-4 flex flex-col items-start gap-4">
                {renderMethodInputs()}
            </div>
            
            {isEditing && (
                <div className="flex gap-4 items-center">
                    <button 
                        onClick={onSubmit} 
                        disabled={isSaving}
                        className="w-full sm:w-auto mt-2 px-6 py-3 text-sm font-bold text-white bg-green-500 rounded-lg shadow hover:bg-green-600 transition-colors flex items-center gap-2 justify-center disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : buttonText} <Save className="w-4 h-4"/>
                    </button>
                    {isDetailsSaved && (
                        <button 
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="w-full sm:w-auto mt-2 px-6 py-3 text-sm font-bold text-slate-700 bg-slate-200 rounded-lg shadow hover:bg-slate-300 transition-colors flex items-center gap-2 justify-center disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const Withdrawal = ({ withdrawal: data, fetchData }) => {
    const { data: session } = useSession();
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [isSavingDetails, setIsSavingDetails] = useState(false);
    const MINIMUM_WITHDRAWAL_AMOUNT = 5.00;

    const { availableBalance = 0, pendingBalance = 0, totalWithdrawn = 0, history = [], withdrawalDetails } = data || {};

    const isDetailsSaved = useMemo(() => {
        return !!(withdrawalDetails && withdrawalDetails.selectedMethod);
    }, [withdrawalDetails]);
    
    const [paymentDetails, setPaymentDetails] = useState(() => {
        if (withdrawalDetails && withdrawalDetails.selectedMethod) {
            return {
                selectedMethod: withdrawalDetails.selectedMethod,
                paypal: withdrawalDetails.paypal || {},
                upi: withdrawalDetails.upi || {},
                bank: withdrawalDetails.bank || {}
            };
        }
        return {
            selectedMethod: 'PayPal',
            paypal: {},
            upi: {},
            bank: {}
        };
    });

    useEffect(() => {
        if (withdrawalDetails) {
            setPaymentDetails({
                selectedMethod: withdrawalDetails.selectedMethod || 'PayPal',
                paypal: withdrawalDetails.paypal || {},
                upi: withdrawalDetails.upi || {},
                bank: withdrawalDetails.bank || {}
            });
        }
    }, [withdrawalDetails]);


    const isDetailsComplete = useMemo(() => {
        const method = paymentDetails.selectedMethod;
        const details = paymentDetails[method.toLowerCase().replace(' ', '')]; 
        if (!details) return false;

        switch (method) {
            case 'PayPal':
                return !!details.email && details.email.includes('@');
            case 'UPI':
                return !!details.id;
            case 'Bank Transfer':
                return !!details.bankName && !!details.accountNumber && !!details.ifscCode && !!details.accountHolderName;
            default:
                return false;
        }
    }, [paymentDetails]);

    const handleSaveDetails = async () => {
        if (!session?.user?.email) {
            setIsError(true);
            setMessage('Authentication error: User email not available.');
            setTimeout(() => setMessage(''), 5000);
            return;
        }

        if (!isDetailsComplete) {
            setIsError(true);
            setMessage('Please fill in all required fields for the selected withdrawal method.');
            setTimeout(() => setMessage(''), 5000);
            return;
        }
        
        setIsSavingDetails(true);
        try {
            const response = await fetch('/api/save-withdrawal', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: session.user.email, details: paymentDetails }),
            });
            const resData = await response.json();
            if (!response.ok) throw new Error(resData.error || 'Failed to save details.');
            
            fetchData(session.user.email); 
            setMessage('Payment details saved successfully! The form is now locked.');
            setIsError(false);
        } catch (error) {
            setIsError(true);
            setMessage(error.message);
        } finally {
            setIsSavingDetails(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const handleWithdraw = async () => {
        if (!session?.user?.email) {
            setIsError(true);
            setMessage('Authentication error: User email not available.');
            return;
        }
        if (availableBalance < MINIMUM_WITHDRAWAL_AMOUNT) {
            setIsError(true);
            setMessage(`Minimum withdrawal is ${formatCurrency(MINIMUM_WITHDRAWAL_AMOUNT)}.`);
            return;
        }
        
        if (!isDetailsComplete) {
            setIsError(true);
            setMessage('Please save your complete withdrawal account details first.');
            return;
        }
        
        setIsWithdrawing(true);
        try {
            const response = await fetch('/api/req-withdrawal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: session.user.email, amount: availableBalance }),
            });
            const resData = await response.json();
            if (!response.ok) throw new Error(resData.error || 'Request failed.');
            fetchData(session.user.email);
            setMessage('Withdrawal request sent! Your funds are now in Pending.');
            setIsError(false);
        } catch (error) {
            setIsError(true);
            setMessage(error.message);
        } finally {
            setIsWithdrawing(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 font-sans">
            <h2 className='text-3xl font-bold mb-6 text-slate-800'>Withdrawal</h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8'>
                <BalanceCard icon={Wallet} title="Available" amount={availableBalance} color="bg-green-500" />
                <BalanceCard icon={Hourglass} title="Pending" amount={pendingBalance} color="bg-orange-500" />
                <BalanceCard icon={CircleCheck} title="Total Withdrawn" amount={totalWithdrawn} color="bg-blue-500" />
            </div>
            
            <hr className="my-8 border-slate-200" />

            <WithdrawalDetailsForm 
                details={paymentDetails} 
                setDetails={setPaymentDetails} 
                onSubmit={handleSaveDetails} 
                isSaving={isSavingDetails}
                isDetailsSaved={isDetailsSaved} 
                initialSavedDetails={withdrawalDetails} 
            />

            <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <button 
                        onClick={handleWithdraw} 
                        disabled={availableBalance < MINIMUM_WITHDRAWAL_AMOUNT || isWithdrawing || !isDetailsComplete} 
                        className={`w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg ${!isDetailsComplete ? 'opacity-50' : 'hover:scale-[1.02]'} transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isWithdrawing ? 'Processing...' : `Request ${formatCurrency(availableBalance)}`}
                    </button>
                    <div>
                        <p className="text-slate-600">
                            Minimum withdrawal: <strong className="text-slate-800">{formatCurrency(MINIMUM_WITHDRAWAL_AMOUNT)}</strong>. 
                        </p>
                        <p className="text-slate-600 mt-1">
                            Status: {isDetailsComplete 
                                ? <span className="text-green-600 font-semibold ml-1">Payout details are set!</span>
                                : <span className="text-red-600 font-semibold ml-1">Payout details are missing or incomplete.</span>
                            }
                        </p>
                        {message && <p className={`mt-2 text-sm font-bold ${isError ? 'text-red-500' : 'text-green-600'}`}><Info className="w-4 h-4 inline-block mr-1"/>{message}</p>}
                    </div>
                </div>
            </div>
            
            <hr className="my-8 border-slate-200" />

            <div className="bg-white rounded-2xl shadow-md">
                <h3 className="text-xl font-semibold text-slate-800 p-4 sm:p-6">Withdrawal History</h3>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Method</th>
                                <th scope="col" className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-3 py-3 sm:px-6 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {history.length > 0 ? history.map(item => (
                                <tr key={item.withdrawalId || `${item.date}-${item.totalAmount}`} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-4 sm:px-6 whitespace-nowrap text-sm font-mono text-slate-500">#{item.withdrawalId}</td>
                                    <td className="px-3 py-4 sm:px-6 whitespace-nowrap text-sm text-slate-700">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="px-3 py-4 sm:px-6 whitespace-nowrap text-sm font-medium text-slate-600">{item.withdrawalMethod}</td>
                                    <td className="px-3 py-4 sm:px-6 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                                    <td className="px-3 py-4 sm:px-6 whitespace-nowrap font-bold text-slate-800 text-right">{formatCurrency(item.totalAmount)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-slate-500">No history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 p-4 sm:p-6 bg-slate-100 rounded-2xl">
                <h4 className="font-semibold text-slate-700 mb-3">Status Descriptions</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-3"><StatusBadge status="Pending" /><span>- The payment is being checked by our team.</span></li>
                    <li className="flex items-start gap-3"><StatusBadge status="Approved" /><span>- The payment has been approved and is waiting to be sent.</span></li>
                    <li className="flex items-start gap-3"><StatusBadge status="Complete" /><span>- The payment has been successfully sent to your payment account.</span></li>
                    <li className="flex items-start gap-3"><StatusBadge status="Cancelled" /><span>- The payment has been cancelled by your request or our team.</span></li>
                    <li className="flex items-start gap-3"><StatusBadge status="Returned" /><span>- The payment has been returned to your account by our team.</span></li>
                </ul>
            </div>

        </div>
    );
};

export default Withdrawal;