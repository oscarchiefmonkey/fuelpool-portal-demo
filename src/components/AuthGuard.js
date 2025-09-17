"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Kontrollera om det finns några registrerade användare
    const checkAuth = () => {
      try {
        const users = JSON.parse(localStorage.getItem('fuelpoolUsers') || '[]');
        
        if (users.length === 0) {
          // Inga användare registrerade, omdirigera till register
          router.push('/register');
          return;
        }
        
        // Det finns registrerade användare, låt användaren komma åt sidan
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/register');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Visa loading medan vi kontrollerar autentisering
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900/60">
        <div className="text-white text-lg">Laddar...</div>
      </div>
    );
  }

  // Om inte autentiserad, returnera inget (redirect sker i useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // Om autentiserad, visa innehållet
  return children;
}
