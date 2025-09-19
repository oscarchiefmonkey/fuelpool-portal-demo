"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validering
    if (!formData.email || !formData.password) {
      setError('E-postadress och lösenord krävs');
      return;
    }

    // Hämta användare från localStorage (only on client)
    if (typeof window !== 'undefined') {
      // Hårdkodad admin-användare för utveckling
      if (formData.email === 'admin@fuelpool.se' && formData.password === 'admin') {
        router.push('/cisterner/skapa-cistern');
        return;
      }

      const users = JSON.parse(localStorage.getItem('fuelpoolUsers') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);

      if (!user) {
        setError('Felaktig e-postadress eller lösenord');
        return;
      }

      // Omdirigera till skapa cistern
      router.push('/cisterner/skapa-cistern');
    }
  };
  return (
    <div className="login-background w-full min-h-screen inline-flex flex-col justify-start items-center overflow-y-auto">
        <div className="w-full min-h-screen py-8 sm:py-16 lg:py-24 bg-gray-900/60 flex flex-col justify-center items-center gap-8 sm:gap-12 lg:gap-16 px-4">
            <div className="w-full max-w-[512px] p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] flex flex-col justify-center items-start gap-4 sm:gap-5">
                {/* Fuelpool Logo inside the form */}
                <div className="w-full flex justify-center items-center gap-3 sm:gap-4 mb-1 sm:mb-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
                        <Image 
                            src="/fuelpool.svg" 
                            alt="Fuelpool Logo" 
                            width={44} 
                            height={48} 
                            className="w-9 h-10 sm:w-11 sm:h-12 left-[2px] top-[-2px] absolute"
                        />
                    </div>
                    <div className="justify-start text-gray-900 font-semibold font-inter leading-[54px] text-lg sm:text-xl">Fuelpool</div>
                </div>
                
                <form id="login-form" onSubmit={handleSubmit} className="self-stretch flex flex-col justify-start items-start gap-4 sm:gap-5">
                    <div data-dark-mode="False" data-show-helper-text="false" data-show-label="true" data-show-left-icon="false" data-show-placeholder="true" data-show-right-icon="false" data-size="Regular" data-state="Normal" className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch justify-start text-gray-900 font-medium font-inter leading-tight text-sm sm:text-base">Email</div>
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="self-stretch px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex justify-start items-center gap-2.5 text-gray-900 placeholder-gray-500 focus:outline-blue-500 focus:bg-white text-sm sm:text-base"
                            placeholder="Ange e-postadress"
                            required
                        />
                    </div>
                    
                    <div data-dark-mode="False" data-show-helper-text="false" data-show-label="true" data-show-left-icon="false" data-show-placeholder="true" data-show-right-icon="false" data-size="Regular" data-state="Normal" className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch justify-start text-gray-900 font-medium font-inter leading-tight text-sm sm:text-base">Lösenord</div>
                        <input 
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="self-stretch px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex justify-start items-center gap-2.5 text-gray-900 placeholder-gray-500 focus:outline-blue-500 focus:bg-white text-sm sm:text-base"
                            placeholder="Ange lösenord"
                            required
                        />
                    </div>
                </form>
                
                {error && (
                    <div className="self-stretch p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm font-medium">{error}</p>
                    </div>
                )}
                
                <div className="self-stretch flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <label className="rounded flex justify-start items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-50 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div className="inline-flex flex-col justify-start items-start gap-1">
                            <div className="justify-center text-gray-500 font-medium font-inter leading-none text-sm sm:text-base">Kom ihåg mig</div>
                        </div>
                    </label>
                    <a href="#" className="text-right justify-center text-blue-600 font-medium font-inter leading-tight hover:text-blue-700 hover:underline transition-colors text-sm sm:text-base">Glömt lösenord?</a>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-3 sm:gap-4">
                    <button 
                        type="submit"
                        form="login-form"
                        data-color="Primary" 
                        data-icon-only="False" 
                        data-outline="False" 
                        data-show-button-text="true" 
                        data-show-left-icon="false" 
                        data-show-right-icon="false" 
                        data-size="base" 
                        data-state="Default" 
                        className="self-stretch px-4 py-3 sm:px-5 sm:py-2.5 bg-blue-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden text-white text-sm sm:text-base font-medium font-inter leading-tight hover:bg-blue-700 transition-colors"
                    >
                        Logga in
                    </button>
                    <div className="justify-start text-center sm:text-left">
                        <span className="text-gray-900 text-sm sm:text-base font-medium font-inter leading-tight">Har du inget konto än? </span>
                        <a href="/register" className="text-blue-600 text-sm sm:text-base font-medium font-inter leading-tight hover:text-blue-700 hover:underline transition-colors">Registrera konto</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
