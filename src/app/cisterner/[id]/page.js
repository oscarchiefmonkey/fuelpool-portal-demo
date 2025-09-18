'use client';

import Layout from '../../../components/Layout';
import AuthGuard from '../../../components/AuthGuard';
import { useParams } from 'next/navigation';
import { getTankById } from '../../../utils/tankStorage';
import { useState, useEffect, Suspense } from 'react';

function TankDetailsContent() {
  const params = useParams();
  const id = params.id;
  const tankId = id ? `#${id}` : null;
  const [tankData, setTankData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState([
    {
      id: 1,
      name: 'besiktningsdokument.zip',
      size: '32 MB',
      type: 'application/zip'
    },
    {
      id: 2,
      name: 'inkopsorder.txt',
      size: '41,5 MB',
      type: 'text/plain'
    }
  ]);

  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    if (tankId) {
      const tank = getTankById(tankId);
      if (tank) {
        setTankData(tank);
        setEditData(tank);
      } else {
        setTankData(null);
      }
    } else {
      setTankData(null);
    }
  }, [tankId]);

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadingDocuments(true);
      // Simulate upload delay
      setTimeout(() => {
        const newFiles = files.map(file => ({
          id: Date.now() + Math.random(),
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          type: file.type
        }));
        setUploadedDocuments(prev => [...prev, ...newFiles]);
        setUploadingDocuments(false);
      }, 1000);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadingImages(true);
      // Simulate upload delay
      setTimeout(() => {
        const newFiles = files.map(file => ({
          id: Date.now() + Math.random(),
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          type: file.type
        }));
        setUploadedImages(prev => [...prev, ...newFiles]);
        setUploadingImages(false);
      }, 1000);
    }
  };

  const handleDocumentDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      type: file.type
    }));
    setUploadedDocuments(prev => [...prev, ...newFiles]);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      type: file.type
    }));
    setUploadedImages(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if (!tankId) {
    return (
      <AuthGuard>
        <Layout>
          <div className="">
            <div className="mx-auto">
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-900">Ingen ID angiven</h1>
                <p className="text-gray-600 mt-2">URL:en måste innehålla ett ID (t.ex. /cisterner/123).</p>
              </div>
            </div>
          </div>
        </Layout>
      </AuthGuard>
    );
  }

  if (!tankData) {
    return (
      <AuthGuard>
        <Layout>
          <div className="">
            <div className="mx-auto">
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-900">Cistern hittades inte</h1>
                <p className="text-gray-600 mt-2">Cisternen med ID {tankId} kunde inte hittas i localStorage.</p>
              </div>
            </div>
          </div>
        </Layout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
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
                <div className="justify-start text-gray-700 text-xs sm:text-sm font-medium font-inter leading-tight whitespace-nowrap">Mina Cisterner</div>
              </div>
              <img src="/chevron-right.svg" className="w-4 h-4 text-gray-400 flex-shrink-0" alt="Arrow" />
              <div className="flex justify-center items-center">
                <div className="justify-start text-gray-500 text-xs sm:text-sm font-medium font-inter leading-tight whitespace-nowrap">Detaljvy</div>
              </div>
            </div>
          </div>

           {/* Cistern Overview Card */}
           <div className="bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-hidden mb-4">
             <div className="p-4 sm:p-6">
               {/* Header */}
               <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-200">
                 <div className="flex items-center gap-2 flex-1">
                   <div>
                     <h1 className="font-semibold text-gray-900 mb-2 text-lg sm:text-xl">
                       Cistern {tankData.id} - {tankData.namn}
                     </h1>
                     <p className="text-gray-600 text-sm sm:text-base">
                       Här kan du se alla detaljer och status på din cistern, samt beställa tjänster.
                     </p>
                   </div>

                 </div>
                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                   <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
                     Redigera
                   </button>
                   <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                     <img src="/map.svg" className="w-4 h-4" alt="Map" />
                     <span className="hidden sm:inline">Visa på Karta</span>
                     <span className="sm:hidden">Karta</span>
                   </button>
                 </div>
               </div>

                <div className="flex flex-col [@media(min-width:1060px)]:flex-row justify-start items-start gap-6 [@media(min-width:1060px)]:gap-8 w-full">
 
                 <div className="w-full [@media(min-width:1060px)]:w-[554px] [@media(min-width:1060px)]:flex-shrink-0">
                   <img className="w-full h-64 sm:h-80 rounded-[37px] object-cover" src="/loginBackground.jpg" />
                 </div>
 
                 {/* Info-kort container */}
                 <div className="flex-1 w-full flex flex-col [@media(min-width:1470px)]:flex-row">
                   {/* Mätning */}
                   <div className="flex-1 pl-4 sm:pl-6 py-4 sm:py-6 bg-white rounded-lg inline-flex flex-col justify-center items-start gap-4 sm:gap-6">
                    <div className="self-stretch flex flex-col justify-center items-start gap-2">
                      <div className="w-44 flex flex-col justify-center items-start gap-0.5">
                        <div className="justify-start text-gray-500 text-sm font-normal leading-none">Batterinivå</div>
                        <div className="justify-start text-gray-400 text-base font-medium leading-normal">[Aktivera nivåbevakning för att se batterinivå]</div>
                      </div>
                      <div className="w-96 h-1.5 inline-flex justify-start items-center">
                        <div className="flex-1 self-stretch bg-gray-100 rounded-tr-lg rounded-br-lg" />
                      </div>
                      <div className="self-stretch inline-flex justify-start items-center gap-3">
                        <div className="justify-center text-gray-500 text-xs font-normal leading-none">Senaste mätningen gjordes: Ingen mätning registrerad</div>
                      </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-center items-start gap-2">
                      <div className="w-44 flex flex-col justify-center items-start gap-0.5">
                        <div className="justify-start text-gray-500 text-sm font-normal leading-none">Volymnivå</div>
                        <div className="justify-start text-gray-400 text-base font-medium leading-normal">[Aktivera nivåbevakning för att se volym]</div>
                      </div>
                      <div className="w-96 h-1.5 inline-flex justify-start items-center">
                        <div className="flex-1 self-stretch bg-gray-100 rounded-tr-lg rounded-br-lg" />
                      </div>
                      <div className="self-stretch inline-flex justify-start items-center gap-3">
                        <div className="justify-center">
                          <span className="text-gray-500 text-xs font-normal leading-none">Senaste mätningen gjordes:</span>
                          <span className="text-gray-500 text-xs font-bold leading-none"> </span>
                          <span className="text-gray-500 text-xs font-normal leading-none">Ingen mätning registrerad</span>
                        </div>
                      </div>
                    </div>
                  </div>

                   {/* Tillbehör */}
                   <div className="w-full [@media(min-width:1470px)]:w-96 pt-4 sm:pt-6 pl-6 [@media(min-width:1470px)]:pl-0 bg-white flex flex-col justify-center items-start gap-4">
                      <div className="w-full lg:w-44 flex flex-col justify-center items-start gap-0.5">
                        <div className="justify-start text-gray-500 text-sm font-normal leading-none">Tillbehör</div>
                      </div>
                      <div className="flex flex-col justify-start items-start gap-2 w-full">
                        <div className="self-stretch inline-flex justify-start items-center gap-2 overflow-hidden">
                          <img src="/dots-vertical.svg" className="w-3.5 h-3.5 flex-shrink-0" alt="Accessory" />
                          <div className="justify-start text-gray-500 text-sm sm:text-base font-normal leading-normal">Pump Fill-Rite 700</div>
                        </div>
                        <div className="self-stretch inline-flex justify-start items-center gap-2 overflow-hidden">
                          <img src="/dots-vertical.svg" className="w-3.5 h-3.5 flex-shrink-0" alt="Accessory" />
                          <div className="justify-start text-gray-500 text-sm sm:text-base font-normal leading-normal">Överfyllnadsskydd (Standard)</div>
                        </div>
                        <div className="self-stretch inline-flex justify-start items-center gap-2 overflow-hidden">
                          <img src="/dots-vertical.svg" className="w-3.5 h-3.5 flex-shrink-0" alt="Accessory" />
                          <div className="justify-start text-gray-500 text-sm sm:text-base font-normal leading-normal">T/V Ventil med flammdämpare</div>
                        </div>
                      </div>
                      <div className="self-stretch inline-flex justify-start items-center gap-3">
                        <div className="justify-center">
                          <span className="text-gray-500 text-xs font-normal leading-none">Senaste service genomförd: </span>
                          <span className="text-gray-900 text-xs font-medium leading-none">2024-11-12</span>
                        </div>
                      </div>  
                   </div>
                 </div>
               </div>
             </div>
           </div>

          {/* Key Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Fyllnadsvolym Card */}
            <div className="bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-hidden">
              <div className="p-4">
                <h3 className="font-medium text-gray-500 mb-1 text-sm sm:text-base">Fyllnadsvolym</h3>
                <p className="font-semibold text-gray-900 text-lg sm:text-xl">{tankData.fyllnadsvolym} liter</p>
                <p className="text-gray-500 text-sm sm:text-base">{tankData.volym} liter total volym</p>
              </div>
            </div>

            {/* Tillverkare Card */}
            <div className="bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-hidden">
              <div className="p-4">
                <h3 className="font-medium text-gray-500 mb-1 text-sm sm:text-base">Tillverkare</h3>
                <p className="font-semibold text-gray-900 text-lg sm:text-xl">MPP</p>
                <p className="text-gray-500 text-sm sm:text-base">Produktnamn 34421</p>
              </div>
            </div>

            {/* Ägare Card */}
            <div className="bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-hidden">
              <div className="p-4">
                <h3 className="font-medium text-gray-500 mb-1 text-sm sm:text-base">Ägare</h3>
                <p className="font-semibold text-gray-900 text-lg sm:text-xl">Johnnys Gräv</p>
                <div className="flex items-center gap-2">
                  <img src="/user.svg" className="w-3 h-3 flex-shrink-0" alt="User" />
                  <p className="text-gray-500 text-sm sm:text-base">Johnny Andersson</p>
                </div>
              </div>
            </div>

            {/* Nästa besiktning Card */}
            <div className="bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-hidden">
              <div className="p-4">
                <h3 className="font-medium text-gray-500 mb-1 text-sm sm:text-base">Nästa besiktning</h3>
                <p className="font-semibold text-gray-900 text-lg sm:text-xl">2025-11-17</p>
                <p className="text-gray-500 text-sm sm:text-base">150 dagar kvar till besiktning</p>
              </div>
            </div>
          </div>


          {/* Tjänster Section */}
          <div className="bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-hidden mb-4">
            <div className="p-4 sm:p-6">
              <div data-breakpoints="Desktop" data-dark-mode="False" data-show-icon="false" data-show-percentage="false" data-type="Stats + Changes" className="w-full mb-6 self-stretch pb-4 border-b border-gray-200 inline-flex justify-center items-center">
                <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                  <div className="inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-tight">Tjänster</div>
                  </div>
                  <div className="justify-start text-gray-500 text-base font-normal font-['Inter'] leading-normal">Aktiva och möjliga tjänster för din Cistern</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border-b sm:border-b-0 sm:border-r border-gray-200 p-4">
                  <h3 className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-tight mb-4">Besiktningsbevakning</h3>
                  <div data-color="Primary" data-icon-only="False" data-outline="False" data-show-button-text="true" data-show-left-icon="true" data-show-right-icon="false" data-size="base" data-state="Default" className="px-4 py-2.5 sm:px-5 bg-primary-700 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden w-full sm:w-auto">
                    <img src="/bell.svg" className="w-3.5 h-3.5" alt="Activate" />
                    <div className="text-white text-sm font-medium font-['Inter'] leading-tight">Aktivera (19 kr/mån)</div>
                  </div>
                </div>
                
                <div className="bg-white border-b sm:border-b-0 sm:border-r border-gray-200 p-4">
                  <h3 className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-tight mb-4">Nivåbevakning</h3>
                  <div className="flex justify-start items-start gap-4 sm:gap-8 mb-4">
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-none">Enhet</div>
                      <div className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-normal">1st</div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-none">Pris</div>
                      <div className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-normal">Offert</div>
                    </div>
                  </div>
                  <div data-color="Alternative" data-icon-only="False" data-outline="True" data-show-button-text="true" data-show-left-icon="true" data-show-right-icon="false" data-size="sm" data-state="Default" className="px-3 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-center items-center gap-2 w-full sm:w-auto">
                    <img src="/file-circle-plus.svg" className="w-3 h-3" alt="Price Request" />
                    <div className="text-gray-900 text-sm font-medium font-['Inter'] leading-tight">Prisförfrågan</div>
                  </div>
                </div>
                
                <div className="bg-white border-b sm:border-b-0 sm:border-r border-gray-200 p-4">
                  <h3 className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-tight mb-4">GPS-positionering</h3>
                  <div className="flex justify-start items-start gap-4 sm:gap-8 mb-4">
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-none">Enhet</div>
                      <div className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-normal">1st</div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-none">Pris</div>
                      <div className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-normal">Offert</div>
                    </div>
                  </div>
                  <div data-color="Alternative" data-icon-only="False" data-outline="True" data-show-button-text="true" data-show-left-icon="true" data-show-right-icon="false" data-size="sm" data-state="Default" className="px-3 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-center items-center gap-2 w-full sm:w-auto">
                    <img src="/file-circle-plus.svg" className="w-3 h-3" alt="Price Request" />
                    <div className="text-gray-900 text-sm font-medium font-['Inter'] leading-tight">Prisförfrågan</div>
                  </div>
                </div>
                
                <div className="bg-white p-4">
                  <h3 className="text-gray-900 text-lg sm:text-xl font-semibold font-['Inter'] leading-normal mb-4">Tilläggstjänst 4</h3>
                  <div className="flex justify-start items-start gap-4 sm:gap-8 mb-4">
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-none">Enhet</div>
                      <div className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-normal">1st</div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-none">Pris</div>
                      <div className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-normal">+ 10 kr/mån</div>
                    </div>
                  </div>
                  <div data-color="Alternative" data-icon-only="False" data-outline="True" data-show-button-text="true" data-show-left-icon="true" data-show-right-icon="false" data-size="sm" data-state="Default" className="px-3 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-center items-center gap-2 w-full sm:w-auto">
                    <img src="/file-circle-plus.svg" className="w-3 h-3" alt="Add Service" />
                    <div className="text-gray-900 text-sm font-medium font-['Inter'] leading-tight">Lägg till tjänst</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border-b sm:border-b-0 sm:border-r border-gray-200 p-4">
                  <h3 className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-tight mb-4">Påfyllning</h3>
                  <div className="flex justify-start items-start gap-4 sm:gap-8 mb-4">
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-none">Pris</div>
                      <div className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-normal">via leverantör</div>
                    </div>
                  </div>
                  <div data-color="Primary" data-icon-only="False" data-outline="False" data-show-button-text="true" data-show-left-icon="true" data-show-right-icon="false" data-size="base" data-state="Default" className="px-4 py-2.5 sm:px-5 bg-primary-700 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden w-full sm:w-auto">
                    <img src="/truck.svg" className="w-3.5 h-3.5" alt="Order Fill" />
                    <div className="text-white text-sm font-medium font-['Inter'] leading-tight">Beställ påfyllning</div>
                  </div>
                </div>
                
                <div className="bg-white border-b sm:border-b-0 sm:border-r border-gray-200 p-4">
                  <h3 className="text-gray-900 text-lg sm:text-xl font-semibold font-['Inter'] leading-normal mb-4">Transport</h3>
                  <div className="flex justify-start items-start gap-4 sm:gap-8 mb-4">
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-none">Pris</div>
                      <div className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-normal">via leverantör</div>
                    </div>
                  </div>
                  <div data-color="Primary" data-icon-only="False" data-outline="False" data-show-button-text="true" data-show-left-icon="true" data-show-right-icon="false" data-size="base" data-state="Default" className="px-4 py-2.5 sm:px-5 bg-primary-700 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden w-full sm:w-auto">
                    <img src="/truck.svg" className="w-3.5 h-3.5" alt="Book Transport" />
                    <div className="text-white text-sm font-medium font-['Inter'] leading-tight">Boka transport</div>
                  </div>
                </div>
                
                <div className="bg-white border-b sm:border-b-0 sm:border-r border-gray-200 p-4">
                  <h3 className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-tight mb-4">Service</h3>
                  <div className="flex justify-start items-start gap-4 sm:gap-8 mb-4">
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-none">Pris</div>
                      <div className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-normal">via leverantör</div>
                    </div>
                  </div>
                  <div data-color="Alternative" data-icon-only="False" data-outline="True" data-show-button-text="true" data-show-left-icon="true" data-show-right-icon="false" data-size="sm" data-state="Default" className="px-3 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-center items-center gap-2 w-full sm:w-auto">
                    <img src="/file-circle-plus.svg" className="w-3 h-3" alt="Service Request" />
                    <div className="text-gray-900 text-sm font-medium font-['Inter'] leading-tight">Serviceförfrågan</div>
                  </div>
                </div>
                
                <div className="bg-white p-4">
                  <h3 className="text-gray-900 text-lg sm:text-xl font-semibold font-['Inter'] leading-normal mb-4">Besiktning</h3>
                  <div className="flex justify-start items-start gap-4 sm:gap-8 mb-4">
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-none">Pris</div>
                      <div className="text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-normal">via leverantör</div>
                    </div>
                  </div>
                  <div data-color="Primary" data-icon-only="False" data-outline="False" data-show-button-text="true" data-show-left-icon="true" data-show-right-icon="false" data-size="base" data-state="Default" className="px-4 py-2.5 sm:px-5 bg-primary-700 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden w-full sm:w-auto">
                    <img src="/cog.svg" className="w-3.5 h-3.5" alt="Book Inspection" />
                    <div className="text-white text-sm font-medium font-['Inter'] leading-tight">Boka besiktning</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-hidden">
            <div className="p-4 sm:p-6">
              <h2 className="font-semibold text-gray-900 mb-6 text-lg sm:text-xl">Tekniska specifikationer</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Cistern ID</label>
                    <input 
                      type="text" 
                      value={editData.id || ''} 
                      readOnly
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Total volym (liter)</label>
                    <input 
                      type="text" 
                      value={editData.volym || ''} 
                      readOnly
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Tillverkare</label>
                    <input 
                      type="text" 
                      value={editData.tillverkare || ''} 
                      readOnly
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Serienummer</label>
                    <input 
                      type="text" 
                      value={editData.serienummer || ''} 
                      readOnly
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Typ</label>
                    <input 
                      type="text" 
                      value={editData.typ || ''} 
                      readOnly
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Fyllnadsvolym (liter)</label>
                    <input 
                      type="text" 
                      value={editData.fyllnadsvolym || ''} 
                      readOnly
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Modell</label>
                    <input 
                      type="text" 
                      value={editData.modell || ''} 
                      readOnly
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 text-sm sm:text-base"
                    />
                  </div>
                <div>
                    <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Registreringsdatum</label>
                    <input 
                      type="text" 
                      value={editData.registreringsdatum || ''} 
                      readOnly
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Kommentarer</label>
                <textarea 
                  rows={4}
                  value={editData.kommentarer || ''}
                  readOnly
                  placeholder="Fria kommentarer om cisternen..."
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 text-sm sm:text-base resize-none"
                />
                </div>
              
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium w-full sm:w-auto">
                Spara ändringar
                  </button>
                </div>
              </div>

          {/* Dokument Section */}
          <div className="bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-hidden mt-4">
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="font-semibold text-gray-900 text-lg sm:text-xl">Dokument</h2>
                <img src="/info.svg" className="w-4 h-4 text-gray-400" alt="Info" />
              </div>
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center"
                onDrop={handleDocumentDrop}
                onDragOver={handleDragOver}
              >
                <img src="/upload.svg" className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" alt="Upload" />
                <p className="text-gray-500 mb-2 text-sm sm:text-base">Dra fil hit för att ladda upp</p>
                <label htmlFor="file-upload-detail" className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm sm:text-base">
                  eller bläddra bland filer
                </label>
                <input
                  id="file-upload-detail"
                  type="file"
                  multiple
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
              </div>

              {/* Uploaded Files List */}
              {uploadedDocuments.length > 0 && (
                <div className="mt-6">
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    {uploadedDocuments.map((file) => (
                      <div key={file.id} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <img src="/file.svg" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" alt="File" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{file.name}</p>
                            <p className="text-gray-500 text-xs sm:text-sm">{file.size}</p>
                          </div>
                        </div>
                        <img src="/check-circle.svg" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" alt="Uploaded" />
                      </div>
                    ))}
                </div>
                </div>
              )}
                </div>
              </div>

          {/* Cistern Bilder Section */}
          <div className="bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-hidden mt-[16px]">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="font-semibold text-gray-900" style={{fontSize: '20px'}}>Cistern Bilder</h2>
                <img src="/info.svg" className="w-4 h-4 text-gray-400" alt="Info" />
              </div>
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"
                onDrop={handleImageDrop}
                onDragOver={handleDragOver}
              >
                <img src="/upload.svg" className="w-12 h-12 text-gray-400 mx-auto mb-4" alt="Upload" />
                <p className="text-gray-500 mb-2" style={{fontSize: '14px'}}>Dra fil hit för att ladda upp</p>
                <label htmlFor="file-upload-images" className="text-blue-600 hover:text-blue-700 cursor-pointer" style={{fontSize: '14px'}}>
                  eller bläddra bland filer
                </label>
                <input
                  id="file-upload-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Uploaded Images List */}
              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    {uploadedImages.map((file) => (
                      <div key={file.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <img src="/file.svg" className="w-6 h-6 text-gray-600" alt="File" />
                          <div>
                            <p className="font-medium text-gray-900" style={{fontSize: '14px'}}>{file.name}</p>
                            <p className="text-gray-500" style={{fontSize: '12px'}}>{file.size}</p>
                          </div>
                        </div>
                        <img src="/check-circle.svg" className="w-6 h-6" alt="Uploaded" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </Layout>
    </AuthGuard>
  );
}

export default function TankDetails() {
  return (
    <Suspense fallback={
      <AuthGuard>
        <Layout>
          <div className="">
            <div className="mx-auto">
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-900">Laddar...</h1>
                <p className="text-gray-600 mt-2">Hämtar cistern information...</p>
              </div>
            </div>
          </div>
        </Layout>
      </AuthGuard>
    }>
      <TankDetailsContent />
    </Suspense>
  );
}

