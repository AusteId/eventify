import { useState, useEffect, useCallback, useRef } from "react";
import { useDarkMode } from "./context/DarkModeContext.jsx";
import { useAuth } from "./Auth/AuthContext.jsx";
import axios from "axios";
import { debounce } from "lodash";

const AddressAutocomplete = ({ setValue, triggerFetchCoordinates, resetAutocomplete, onResetComplete }) => {
    const { isDarkMode } = useDarkMode();
    const { isAuthenticated } = useAuth();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSelected, setIsSelected] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (resetAutocomplete) {
            setQuery("");
            setSuggestions([]);
            setIsOpen(false);
            setIsSelected(false);
            setError(null);
            setValue('city', '');
            setValue('address', '');
            triggerFetchCoordinates();
            onResetComplete();
        }
    }, [resetAutocomplete, setValue, triggerFetchCoordinates, onResetComplete]);

    const fetchSuggestions = useCallback(
        debounce(async (searchQuery) => {

            if (!isAuthenticated) {
                setError('Please log in to use address autocomplete');
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            if (isSelected) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            if (!searchQuery || searchQuery.length < 3) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACK_URL}/api/events/autocomplete?query=${encodeURIComponent(searchQuery)}`,
                    {
                        withCredentials: true,
                    }
                );
                setSuggestions(response.data);
                setIsOpen(true);
            } catch (error) {
                console.error('Error fetching autocomplete suggestions:', error);
                setError('Failed to fetch address suggestions');
                setSuggestions([]);
                setIsOpen(false);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        [isAuthenticated, isSelected]
    );

    useEffect(() => {
        fetchSuggestions(query);
    }, [query, fetchSuggestions]);

    const handleSelect = (suggestion) => {
        const { city, street, housenumber, formatted } = suggestion;
        const address = housenumber ? `${street} ${housenumber}` : street || '';

        setValue('city', city || '');
        setValue('address', address || '');
        setQuery(formatted || '');
        setIsOpen(false);
        setIsSelected(true);
        triggerFetchCoordinates();
    };

    const handleChange = (event) => {
        setQuery(event.target.value);
        setIsSelected(false);
        if (!event.target.value) {
            setValue("city", "");
            setValue("address", "");
            setSuggestions([]);
            setIsOpen(false);
            triggerFetchCoordinates();
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <label
                className="block font-inter text-body-m font-bold mb-2"
                htmlFor="event-address-autocomplete"
            >
                Address*
            </label>
            <input
                id="event-address-autocomplete"
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Enter address..."
                className={`${isDarkMode ? 'text-gray-200 border-[#f59e0b]' : 'text-body-medium border-input-light'
                    } h-10 appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none`}
            />
            {isLoading && <span className="absolute right-3 top-12">Loading...</span>}
            {error && (
                <span className="absolute right-3 top-12 text-red-500">{error}</span>
            )}
            {isOpen && suggestions.length > 0 && (
                <ul
                    className={`absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-auto ${isDarkMode ? 'bg-slate-900 border-[#f59e0b] text-gray-200' : 'bg-white border-input-light text-header-dark'
                        }`}
                >
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(suggestion)}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${isDarkMode && 'hover:bg-slate-600 hover:text-[#f59e0b]'
                                }`}
                        >
                            {suggestion.formatted}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddressAutocomplete;