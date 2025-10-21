"use client";
import React, { useState, useCallback, useEffect } from 'react';
import SideBar from '@/components/SideBar';
import { MainContent } from '@/components/MainContent';
import { useSession } from 'next-auth/react'; 

const DashboardPage = () => {
  const [activeContent, setActiveContent] = useState('statistics');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => {
      setIsSidebarOpen((prev) => !prev);
  }, []);
  
  const { data: session } = useSession();
  const email = session?.user?.email;
  const [dashboardData, setDashboardData] = useState({ statistics: null, links: [], withdrawal: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (userEmail) => {
    if (!userEmail) {
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
        const response = await fetch('/api/dashboard', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to fetch dashboard data: Status ${response.status}`);
        }
 
        const data = await response.json();
        
        setDashboardData({
            statistics: data.statistics,
            links: data.links || [], 
            withdrawal: data.withdrawal,
        });

    } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || 'An unknown error occurred while fetching data.');
    } finally {
        setIsLoading(false);
    }

  }, []);

  useEffect(() => {
    if (email) {
        fetchData(email);
    } else if (session !== undefined && !session) {
          setIsLoading(false);
    }
  }, [email, fetchData, session]);

  return (
    <div className="flex bg-gray-50 min-h-screen"> 
      <SideBar 
        activeContent={activeContent} 
        setActiveContent={setActiveContent} 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      <div className='w-[100%]'>
        <MainContent 
          activeContent={activeContent} 
          toggleSidebar={toggleSidebar} 
          statistics={dashboardData.statistics}
          links={dashboardData.links}
          withdrawal={dashboardData.withdrawal}
          fetchData={fetchData}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default DashboardPage;