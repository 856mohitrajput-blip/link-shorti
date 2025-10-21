'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BarChart3,
  Link as LinkIcon,
  DollarSign,
  Users,
  Percent,
  HelpCircle,
  Headset,
  Menu,
  ChevronLeft,

} from 'lucide-react';
import { useSession } from "next-auth/react";

const SidebarItem = ({ icon, text, active, expanded, onClick }) => (
  <li
    className={`
      relative flex items-center py-2 px-3 my-1
      font-medium rounded-md cursor-pointer
      transition-colors group
      ${
        active
          ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
          : 'hover:bg-indigo-50 text-gray-600'
      }
  `}
    onClick={onClick}
  >
    {icon}
    <span
      className={`overflow-hidden transition-all ${
        expanded ? 'w-52 ml-3' : 'w-0'
      }`}
    >
      {text}
    </span>
    {!expanded && (
      <div
        className={`
        absolute left-full rounded-md px-2 py-1 ml-6
        bg-indigo-100 text-indigo-800 text-sm
        invisible opacity-20 -translate-x-3 transition-all
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
    `}
      >
        {text}
      </div>
    )}
  </li>
);

const SideBar = ({ activeContent, setActiveContent, isSidebarOpen, toggleSidebar }) => {
  const [expanded, setExpanded] = useState(true); 
  const { data: session } = useSession();

  const handleItemClick = (contentId, path) => {
    if (contentId) {
      setActiveContent(contentId);
    }
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };


  const sidebarItems = [
    { icon: <BarChart3 size={20} />, text: 'Statistics', contentId: 'statistics' },
    { icon: <LinkIcon size={20} />, text: 'Manage Links', contentId: 'manage-links' },
    { icon: <DollarSign size={20} />, text: 'Withdrawal', contentId: 'withdrawal' },
    { icon: <Users size={20} />, text: 'Refferals', contentId: 'refferals' },
    { icon: <Percent size={20} />, text: 'Payout rates', path: '/payout-rates' },
    { icon: <HelpCircle size={20} />, text: 'Faqs', path: '/faqs' },
    { icon: <Headset size={20} />, text: 'Support', path: '/contact' },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}

          md:relative md:translate-x-0 md:transition-all
          ${expanded ? 'w-80' : 'w-20'}
        `}
      >
        <nav className="h-full flex flex-col bg-white border-r shadow-sm w-full">
          <div className="p-4 pb-2 flex justify-between items-center flex-shrink-0">
            <Link
              href="/"
              className={`${expanded ? 'flex' : 'hidden'} items-center gap-3 `}
              onClick={() => handleItemClick()} 
            >
              <Image 
                src="/logo.jpg" 
                alt="LinkShorti Logo" 
                width={24} 
                height={24} 
                className="rounded-md"
              />
              <span className="text-xl font-bold">LinkShorti</span>
            </Link>
            
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 md:hidden"
            >
              <ChevronLeft />
            </button>
            <button onClick={() => setExpanded(curr => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 hidden md:block">
              {expanded ? <ChevronLeft /> : <Menu />}
            </button>
          </div>

          <ul className="flex-1 px-3">
            {sidebarItems.map((item, index) => {
              if (item.path) {
                return (
                  <Link href={item.path} key={index} onClick={() => handleItemClick(null, item.path)}>
                    <SidebarItem
                      icon={item.icon}
                      text={item.text}
                      expanded={expanded}
                      active={activeContent === item.contentId}
                    />
                  </Link>
                );
              }
              return (
                <SidebarItem
                  key={index}
                  icon={item.icon}
                  text={item.text}
                  expanded={expanded}
                  active={activeContent === item.contentId}
                  onClick={() => handleItemClick(item.contentId)}
                />
              );
            })}
          </ul>

          <div className="border-t flex p-3 flex-shrink-0">
            <div
              className={`justify-between items-center w-full transition-all ${expanded ? 'flex w-52 ml-3' : 'w-0 hidden'}
            `}
            >
              <div className="leading-4">
                <h4 className="font-semibold">{session?.user?.fullName || 'User Name'}</h4>
                <span className="text-xs text-gray-600">{session?.user?.email || 'user@example.com'}</span>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;