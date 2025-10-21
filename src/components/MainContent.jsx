"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { Menu } from 'lucide-react';

import Statistics from '@/components/Statistics';
import ManageLinks from '@/components/ManageLinks';
import Withdrawal from '@/components/Withdrawal';

const Refferals = () => (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 font-sans">
        <h2 className='text-3xl font-bold mb-6 text-slate-800'>Referrals</h2>
        <div className='bg-white p-8 rounded-2xl shadow-md'>
            <p className='text-lg font-medium text-slate-700'>Coming soon!</p>
        </div>
    </div>
);

export const MainContent = ({ activeContent, toggleSidebar, statistics, links, withdrawal, fetchData, isLoading, error }) => {
    const pageTitles = {
        statistics: 'Statistics',
        'manage-links': 'Manage Links',
        withdrawal: 'Withdrawal',
        refferals: 'Referrals',
        default: 'Dashboard'
    };
    
    const contentMap = useMemo(() => ({
        statistics: <Statistics statistics={statistics} links={links} />,
        'manage-links': <ManageLinks links={links} fetchData={fetchData} />, 
        withdrawal: <Withdrawal withdrawal={withdrawal} fetchData={fetchData} />,
        refferals: <Refferals />,
    }), [statistics, links, withdrawal, fetchData]);

    return (
        <div className="h-screen flex flex-col">
            <header className="flex-shrink-0 flex w-full h-20 items-center justify-between px-4 sm:px-6 bg-white border-b sticky top-0 z-10">
                <div className="flex items-center min-w-0">
                    <button onClick={toggleSidebar} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 mr-4 md:hidden" aria-label="Open sidebar">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{pageTitles.default}</h1>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="whitespace-nowrap rounded-full bg-cyan-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-cyan-400 shadow-md">
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="overflow-y-auto">
                {isLoading && <div className="text-center py-20"><p>Loading...</p></div>}
                {error && <div className="text-center py-20 text-red-500"><p>{error}</p></div>}
                {!isLoading && !error && (contentMap[activeContent] || <div className='p-6 text-center'><p>Select a section</p></div>)}
            </main>
        </div>
    );
};