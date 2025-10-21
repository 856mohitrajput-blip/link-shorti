"use client"
import React, {useState, useEffect} from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation'

const CommonLayout = ({children}) => {
    const pathname = usePathname();
    const [isCommonLayoutVisible, setIsCommonLayoutVisible] = useState(true);

    useEffect(()=>{
        if ((pathname === '/join-now') || (pathname === '/dashboard')) {
          setIsCommonLayoutVisible(false)
        } else {
            setIsCommonLayoutVisible(true)
        }
      },[pathname])

    return (
        <>
            {isCommonLayoutVisible && <Header />}
                {children}
            {isCommonLayoutVisible && <Footer />}
        </>
    );
}

export default CommonLayout;
