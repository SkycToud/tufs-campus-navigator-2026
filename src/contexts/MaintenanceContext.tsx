import React, { createContext, useContext, useState, useEffect } from 'react';

interface MaintenanceContextType {
    isMaintenanceMode: boolean;
    setMaintenanceMode: (enabled: boolean) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

    // Expose toggle to window object for hidden access
    useEffect(() => {
        (window as any).toggleMaintenanceMode = () => {
            setIsMaintenanceMode(prev => {
                const newState = !prev;
                console.log(`Maintenance Mode: ${newState ? 'ON' : 'OFF'}`);
                return newState;
            });
        };

        return () => {
            delete (window as any).toggleMaintenanceMode;
        };
    }, []);

    return (
        <MaintenanceContext.Provider value={{ isMaintenanceMode, setMaintenanceMode: setIsMaintenanceMode }}>
            {children}
        </MaintenanceContext.Provider>
    );
}

export function useMaintenance() {
    const context = useContext(MaintenanceContext);
    if (context === undefined) {
        throw new Error('useMaintenance must be used within a MaintenanceProvider');
    }
    return context;
}
