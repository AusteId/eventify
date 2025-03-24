import { useState } from "react";

const EventSearch = ({ onSearch }) => {
    const [searchInput, setSearchInput] = useState('');
    const [filters, setFilters] = useState({
        categoryName: '',
        city: '',
        startDateTime: '',
        endDateTime: '',
        experienceLevel: '',
        minAge: '',
        maxAge: '',
    });
    const [sortBy, setSortBy] = useState('startDateTime');
    const [sortDirection, setSortDirection] = useState('ASC');

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearchSubmit = () => {
        onSearch({
            searchTerm: searchInput,
            filters,
            sortBy,
            sortDirection,
        });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchSubmit();
        }
    }

    const handleClearSearch = () => {
        setSearchInput('');
        onSearch({
            searchTerm: '',
            filters,
            sortBy,
            sortDirection,
        });
    };

    const handleFilterChange = (filterName, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterName]: value,
        }));
    };

    const handleSortChange = (event) => {
        const [newSortBy, newSortDirection] = event.target.value.split(':');
        setSortBy(newSortBy);
        setSortDirection(newSortDirection);
        onSearch({
            searchTerm: searchInput,
            filters,
            sortBy: newSortBy,
            sortDirection: newSortDirection,
        });
    };

    const handleApplyFilters = () => {
        onSearch({
            searchTerm: searchInput,
            filters,
            sortBy,
            sortDirection,
        });
    };

    return (
        <div className="mb-6 flex flex-col gap-4">

            {/* Laikinas paieškos laukelis */}
            <div className="flex gap-2">
                <div className="relative w-full">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Search for events..."
                        className="w-full p-2 border rounded-md"
                    />
                    {searchInput && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    )}
                </div>
                <button
                    onClick={handleSearchSubmit}
                    className="p-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                >
                    Search
                </button>
            </div>

            {/* Laikini dropdown rūšiavimui */}
            <div>
                <label htmlFor="sortOptions" className="mr-2">
                    Sort by:
                </label>
                <select
                    id="sortOptions"
                    value={`${sortBy}:${sortDirection}`}
                    onChange={handleSortChange}
                    className="p-2 border rounded-md"
                >
                    <option value="startDateTime:ASC">Start Date (Ascending)</option>
                    <option value="startDateTime:DESC">Start Date (Descending)</option>
                    <option value="name:ASC">Name (Ascending)</option>
                    <option value="name:DESC">Name (Descending)</option>
                    <option value="createdAt:ASC">Created At (Ascending)</option>
                    <option value="createdAt:DESC">Created At (Descending)</option>
                    <option value="experienceLevel:ASC">Experience Level (Ascending)</option>
                    <option value="experienceLevel:DESC">Experience Level (Descending)</option>
                </select>
            </div>

            {/* Laikini input laukeliai filtrams */}
            <div className="flex flex-col gap-2">
                <input
                    type="text"
                    value={filters.categoryName}
                    onChange={(event) => handleFilterChange('categoryName', event.target.value)}
                    placeholder="Filter by category (e.g., Sports)"
                    className="w-full p-2 border rounded-md"
                />
                <input
                    type="text"
                    value={filters.city}
                    onChange={(event) => handleFilterChange('city', event.target.value)}
                    placeholder="Filter by city (e.g., Vilnius)"
                    className="w-full p-2 border rounded-md"
                />
                <input
                    type="text"
                    value={filters.startDateTime}
                    onChange={(event) => handleFilterChange('startDateTime', event.target.value)}
                    placeholder="Filter by start date (yyyy-MM-dd, e.g., 2025-05-01)"
                    className="w-full p-2 border rounded-md"
                />
                <input
                    type="text"
                    value={filters.endDateTime}
                    onChange={(event) => handleFilterChange('endDateTime', event.target.value)}
                    placeholder="Filter by end date (yyyy-MM-dd, e.g., 2025-06-01)"
                    className="w-full p-2 border rounded-md"
                />
                <input
                    type="text"
                    value={filters.experienceLevel}
                    onChange={(event) => handleFilterChange('experienceLevel', event.target.value)}
                    placeholder="Filter by experience level (e.g., Beginner)"
                    className="w-full p-2 border rounded-md"
                />
                <input
                    type="number"
                    value={filters.minAge}
                    onChange={(event) => handleFilterChange('minAge', event.target.value)}
                    placeholder="Filter by min age (e.g., 18)"
                    className="w-full p-2 border rounded-md"
                />
                <input
                    type="number"
                    value={filters.maxAge}
                    onChange={(event) => handleFilterChange('maxAge', event.target.value)}
                    placeholder="Filter by max age (e.g., 30)"
                    className="w-full p-2 border rounded-md"
                />
            </div>

            <div>
                <button
                    onClick={handleApplyFilters}
                    className="p-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                    >
                        Apply Filters
                </button>
            </div>
        </div>
    );
};

export default EventSearch;