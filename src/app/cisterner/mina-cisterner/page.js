'use client';

import Layout from '../../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MinaCisterner() {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredPage, setHoveredPage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('alla');
  const [tankData, setTankData] = useState([]);
  const [openActionsMenu, setOpenActionsMenu] = useState(null);
  const [menuStyle, setMenuStyle] = useState({});
  const [progressDataCache, setProgressDataCache] = useState({});
  const router = useRouter();

  // Load tanks from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        let tanks = JSON.parse(localStorage.getItem('tankData') || '[]');
        
        // Lägg till exempel-cisterner om det inte finns några
        if (tanks.length === 0) {
          const exampleTanks = [
            {
              id: '#1234567',
              namn: 'Cistern 1234567',
              volym: '5000',
              totalVolym: '5000', // Samma som volym
              produkt: 'Diesel',
              registreringsdatum: '2019-05-22',
              modell: 'X2921-221911',
              serienummer: 'CI3939494-2223-111-2',
              senasteBesiktning: '2024-11-12',
              kommentar: 'Fungerar bra',
              status: 'Online',
              tillverkare: 'MPP',
              agare: 'Johnnys Gräv',
              senasteService: '2024-11-12',
              senastUppdaterad: new Date().toLocaleString('sv-SE', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).replace(',', ' |'),
              createdAt: new Date().toISOString()
            },
            {
              id: '#2345678',
              namn: 'Cistern 2345678',
              volym: '3000',
              totalVolym: '3000', // Samma som volym
              produkt: 'Bensin',
              registreringsdatum: '2020-03-15',
              modell: 'X2921-221912',
              serienummer: 'CI3939494-2223-111-3',
              senasteBesiktning: '2024-10-20',
              kommentar: 'Behöver service',
              status: 'Offline',
              tillverkare: 'MPP',
              agare: 'Johnnys Gräv',
              senasteService: '2024-10-20',
              senastUppdaterad: new Date().toLocaleString('sv-SE', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).replace(',', ' |'),
              createdAt: new Date().toISOString()
            }
          ];
          
          tanks = exampleTanks;
          localStorage.setItem('tankData', JSON.stringify(tanks));
        }
        
        setTankData(tanks);
      } catch (error) {
        console.error('Error loading tanks:', error);
        setTankData([]);
      }
    }
  }, []);

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openActionsMenu !== null) {
        setOpenActionsMenu(null);
      }
    };

    // Use both click and touchstart for better mobile support
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [openActionsMenu]);

  // Filter tanks based on search term and filter type
  const filteredTanks = tankData.filter(tank => {
    const matchesSearch = (tank.namn || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'alla' || 
                         (filterType === 'offline' && tank.status === 'Offline') ||
                         (filterType === 'bor-tankas' && tank.status === 'Online') ||
                         (filterType === 'ej-uppkopplade' && tank.status === 'Underhåll');
    
    return matchesSearch && matchesFilter;
  });

  const getRowBackground = (index) => {
    if (hoveredRow === index) {
      return 'bg-gray-100';
    }
    return 'bg-white';
  };

  // Calculate result range based on current page
  const itemsPerPage = 10;
  const totalItems = filteredTanks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  // Get current page items
  const currentPageItems = filteredTanks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageButtonStyle = (pageNumber) => {
    if (pageNumber === hoveredPage) {
      return 'bg-blue-100 text-blue-700';
    }
    if (pageNumber === currentPage) {
      return 'bg-blue-600 text-white';
    }
    return 'bg-white text-gray-700 hover:bg-gray-50';
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleTankClick = (tankId) => {
    router.push(`/cisterner/${tankId.replace('#', '')}`);
  };

  const handleRegisterTank = () => {
    router.push('/cisterner/skapa-cistern');
  };

  // Funktion för att beräkna progress och färg (bara en gång per tank)
  const getProgressData = (tank) => {
    // Kolla om vi redan har genererat progress för denna tank
    if (progressDataCache[tank.id]) {
      return progressDataCache[tank.id];
    }
    
    // Generera ny progress med Math.random() (bara första gången)
    const progressValues = [10, 30, 80];
    const progress = progressValues[Math.floor(Math.random() * progressValues.length)];
    
    let progressData;
    if (progress === 80) {
      progressData = { progress, color: 'green', bgColor: 'bg-green-400', textColor: 'text-green-500' };
    } else if (progress === 30) {
      progressData = { progress, color: 'yellow', bgColor: 'bg-yellow-200', textColor: 'text-yellow-300' };
    } else { // progress === 10
      progressData = { progress, color: 'red', bgColor: 'bg-red-600', textColor: 'text-red-600' };
    }
    
    // Spara i cache så den inte ändras igen
    setProgressDataCache(prev => ({
      ...prev,
      [tank.id]: progressData
    }));
    
    return progressData;
  };

  // Function to refresh tank data (useful when returning from create form)
  const refreshTankData = () => {
    if (typeof window !== 'undefined') {
      try {
        const tanks = JSON.parse(localStorage.getItem('tankData') || '[]');
        setTankData(tanks);
      } catch (error) {
        console.error('Error refreshing tanks:', error);
        setTankData([]);
      }
    }
  };

  // Refresh data when component becomes visible (e.g., when returning from create form)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshTankData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <Layout>
      <div className="">
        <div className="mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-4">
            <div className="rounded-md inline-flex justify-start items-center gap-2 sm:gap-2.5 overflow-x-auto">
              <img src="/home.svg" className="w-4 h-4 text-gray-600 flex-shrink-0" alt="Home" />
              <div className="flex justify-center items-center">
                <div className="justify-start text-gray-700 text-xs sm:text-sm font-medium font-inter leading-tight whitespace-nowrap">Start</div>
              </div>
              <img src="/chevron-right.svg" className="w-4 h-4 text-gray-400 flex-shrink-0" alt="Arrow" />
              <div className="flex justify-center items-center">
                <div className="justify-start text-gray-700 text-xs sm:text-sm font-medium font-inter leading-tight whitespace-nowrap">Cisterner</div>
              </div>
              <img src="/chevron-right.svg" className="w-4 h-4 text-gray-400 flex-shrink-0" alt="Arrow" />
              <div className="flex justify-center items-center">
                <div className="justify-start text-gray-500 text-xs sm:text-sm font-medium font-inter leading-tight whitespace-nowrap">Mina Cisterner</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-6">
            {/* Card 1 - Sensorer aktiva */}
            <div className="self-stretch p-4 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-3">
              <div data-color="Green" data-dark-mode="False" data-size="lg" data-type="Square" className="w-12 h-12 bg-green-100 rounded-lg flex justify-center items-center">
                <img src="/sun.svg" className="w-6 h-6 text-green-700" alt="Sun" />
              </div>
              <div className="flex-1 inline-flex flex-col justify-center items-start">
                <div className="justify-start text-gray-900 text-2xl font-bold font-inter leading-normal">100 %</div>
                <div className="justify-start text-gray-500 text-base font-normal font-inter leading-normal">Sensorer aktiva</div>
              </div>
            </div>

            {/* Card 2 - Cisterner under kritisk nivå */}
            <div className="self-stretch p-4 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-3">
              <div data-color="Red" data-dark-mode="False" data-size="lg" data-type="Square" className="w-12 h-12 bg-red-100 rounded-lg flex justify-center items-center">
                <img src="/exclamation.svg" className="w-6 h-6 text-red-700" alt="Exclamation" />
              </div>
              <div className="flex-1 inline-flex flex-col justify-center items-start">
                <div className="justify-start text-gray-900 text-2xl font-bold font-inter leading-normal">4</div>
                <div className="justify-start text-gray-500 text-base font-normal font-inter leading-normal">Cisterner under kritisk nivå</div>
              </div>
            </div>

            {/* Card 3 - Kommande besiktningar */}
            <div className="self-stretch p-4 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-3">
              <div data-color="Yellow" data-dark-mode="False" data-size="lg" data-type="Square" className="w-12 h-12 bg-yellow-100 rounded-lg flex justify-center items-center">
                <img src="/clipboard-check.svg" className="w-6 h-6 text-yellow-700" alt="Clipboard Check" />
              </div>
              <div className="flex-1 inline-flex flex-col justify-center items-start">
                <div className="justify-start text-gray-900 text-2xl font-bold font-inter leading-normal">12</div>
                <div className="justify-start text-gray-500 text-base font-normal font-inter leading-normal">Kommande besiktningar</div>
              </div>
            </div>

            {/* Card 4 - Planerade tankningar */}
            <div className="self-stretch p-4 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-3">
              <div data-color="Blue" data-dark-mode="False" data-size="lg" data-type="Square" className="w-12 h-12 bg-blue-100 rounded-lg flex justify-center items-center">
                <img src="/newspapperblue.svg" className="w-6 h-6 text-blue-700" alt="Newspaper" />
              </div>
              <div className="flex-1 inline-flex flex-col justify-center items-start">
                <div className="justify-start text-gray-900 text-2xl font-bold font-inter leading-normal">18</div>
                <div className="justify-start text-gray-500 text-base font-normal font-inter leading-normal">Planerade tankningar</div>
              </div>
            </div>
          </div>

          {/* Main Content Box */}
          <div className="bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-x-hidden overflow-y-visible">
            {/* Page Title and Actions */}
            <div className="p-4 sm:p-6 border-b border-gray-200 border-b-0">
              <h1 className="font-semibold text-gray-900 mb-4 text-lg sm:text-xl">Mina Cisterner</h1>
              
              {/* Search and Action Buttons */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-4">
                {/* Left side - Search and filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1 min-w-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <img src="/search-outline.svg" className="h-5 w-5 text-gray-400" alt="Search" />
                    </div>
                    <input
                      type="text"
                      placeholder="Sök"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-700 focus:border-primary-700 text-sm"
                    />
                  </div>
                  
                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Search Button */}
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap">
                      Sök
                    </button>
                    
                    {/* Filter Button */}
                    <button className="px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
                      <img src="/filter.svg" className="w-4 h-4" alt="Filter" />
                      <span className="hidden sm:inline">Filter</span>
                    </button>
                    
                    {/* View Map Button */}
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
                      <img src="/map.svg" className="w-4 h-4" alt="Map" />
                      <span className="hidden sm:inline">Visa Kartvy</span>
                    </button>
                  </div>
                </div>
                
                {/* Right side - Register Tank Button */}
                <div className="flex items-center justify-end">
                  <button 
                    onClick={handleRegisterTank}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <img src="/plus.svg" className="w-4 h-4" alt="Plus" />
                    <span className="hidden sm:inline">Registrera Cistern</span>
                    <span className="sm:hidden">Registrera</span>
                  </button>
                </div>
              </div>
              
              {/* Filter Radio Buttons */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                  <span className="text-sm font-medium text-gray-900 whitespace-nowrap">Visa:</span>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="filter"
                        value="alla"
                        checked={filterType === 'alla'}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-4 h-4 text-primary-700 bg-gray-100 border-gray-300 focus:ring-primary-700"
                      />
                      <span className="text-sm text-gray-900">Alla</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="filter"
                        value="bor-tankas"
                        checked={filterType === 'bor-tankas'}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-4 h-4 text-primary-700 bg-gray-100 border-gray-300 focus:ring-primary-700"
                      />
                      <span className="text-sm text-gray-900">Bör tankas</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="filter"
                        value="offline"
                        checked={filterType === 'offline'}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-4 h-4 text-primary-700 bg-gray-100 border-gray-300 focus:ring-primary-700"
                      />
                      <span className="text-sm text-gray-900">Offline</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="filter"
                        value="ej-uppkopplade"
                        checked={filterType === 'ej-uppkopplade'}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-4 h-4 text-primary-700 bg-gray-100 border-gray-300 focus:ring-primary-700"
                      />
                      <span className="text-sm text-gray-900">Ej uppkopplade</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 sm:p-4 border-b border-gray-200">
                      <div className="rounded flex justify-start items-start gap-2">
                        <div className="w-4 h-4 bg-gray-50 rounded outline outline-[0.50px] outline-offset-[-0.25px] outline-gray-300" />
                      </div>
                    </th>
                    <th className="p-2 sm:p-4 border-b border-gray-200 border-t-0 text-left">
                      <div className="text-gray-500 text-xs font-semibold font-inter uppercase leading-none">ID</div>
                    </th>
                    <th className="p-2 sm:p-4 border-b border-gray-200 border-t-0 text-left">
                      <div className="text-gray-500 text-xs font-semibold font-inter uppercase leading-none">NAMN</div>
                    </th>
                    <th className="p-2 sm:p-4 border-b border-gray-200 border-t-0 text-left">
                      <div className="text-gray-500 text-xs font-semibold font-inter uppercase leading-none">STATUS</div>
                    </th>
                    <th className="p-2 sm:p-4 border-b border-gray-200 border-t-0 text-left">
                      <div className="text-gray-500 text-xs font-semibold font-inter uppercase leading-none">PRODUKT</div>
                    </th>
                    <th className="p-2 sm:p-4 border-b border-gray-200 border-t-0 text-left">
                      <div className="text-gray-500 text-xs font-semibold font-inter uppercase leading-none">VOLYM (L)</div>
                    </th>
                    <th className="p-2 sm:p-4 border-b border-gray-200 border-t-0 text-left">
                      <div className="flex items-center gap-1">
                        <div className="text-gray-500 text-xs font-semibold font-inter uppercase leading-none">SENAST UPPDATERAD</div>
                        <img src="/chevron-sort.svg" className="w-3 h-3 text-gray-400 hidden sm:block" alt="Sort" />
                      </div>
                    </th>
                    <th className="p-2 sm:p-4 border-b border-gray-200 border-t-0 text-left">
                      <div className="text-gray-500 text-xs font-semibold font-inter uppercase leading-none">NIVÅ</div>
                    </th>
                    <th className="p-2 sm:p-4 border-b border-gray-200 border-t-0 text-center">
                      <div className="text-gray-500 text-xs font-semibold font-inter uppercase leading-none"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageItems.map((tank, index) => (
                    <tr 
                      key={index}
                      className={`${getRowBackground(index)} border-b border-gray-200 cursor-pointer hover:bg-gray-50`}
                      onMouseEnter={() => setHoveredRow(index)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => handleTankClick(tank.id)}
                    >
                      <td className="p-2 sm:p-4">
                        <div className="rounded flex justify-start items-start gap-2">
                          <div className="w-4 h-4 bg-gray-50 rounded outline outline-[0.50px] outline-offset-[-0.25px] outline-gray-300" />
                        </div>
                      </td>
                      <td className="p-2 sm:p-4">
                        <div className="text-gray-900 text-sm font-medium font-inter leading-tight">{tank.id}</div>
                      </td>
                      <td className="p-2 sm:p-4">
                        <div className="text-gray-900 text-sm font-medium font-inter leading-tight">{tank.namn || 'N/A'}</div>
                      </td>
                      <td className="p-2 sm:p-4">
                        <div className="text-gray-900 text-sm font-medium font-inter leading-tight">{tank.status || 'N/A'}</div>
                      </td>
                      <td className="p-2 sm:p-4">
                        <div className="text-gray-900 text-sm font-medium font-inter leading-tight">{tank.produkt || 'N/A'}</div>
                      </td>
                      <td className="p-2 sm:p-4">
                        <div className="text-gray-900 text-sm font-medium font-inter leading-tight">5000</div>
                      </td>
                      <td className="p-2 sm:p-4">
                        <div>
                          <span className="text-gray-900 text-sm font-medium font-inter leading-tight">{(tank.senastUppdaterad || '').split(' | ')[0]} </span>
                          <span className="text-gray-900 text-sm font-medium font-inter leading-tight block sm:inline"> {(tank.senastUppdaterad || '').split(' | ')[1]}</span>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4">
                        {(() => {
                          const progressData = getProgressData(tank);
                          const progressWidth = progressData.progress === 80 ? 'w-12' : 
                                               progressData.progress === 30 ? 'w-6' : 'w-2.5';
                          const remainingWidth = progressData.progress === 80 ? 'w-5' : 
                                                progressData.progress === 30 ? 'w-11' : 'w-14';
                          
                          return (
                            <div className="inline-flex justify-start items-center gap-2">
                              <div className="w-16 h-2.5 flex justify-start items-center">
                                <div className={`${progressWidth} self-stretch ${progressData.bgColor} rounded-tl-lg rounded-bl-lg`} />
                                <div className={`${remainingWidth} self-stretch bg-gray-100 rounded-tr-lg rounded-br-lg`} />
                              </div>
                              <div className={`w-11 text-center justify-start ${progressData.textColor} text-xs font-medium font-['Inter'] leading-none`}>
                                {progressData.progress} %
                              </div>
                            </div>
                          );
                        })()}
                      </td>
                      <td 
                        className="p-1 sm:p-2 cursor-pointer hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          const buttonRect = e.currentTarget.getBoundingClientRect();
                          setMenuStyle({
                            left: `${buttonRect.right - 160}px`, // 160px is the menu width (w-40)
                            top: `${buttonRect.top - 4}px` // Position above the button
                          });
                          setOpenActionsMenu(openActionsMenu === index ? null : index);
                        }}
                      >
                        <div className="h-8 px-2 py-1 flex justify-center items-center relative">
                          <div className="p-1.5 flex justify-start items-start gap-2.5">
                            <div className="w-4 h-4 relative overflow-hidden">
                              <img src="/dots-horizontal.svg" className="w-4 h-4 text-gray-500" alt="Actions" />
                            </div>
                          </div>
                          
                          {/* Actions Dropdown Menu */}
                          {openActionsMenu === index && (
                            <div className="w-40 fixed bg-white rounded-lg shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] shadow-lg inline-flex flex-col justify-start items-start overflow-visible z-[9999] min-w-max transform -translate-y-full" style={menuStyle}>
                              <div className="self-stretch py-1 flex flex-col justify-start items-start">
                                <div 
                                  className="self-stretch px-4 py-2 inline-flex justify-start items-center gap-3 cursor-pointer hover:bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTankClick(tank.id);
                                    setOpenActionsMenu(null);
                                  }}
                                >
                                  <img src="/eye.svg" className="w-4 h-4 text-gray-500" alt="Visa detaljer" />
                                  <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-tight">Visa detaljer</div>
                                </div>
                                <div className="self-stretch px-4 py-2 inline-flex justify-start items-center gap-3 cursor-pointer hover:bg-gray-50">
                                  <img src="/map-pin-alt.svg" className="w-4 h-4 text-gray-500" alt="Visa på karta" />
                                  <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-tight">Visa på Karta</div>
                                </div>
                                <div className="self-stretch px-4 py-2 inline-flex justify-start items-center gap-3 cursor-pointer hover:bg-gray-50">
                                  <img src="/newspapper.svg" className="w-4 h-4 text-gray-500" alt="Beställ tankning" />
                                  <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-tight">Beställ tankning</div>
                                </div>
                                <div className="self-stretch px-4 py-2 inline-flex justify-start items-center gap-3 cursor-pointer hover:bg-gray-50">
                                  <img src="/truckgray.svg" className="w-4 h-4 text-gray-500" alt="Boka transport" />
                                  <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-tight">Boka transport</div>
                                </div>
                                <div className="self-stretch px-4 py-2 inline-flex justify-start items-center gap-3 cursor-pointer hover:bg-gray-50">
                                  <img src="/coggray.svg" className="w-4 h-4 text-gray-500" alt="Beställa service" />
                                  <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-tight">Beställa service</div>
                                </div>
                                <div className="self-stretch px-4 py-2 inline-flex justify-start items-center gap-3 cursor-pointer hover:bg-gray-50">
                                  <img src="/life-buoy.svg" className="w-4 h-4 text-gray-500" alt="Anmäl skada" />
                                  <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-tight">Anmäl skada</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>


              {/* Pagination */}
              <div className="p-3 sm:p-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm font-normal font-inter leading-tight">
                    {totalItems > 0 ? `${startItem}-${endItem} av ${totalItems}` : 'Inga resultat'}
                  </span>
                </div>
                
                <div className="h-8 rounded outline outline-1 outline-offset-[-0.50px] outline-gray-300 flex items-center overflow-hidden">
                  {/* Previous Page Button */}
                  <div 
                    className="h-8 px-3 bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    onMouseEnter={() => setHoveredPage('prev')}
                    onMouseLeave={() => setHoveredPage(null)}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <img src="/chevron-right.svg" className="w-4 h-4 text-gray-500 rotate-180" alt="Previous" />
                  </div>
                  
                  {/* Page 1 */}
                  <div 
                    className={`h-8 px-3 outline outline-1 outline-offset-[-0.50px] outline-gray-300 flex items-center justify-center cursor-pointer ${getPageButtonStyle(1)}`}
                    onMouseEnter={() => setHoveredPage(1)}
                    onMouseLeave={() => setHoveredPage(null)}
                    onClick={() => handlePageChange(1)}
                  >
                    <span className="text-sm font-medium font-inter leading-tight">1</span>
                  </div>
                  
                  {/* Page 2 */}
                  <div 
                    className={`h-8 px-3 outline outline-1 outline-offset-[-0.50px] outline-gray-300 flex items-center justify-center cursor-pointer ${getPageButtonStyle(2)} hidden sm:flex`}
                    onMouseEnter={() => setHoveredPage(2)}
                    onMouseLeave={() => setHoveredPage(null)}
                    onClick={() => handlePageChange(2)}
                  >
                    <span className="text-sm font-medium font-inter leading-tight">2</span>
                  </div>
                  
                  {/* Page 3 */}
                  <div 
                    className={`h-8 px-3 outline outline-1 outline-offset-[-0.50px] outline-gray-300 flex items-center justify-center cursor-pointer ${getPageButtonStyle(3)} hidden md:flex`}
                    onMouseEnter={() => setHoveredPage(3)}
                    onMouseLeave={() => setHoveredPage(null)}
                    onClick={() => handlePageChange(3)}
                  >
                    <span className="text-sm font-medium font-inter leading-tight">3</span>
                  </div>
                  
                  {/* Ellipsis */}
                  <div className="h-8 px-3 bg-white outline outline-1 outline-offset-[-0.50px] outline-gray-300 flex items-center justify-center hidden md:flex">
                    <span className="text-gray-500 text-sm font-medium font-inter leading-tight">...</span>
                  </div>
                  
                  {/* Page 10 */}
                  <div 
                    className={`h-8 px-3 outline outline-1 outline-offset-[-0.50px] outline-gray-300 flex items-center justify-center cursor-pointer ${getPageButtonStyle(10)} hidden lg:flex`}
                    onMouseEnter={() => setHoveredPage(10)}
                    onMouseLeave={() => setHoveredPage(null)}
                    onClick={() => handlePageChange(10)}
                  >
                    <span className="text-sm font-medium font-inter leading-tight">10</span>
                  </div>
                  
                  {/* Next Page Button */}
                  <div 
                    className="h-8 px-3 bg-white outline outline-1 outline-offset-[-0.50px] outline-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    onMouseEnter={() => setHoveredPage('next')}
                    onMouseLeave={() => setHoveredPage(null)}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <img src="/chevron-right.svg" className="w-4 h-4 text-gray-500" alt="Next" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
