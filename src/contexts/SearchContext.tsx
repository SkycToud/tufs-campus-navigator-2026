import { createContext, useContext, useState, type ReactNode } from 'react';
import type { FacilityId } from '../lib/schedules';

interface SelectedEvent {
    facilityId: FacilityId;
    date: Date;
}

interface SearchContextType {
    query: string;
    setQuery: (query: string) => void;
    selectedEvent: SelectedEvent | null;
    setSelectedEvent: (event: SelectedEvent | null) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
    const [query, setQuery] = useState('');
    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);

    return (
        <SearchContext.Provider value={{ query, setQuery, selectedEvent, setSelectedEvent }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearchContext() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
}
