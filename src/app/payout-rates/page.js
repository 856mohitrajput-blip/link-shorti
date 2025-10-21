'use client';
import Image from 'next/image';

const rates = [
    { country: 'United States', code: 'US', rate: 22.0 },
    { country: 'United Kingdom', code: 'GB', rate: 21.0 },
    { country: 'Germany', code: 'DE', rate: 20.0 },
    { country: 'Australia', code: 'AU', rate: 18.0 },
    { country: 'Canada', code: 'CA', rate: 17.0 },
    { country: 'France', code: 'FR', rate: 16.0 },
    { country: 'Sweden', code: 'SE', rate: 15.0 },
    { country: 'Netherlands', code: 'NL', rate: 14.0 },
    { country: 'India', code: 'IN', rate: 10.0 },
    { country: 'Rest of World', code: 'WW', rate: 5.0 },
];

const PayoutInfoCard = ({ title, value }) => (
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-lg md:text-xl font-semibold text-gray-400">{title}</h3>
        <p className="text-2xl md:text-3xl font-bold text-white mt-2">{value}</p>
    </div>
);

export default function PayoutRatesPage() {
    return (
        <div className="text-white p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-500 drop-shadow-md">
                        Payout Rates
                    </h1>
                    <p className="mx-auto mt-4 text-base md:text-lg text-gray-400 max-w-2xl">
                        We offer the most competitive payout rates in the industry. Below are the rates per 1000 views.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-12">
                    <PayoutInfoCard title="Minimum Payout" value="$5" />
                    <PayoutInfoCard title="Payment Frequency" value="Daily" />
                    <PayoutInfoCard title="Payment Methods" value="PayPal, Bank & UPI" />
                </div>

                <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="p-6 text-lg font-semibold">Country</th>
                                <th className="p-6 text-lg font-semibold text-right">Rate (per 1000 views)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rates.map((rate, index) => (
                                <tr key={index} className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
                                    <td className="p-5 text-lg flex items-center">
                                        <Image 
                                            src={rate.code === 'WW' ? 'https://cdn-icons-png.flaticon.com/512/616/616616.png' : `https://flagsapi.com/${rate.code}/flat/64.png`}
                                            alt={`${rate.country} flag`}
                                            width={40}
                                            height={rate.code === 'WW' ? 40 : 30}
                                            className="mr-4"
                                        />
                                        {rate.country}
                                    </td>
                                    <td className="p-5 text-lg text-right font-mono bg-gray-900/50">${rate.rate.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}