'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

const TopNavbar = ({ onToggle, isMenuOpen }) => {
  return (
    <div className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 min-h-[64px]">
      <div className="inline-flex justify-start items-center gap-5">
        <div className="w-10 h-10 relative">
          <Image 
            src="/fuelpool.svg" 
            alt="Fuelpool Logo" 
            width={36} 
            height={40} 
            className="w-9 h-10 left-[0.5px] top-0 absolute"
          />
        </div>
        
        <button
          onClick={onToggle}
          className="w-5 h-5 relative hidden sm:block transition-transform duration-200 hover:scale-110"
        >
          <img 
            src={isMenuOpen ? "/x-outline.svg" : "/bars.svg"} 
            className="w-5 h-5 transition-all duration-200" 
            alt={isMenuOpen ? "Close Menu" : "Open Menu"} 
          />
        </button>
      </div>
      
      <button
        onClick={onToggle}
        className="w-5 h-5 relative sm:hidden transition-transform duration-200 hover:scale-110"
      >
        <img 
          src={isMenuOpen ? "/x-outline.svg" : "/bars.svg"} 
          className="w-5 h-5 transition-all duration-200" 
          alt={isMenuOpen ? "Close Menu" : "Open Menu"} 
        />
      </button>
    </div>
  );
};

const Sidebar = ({ isVisible, shouldAnimate }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [cisternerExpanded, setCisternerExpanded] = useState(false);

  // Öppna dropdown automatiskt om man är på en cistern-sida
  useEffect(() => {
    setCisternerExpanded(pathname.startsWith('/cisterner/'));
  }, [pathname]);


  if (!isVisible) return null;

  const handleNavigation = (path) => {
    router.push(path);
  };


  const isActive = (path) => {
    return pathname === path;
  };

  const isCisternerActive = () => {
    return pathname.startsWith('/cisterner/');
  };

  return (
    <div className={`absolute left-0 top-0 bg-white border-r border-gray-200 h-full z-10 ${
      isVisible ? (shouldAnimate ? 'animate-slide-in' : 'w-64') : 'w-0'
    }`}>
      <div className="flex flex-col h-full">

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 flex flex-col gap-2">
          {/* Dashboard */}
          <div 
            className={`px-2 py-1.5 rounded-lg inline-flex justify-start items-center hover:bg-gray-100 cursor-pointer ${
              isActive('/dashboard') ? 'bg-gray-100' : ''
            }`}
            onClick={() => handleNavigation('/dashboard')}
          >
            <div className="flex justify-start items-center gap-3">
              <img src="/chart-pie.svg" className={`w-4 h-4 ${isActive('/dashboard') ? 'text-gray-900' : 'text-gray-400'}`} alt="Dashboard" />
              <div className={`font-medium font-inter leading-normal overflow-hidden whitespace-nowrap ${
                isActive('/dashboard') ? 'text-gray-900' : 'text-gray-400'
              }`} style={{fontSize: '14px'}}>
                Dashboard
              </div>
            </div>
          </div>

          {/* Mina Cisterner */}
          <div className="flex flex-col gap-2">
            <div 
              className={`px-2 py-1.5 rounded-lg inline-flex justify-between items-center cursor-pointer ${
                isCisternerActive() ? 'bg-gray-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                setCisternerExpanded(!cisternerExpanded);
              }}
            >
              <div className="flex justify-start items-center gap-3">
                <img src="/newspapper.svg" className={`w-4 h-4 ${isCisternerActive() ? 'text-gray-900' : 'text-gray-400'}`} style={{filter: isCisternerActive() ? 'none' : 'opacity(0.5)'}} alt="Cisterner" />
                <div className={`font-medium font-inter leading-normal overflow-hidden whitespace-nowrap ${
                  isCisternerActive() ? 'text-gray-900' : 'text-gray-400'
                }`} style={{fontSize: '14px'}}>
                  Cisterner
                </div>
              </div>
              <img 
                src="/chevron-up.svg"
                className={`w-3 h-3 text-gray-900 transition-transform ${cisternerExpanded ? 'rotate-180' : ''}`} 
                alt="Expand"
              />
            </div>
            
            {cisternerExpanded && (
              <div className="pl-11 flex flex-col gap-4">
                <div 
                  className={`font-medium font-inter leading-normal hover:text-gray-600 cursor-pointer overflow-hidden whitespace-nowrap ${
                    isActive('/cisterner/mina-cisterner') ? 'text-gray-900' : 'text-gray-400'
                  }`}
                  style={{fontSize: '14px'}}
                  onClick={() => handleNavigation('/cisterner/mina-cisterner')}
                >
                  Mina Cisterner
                </div>
                <div 
                  className={`font-medium font-inter leading-normal hover:text-gray-600 cursor-pointer overflow-hidden whitespace-nowrap ${
                    isActive('/cisterner/skapa-cistern') ? 'text-gray-900' : 'text-gray-400'
                  }`}
                  style={{fontSize: '14px'}}
                  onClick={() => handleNavigation('/cisterner/skapa-cistern')}
                >
                  Skapa Cistern
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <div 
            className={`px-2 py-1.5 rounded-lg inline-flex justify-start items-center hover:bg-gray-100 cursor-pointer ${
              isActive('/login') ? 'bg-gray-100' : ''
            }`}
            onClick={() => {
              // Navigera till login
              handleNavigation('/login');
            }}
          >
            <div className="flex justify-start items-center gap-3">
              <img src="/user.svg" className={`w-4 h-4 ${isActive('/login') ? 'text-gray-900' : 'text-gray-400'}`} alt="Logout" />
              <div className={`font-medium font-inter leading-normal overflow-hidden whitespace-nowrap ${
                isActive('/login') ? 'text-gray-900' : 'text-gray-400'
              }`} style={{fontSize: '14px'}}>
                Logga ut
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Layout({ children }) {
  const [sidebarState, setSidebarState] = useState('hidden');
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const pathname = usePathname();

  // Stäng sidebaren när man navigerar
  useEffect(() => {
    setSidebarState('hidden');
    setShouldAnimate(false);
  }, [pathname]);

  useEffect(() => {
    // Reset animation flag after animation completes
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 150); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  const toggleSidebar = () => {
    // Toggle between hidden and expanded states
    if (sidebarState === 'hidden') {
      setSidebarState('expanded');
      setShouldAnimate(true);
    } else {
      setSidebarState('hidden');
      setShouldAnimate(false);
    }
  };

  const isVisible = sidebarState !== 'hidden';

  return (
    <div className="layout-container flex h-screen bg-white overflow-hidden">
      <div className="flex flex-col h-full w-full">
        <TopNavbar onToggle={toggleSidebar} isMenuOpen={isVisible} />
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar 
            isVisible={isVisible}
            shouldAnimate={shouldAnimate}
          />
          
          <div className="flex-1 flex flex-col bg-gray-100 min-w-0 bg-gray-100">
            <main className="flex-1 overflow-auto bg-gray-100 p-[16px]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
