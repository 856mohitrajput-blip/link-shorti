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
            <header className="flex-shrink-0 flex w-full h-20 items-center justify-between px-4 sm:px-6 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center min-w-0">
                    <button onClick={toggleSidebar} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 mr-4 md:hidden transition-colors" aria-label="Open sidebar">
                        <Menu className="w-5 h-5 text-slate-700" />
                    </button>
                    <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent truncate">{pageTitles.default}</h1>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button 
                        onClick={() => signOut({ callbackUrl: '/' })} 
                        className="group relative whitespace-nowrap rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10">Sign Out</span>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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