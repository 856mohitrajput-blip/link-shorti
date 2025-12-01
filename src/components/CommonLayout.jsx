"use client"
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation'

const CommonLayout = ({children}) => {
    const pathname = usePathname();
    
    // Check if header/footer should be hidden (no flash)
    const hideLayout = pathname === '/join-now' || pathname === '/dashboard' || pathname === '/admin/login' || pathname === '/forgot-password';

    return (
        <>
            {!hideLayout && <Header />}
                {children}
            {!hideLayout && <Footer />}
        </>
    );
}

export default CommonLayout;
