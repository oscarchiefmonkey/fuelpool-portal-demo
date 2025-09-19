'use client';

import Layout from '../../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SkapaCistern() {
  const [formData, setFormData] = useState({
    namn: '',
    volym: '',
    produkt: 'Diesel',
    registreringsdatum: '',
    modell: '',
    serienummer: '',
    senasteBesiktning: '',
    kommentar: '',
    status: 'Online',
    tillverkare: '',
    agare: '',
    senasteService: ''
  });
  
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Fix hydration issues by ensuring we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadingImages(true);
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

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadingDocuments(true);
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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate a new ID
    const newId = `#${Math.floor(Math.random() * 9000000) + 1000000}`;
    
    // Create new tank object with all form data
    const newTank = {
      id: newId,
      ...formData,
      totalVolym: formData.volym, // Samma som volym
      senastUppdaterad: new Date().toLocaleString('sv-SE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', ' |')
    };

    // Save to localStorage directly (only on client)
    if (typeof window !== 'undefined') {
      try {
        const existingTanks = JSON.parse(localStorage.getItem('tankData') || '[]');
        const updatedTanks = [...existingTanks, newTank];
        localStorage.setItem('tankData', JSON.stringify(updatedTanks));
        router.push('/cisterner/mina-cisterner');
      } catch (error) {
        console.error('Error saving tank:', error);
      }
    }
  };

  return (
    <Layout>
      <div className="">
        <div className="">
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
                <div className="justify-start text-gray-500 text-xs sm:text-sm font-medium font-inter leading-tight whitespace-nowrap">Registrera ny Cistern</div>
              </div>
            </div>
          </div>

        {/* Header Container with Grunduppgifter */}
        <div className="bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-hidden mb-6">
          <div className="p-4 sm:p-6">
            <div className="pb-6 border-b border-gray-200 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h1 className="font-bold text-gray-900 mb-2 text-lg sm:text-xl">Registrera ny Cistern</h1>
                  <p className="text-gray-500 text-sm sm:text-base">Fyll i uppgifterna om din cistern för att aktivera bevakning</p>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2.5 sm:px-5 bg-blue-600 rounded-lg text-white text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  Skapa Cistern
                </button>
              </div>
            </div>
            
            <h2 className="font-semibold text-gray-900 mb-6 text-lg sm:text-xl">Grunduppgifter</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Total Volym*</label>
                  <input
                    name="totalVolym"
                    value={formData.totalVolym}
                    onChange={handleInputChange}
                    placeholder="5000"
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 placeholder-gray-500 focus:outline-blue-500 focus:bg-white text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Tillverkare</label>
                  <input
                    name="tillverkare"
                    value={formData.tillverkare}
                    onChange={handleInputChange}
                    placeholder="Ange tillverkare"
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 placeholder-gray-500 focus:outline-blue-500 focus:bg-white text-sm sm:text-base"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Produkt*</label>
                  <div className="relative">
                    <select
                      name="produkt"
                      value={formData.produkt}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 pr-10 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 focus:outline-blue-500 focus:bg-white appearance-none text-sm sm:text-base"
                    >
                      <option value="Diesel">Diesel</option>
                      <option value="Bensin">Bensin</option>
                      <option value="Olja">Olja</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <img src="/chevron-up.svg" className="w-4 h-4 text-gray-400 rotate-180" alt="Dropdown" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Registreringsdatum</label>
                  <input
                    name="registreringsdatum"
                    type="date"
                    value={formData.registreringsdatum}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 focus:outline-blue-500 focus:bg-white text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Section */}
        <div className="bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-hidden mb-6">
          <div className="p-4 sm:p-6">
            <h2 className="font-semibold text-gray-900 mb-6 text-lg sm:text-xl">Tekniska specifikationer</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Modell</label>
                  <input 
                    name="modell"
                    value={formData.modell}
                    onChange={handleInputChange}
                    placeholder="X2921-221911"
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 placeholder-gray-500 focus:outline-blue-500 focus:bg-white text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Serienummer</label>
                  <input 
                    name="serienummer"
                    value={formData.serienummer}
                    onChange={handleInputChange}
                    placeholder="CI3939494-2223-111-2"
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 placeholder-gray-500 focus:outline-blue-500 focus:bg-white text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Namn*</label>
                  <input 
                    name="namn"
                    value={formData.namn}
                    onChange={handleInputChange}
                    placeholder="Ange cistern namn"
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 placeholder-gray-500 focus:outline-blue-500 focus:bg-white text-sm sm:text-base"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Senaste besiktning</label>
                  <input 
                    name="senasteBesiktning"
                    type="date"
                    value={formData.senasteBesiktning}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 focus:outline-blue-500 focus:bg-white text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Detalj 4</label>
                  <input 
                    name="detalj4"
                    value={formData.detalj4}
                    onChange={handleInputChange}
                    placeholder="Detalj 4"
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 placeholder-gray-500 focus:outline-blue-500 focus:bg-white text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Detalj 6</label>
                  <input 
                    name="detalj6"
                    type="date"
                    value={formData.detalj6}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 focus:outline-blue-500 focus:bg-white text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block font-medium text-gray-900 mb-1 text-sm sm:text-base">Kommentar</label>
              <textarea 
                name="kommentar"
                value={formData.kommentar}
                onChange={handleInputChange}
                rows={4}
                placeholder="Fria kommentarer om cisternen..."
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 placeholder-gray-500 focus:outline-blue-500 focus:bg-white text-sm sm:text-base resize-none"
              />
            </div>
          </div>
        </div>

        {/* Cistern Bilder Section */}
        <div className="bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-hidden mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="font-semibold text-gray-900 text-lg sm:text-xl">Cistern Bilder</h2>
              <img src="/info.svg" className="w-4 h-4 text-gray-400" alt="Icon" />
            </div>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center"
              onDrop={handleImageDrop}
              onDragOver={handleDragOver}
            >
                <img src="/upload.svg" className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" alt="Upload" />
              <p className="text-gray-500 mb-2 text-sm sm:text-base">Dra fil hit för att ladda upp</p>
              <label htmlFor="file-upload-images" className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm sm:text-base">
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
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  {uploadedImages.map((file) => (
                    <div key={file.id} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <img src="/file.svg" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" alt="File" />
                        <div className="min-w-0 flex-1">
                          <p className="text-gray-900 text-sm sm:text-base truncate">{file.name}</p>
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

        {/* Dokument Section */}
        <div className="bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-hidden mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="font-semibold text-gray-900 text-lg sm:text-xl">Dokument</h2>
              <img src="/info.svg" className="w-4 h-4 text-gray-400" alt="Icon" />
            </div>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center"
              onDrop={handleDocumentDrop}
              onDragOver={handleDragOver}
            >
                <img src="/upload.svg" className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" alt="Upload" />
              <p className="text-gray-500 mb-2 text-sm sm:text-base">Dra fil hit för att ladda upp</p>
              <label htmlFor="file-upload-documents" className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm sm:text-base">
                eller bläddra bland filer
              </label>
              <input
                id="file-upload-documents"
                type="file"
                multiple
                onChange={handleDocumentUpload}
                className="hidden"
              />
            </div>

            {/* Uploaded Documents List */}
            {uploadedDocuments.length > 0 && (
              <div className="mt-6">
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  {uploadedDocuments.map((file) => (
                    <div key={file.id} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <img src="/file.svg" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" alt="File" />
                        <div className="min-w-0 flex-1">
                          <p className="text-gray-900 text-sm sm:text-base truncate">{file.name}</p>
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
        </div>
      </div>
    </Layout>
  );
}