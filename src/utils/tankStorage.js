// Utility functions for managing tank data in localStorage

const STORAGE_KEY = 'tankData';

// Get all tanks from localStorage
export const getTanks = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading tanks from localStorage:', error);
    return [];
  }
};

// Save a new tank to localStorage
export const saveTank = (tankData) => {
  if (typeof window === 'undefined') return false;
  
  try {
    const existingTanks = getTanks();
    const newTank = {
      ...tankData,
      id: tankData.id || `#${Math.floor(Math.random() * 9000000) + 1000000}`,
      senastUppdaterad: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }) + ' | ' + new Date().toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      createdAt: new Date().toISOString(),
      // Default values for new fields
      totalVolym: tankData.totalVolym || '5000',
      tillverkare: tankData.tillverkare || '',
      produkt: tankData.produkt || 'Diesel',
      registreringsdatum: tankData.registreringsdatum || '2019-05-22',
      modell: tankData.modell || 'X2921-221911',
      serienummer: tankData.serienummer || 'CI3939494-2223-111-2',
      detalj5: tankData.detalj5 || '',
      senasteBesiktning: tankData.senasteBesiktning || '',
      detalj4: tankData.detalj4 || '',
      detalj6: tankData.detalj6 || '2019-05-22',
      kommentar: tankData.kommentar || '',
      // Legacy fields for backward compatibility
      fyllnadsvolym: tankData.fyllnadsvolym || tankData.totalVolym || '4800',
      volym: tankData.volym || tankData.totalVolym || '5000',
      namn: tankData.namn || `Cistern ${tankData.id || 'Ny'}`,
      senasteService: tankData.senasteService || '2024-11-12',
      // Services
      services: tankData.services || {
        besiktningsbevakning: { active: false, price: '119 kr/mån' },
        nivabehakning: { active: false, price: 'Prisförfrågan' },
        gpsPositionering: { active: false, price: 'Prisförfrågan' },
        tillaggstjanst4: { active: false, price: '1st + 10 kr/mån' },
        pafyllning: { active: false, price: 'Pris via leverantör' },
        transport: { active: false, price: 'Pris via leverantör' },
        service: { active: false, price: 'Pris via leverantör' },
        besiktning: { active: false, price: 'Pris via leverantör' }
      },
      // Accessories
      accessories: tankData.accessories || [
        'Pump Fill-Rite 700',
        'Överfyllnadsskydd (Standard)',
        'T/V Ventil med flammdämpare'
      ]
    };
    
    const updatedTanks = [...existingTanks, newTank];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTanks));
    return true;
  } catch (error) {
    console.error('Error saving tank to localStorage:', error);
    return false;
  }
};

// Update an existing tank
export const updateTank = (tankId, updatedData) => {
  if (typeof window === 'undefined') return false;
  
  try {
    const existingTanks = getTanks();
    const tankIndex = existingTanks.findIndex(tank => tank.id === tankId);
    
    if (tankIndex === -1) return false;
    
    const updatedTank = {
      ...existingTanks[tankIndex],
      ...updatedData,
      senastUppdaterad: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }) + ' | ' + new Date().toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      updatedAt: new Date().toISOString()
    };
    
    existingTanks[tankIndex] = updatedTank;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTanks));
    return true;
  } catch (error) {
    console.error('Error updating tank in localStorage:', error);
    return false;
  }
};

// Delete a tank
export const deleteTank = (tankId) => {
  if (typeof window === 'undefined') return false;
  
  try {
    const existingTanks = getTanks();
    const filteredTanks = existingTanks.filter(tank => tank.id !== tankId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTanks));
    return true;
  } catch (error) {
    console.error('Error deleting tank from localStorage:', error);
    return false;
  }
};

// Get a specific tank by ID
export const getTankById = (tankId) => {
  const tanks = getTanks();
  return tanks.find(tank => tank.id === tankId);
};

// Clear all tank data (useful for testing)
export const clearAllTanks = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing tanks from localStorage:', error);
    return false;
  }
};
