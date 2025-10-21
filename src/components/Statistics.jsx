"use client";
import React, { useMemo, useState } from 'react';
import {
    Eye, CheckCircle2, DollarSign, BarChart3, Copy, Check
} from 'lucide-react';

const SHORTENER_DOMAIN = process.env.NEXT_PUBLIC_SHORTENER_DOMAIN || 'https://yourdomain.com';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const formatNumber = (num) => {
    if (num === undefined || num === null) return 'N/A';
    const numericNum = parseFloat(num);
    if (isNaN(numericNum)) return 'N/A';

    if (numericNum >= 1000000) return (numericNum / 1000000).toFixed(0) + 'M';
    if (numericNum >= 1000) return (numericNum / 1000).toFixed(0) + 'K';

    return numericNum.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(parseFloat(amount))) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg text-sm">
                <p className="font-bold text-indigo-700 mb-1">{`Short URL: ${label}`}</p>
                <p className="text-slate-700">{`Clicks: ${formatNumber(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

const LinkClicksBarChart = ({ links }) => {

    const chartData = useMemo(() => {
        return (links || [])
            .filter(link => (link.clicks || 0) > 0)
            .map(link => ({
                name: `${SHORTENER_DOMAIN}/${link.shortUrl}`,
                clicks: link.clicks || 0,
            }))
            .sort((a, b) => b.clicks - a.clicks);
    }, [links]);

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 bg-slate-50 rounded-lg">
                <p className="text-slate-500 font-medium text-lg">No clicks data to display in the chart yet. 📊</p>
            </div>
        );
    }

    const MIN_HEIGHT = 200;
    const ROW_HEIGHT = 45;
    const dynamicHeight = Math.max(MIN_HEIGHT, chartData.length * ROW_HEIGHT);


    return (
        <ResponsiveContainer width="100%" height={dynamicHeight}>
            <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
                <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#475569"
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickFormatter={(value) => {
                        // Remove the domain part and show just the short code for chart readability
                        const shortCode = value.replace(SHORTENER_DOMAIN + '/', '');
                        return shortCode.length > 15 ? shortCode.substring(0, 13) + '...' : shortCode;
                    }}
                    width={100}
                />

                <XAxis
                    type="number"
                    stroke="#475569"
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickFormatter={formatNumber}
                    label={{ value: 'Total Clicks', position: 'bottom', dy: 10, fill: '#475569', fontWeight: 'bold' }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar dataKey="clicks" fill="#4f46e5" barSize={20} radius={[0, 10, 10, 0]} name="Clicks">
                    {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill="#4f46e5" />
                    ))}
                    <label
                        position="right"
                        content={({ x, y, width, value }) => (
                            <text x={x + width + 5} y={y + 10} fill="#1e293b" textAnchor="start" fontSize={11} fontWeight="600">
                                {formatNumber(value)}
                            </text>
                        )}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

const StatCard = ({ icon, title, value, gradientColors }) => {
    const IconComponent = icon;
    const displayValue = value === undefined || value === null || value === 'N/A' ? '0' : value;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div className="flex items-start justify-between">
                <div className="flex flex-col">
                    <span className="text-slate-500 font-medium text-sm">{title}</span>
                    <span className="text-3xl font-extrabold text-slate-800 mt-1">{displayValue}</span>
                </div>
                <div className={`rounded-full p-3 ${gradientColors} shadow-md`}>
                    <IconComponent className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

const Statistics = ({ statistics: data, links }) => {
    const statistics = data || {};
    const [copiedUrl, setCopiedUrl] = useState('');

    const totalImpressions = formatNumber(statistics.totalImpressions);
    const totalProperViews = formatNumber(statistics.totalProperViews);
    const totalEarnings = formatCurrency(statistics.totalEarnings);
    const averageCPM = formatCurrency(statistics.averageCPM);

    const handleCopy = (url) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(''), 2000);
    };

    const linkTableData = useMemo(() => {
        return (links || [])
            .map(link => ({
                id: link._id,
                name: `${SHORTENER_DOMAIN}/${link.shortUrl}` || 'N/A',
                clicks: formatNumber(link.clicks || 0),
                rawClicks: link.clicks || 0,
            }))
            .sort((a, b) => b.rawClicks - a.rawClicks);
    }, [links]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen font-sans">
            <h2 className='text-3xl font-extrabold mb-8 text-slate-800 border-b pb-2'>Statistics</h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                <StatCard icon={Eye} title="Total Impressions" value={totalImpressions} gradientColors="bg-gradient-to-br from-blue-500 to-blue-700" />
                <StatCard icon={CheckCircle2} title="Proper Views" value={totalProperViews} gradientColors="bg-gradient-to-br from-green-500 to-green-700" />
                <StatCard icon={DollarSign} title="Total Earnings" value={totalEarnings} gradientColors="bg-gradient-to-br from-purple-500 to-purple-700" />
                <StatCard icon={BarChart3} title="Average CPM" value={averageCPM} gradientColors="bg-gradient-to-br from-orange-500 to-orange-700" />
            </div>

            <div className='bg-white p-6 rounded-2xl shadow-xl border border-slate-100 mb-8'>
                <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Link Click Performance</h3>
                <LinkClicksBarChart links={links} />
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <h3 className="text-xl font-bold text-slate-800 p-6 border-b pb-4">Individual Link Performance Table</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead className="border-b border-slate-200 bg-slate-50/50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider min-w-[200px]">Short URL</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider min-w-[100px]">Total Clicks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {linkTableData.length > 0 ? (
                                linkTableData.map((row) => (
                                    <tr key={row.id} className="border-b border-slate-200 last:border-0 hover:bg-indigo-50/20 transition-colors">
                                        <td className="p-4 whitespace-nowrap text-slate-700 font-medium">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-blue-600">{row.name}</span>
                                                <button
                                                    onClick={() => handleCopy(row.name)}
                                                    className="p-1 rounded hover:bg-slate-200 transition-colors"
                                                    aria-label="Copy URL"
                                                >
                                                    {copiedUrl === row.name ?
                                                        <Check className="w-4 h-4 text-green-500" /> :
                                                        <Copy className="w-4 h-4 text-slate-400" />
                                                    }
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-slate-700 font-bold">{row.clicks}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center py-10 text-slate-500 font-medium">No links found or data available to display in the table.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export default Statistics;