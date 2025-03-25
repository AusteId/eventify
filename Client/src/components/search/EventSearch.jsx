import { useState } from "react";
import { useForm } from "react-hook-form";

const EventSearch = ({ onSearch }) => {
    const [searchInput, setSearchInput] = useState('');
    const [sortBy, setSortBy] = useState('startDateTime');
    const [sortDirection, setSortDirection] = useState('ASC');

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setError,
        clearErrors,
        reset,
    } = useForm({
        defaultValues: {
            categoryName: '',
            city: '',
            startDateTime: '',
            endDateTime: '',
            experienceLevel: '',
            minAge: '',
            maxAge: '',
        },
    });

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearchSubmit = () => {
        onSearch({
            searchTerm: searchInput,
            filters: {
                categoryName: watch("categoryName"),
                city: watch("city"),
                startDateTime: watch("startDateTime"),
                endDateTime: watch("endDateTime"),
                experienceLevel: watch("experienceLevel"),
                minAge: watch("minAge") ? parseInt(watch("minAge")) : undefined,
                maxAge: watch("maxAge") ? parseInt(watch("maxAge")) : undefined,
            },
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
            filters: {
                categoryName: watch("categoryName"),
                city: watch("city"),
                startDateTime: watch("startDateTime"),
                endDateTime: watch("endDateTime"),
                experienceLevel: watch("experienceLevel"),
                minAge: watch("minAge") ? parseInt(watch("minAge")) : undefined,
                maxAge: watch("maxAge") ? parseInt(watch("maxAge")) : undefined,
            },
            sortBy,
            sortDirection,
        });
    };

    const handleSortChange = (event) => {
        const [newSortBy, newSortDirection] = event.target.value.split(':');
        setSortBy(newSortBy);
        setSortDirection(newSortDirection);
        onSearch({
            searchTerm: searchInput,
            filters: {
                categoryName: watch("categoryName"),
                city: watch("city"),
                startDateTime: watch("startDateTime"),
                endDateTime: watch("endDateTime"),
                experienceLevel: watch("experienceLevel"),
                minAge: watch("minAge") ? parseInt(watch("minAge")) : undefined,
                maxAge: watch("maxAge") ? parseInt(watch("maxAge")) : undefined,
            },
            sortBy: newSortBy,
            sortDirection: newSortDirection,
        });
    };

    const onSubmit = (data) => {

        if (data.startDateTime && data.endDateTime) {
            const start = new Date(data.startDateTime);
            const end = new Date(data.endDateTime);
            if (end <= start) {
                setError("endDateTime", {
                    type: "manual",
                    message: "End date must be after start date",
                });
                return;
            }
        }

        if (data.minAge !== "" && data.maxAge !== "" && parseInt(data.minAge) > parseInt(data.maxAge)) {
            setError("minAge", {
                type: "manual",
                message: "Minimum age cannot be greater than maximum age",
            });
            return;
        }

        clearErrors(["endDateTime", "minAge"]);
        onSearch({
            searchTerm: searchInput,
            filters: {
                categoryName: data.categoryName || undefined,
                city: data.city || undefined,
                startDateTime: data.startDateTime || undefined,
                endDateTime: data.endDateTime || undefined,
                experienceLevel: data.experienceLevel || undefined,
                minAge: data.minAge ? parseInt(data.minAge) : undefined,
                maxAge: data.maxAge ? parseInt(data.maxAge) : undefined,
            },
            sortBy,
            sortDirection,
        });
    };

    const handleClearFilters = () => {
        reset();
        onSearch({
            searchTerm: searchInput,
            filters: {
                categoryName: undefined,
                city: undefined,
                startDateTime: undefined,
                endDateTime: undefined,
                experienceLevel: undefined,
                minAge: undefined,
                maxAge: undefined,
            },
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

            {/* Laikina forma filtrams */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">

                <div>
                    <select
                        {...register("categoryName")}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">Select category</option>
                        <option value="Sports">Sports</option>
                        <option value="Boardgames">Boardgames</option>
                        <option value="Music">Music</option>
                        <option value="Arts and Culture">Arts and Culture</option>
                        <option value="Food and Drinks">Food and Drinks</option>
                        <option value="Outdoor">Outdoor</option>
                        <option value="Wellness">Wellness</option>
                        <option value="Business">Business</option>
                        <option value="Technology">Technology</option>
                    </select>
                </div>

                <div>
                    <input
                        {...register("city", {
                            pattern: {
                                value: /^([a-zA-Z0-9\u0080-\u02FF\u1E00-\u1EFF\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF]+(?:[\s.\-'’‘]){0,2})*[a-zA-Z0-9\u0080-\u02FF\u1E00-\u1EFF\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF]*$|^$/,
                                message: "City name can only contain letters, numbers, spaces, dots, or hyphens (e.g., Vilnius, Kaunas)",
                            },
                        })}
                        placeholder="Filter by city (e.g., Vilnius)"
                        className="w-full p-2 border rounded-md"
                    />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                </div>

                <div>
                    <input
                        {...register("startDateTime", {
                            pattern: {
                                value: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$|^$/,
                                message: "startDateTime must be in format yyyy-MM-dd, e.g., 2025-05-01",
                            },
                        })}
                        placeholder="Filter by start date (yyyy-MM-dd, e.g., 2025-05-01)"
                        className="w-full p-2 border rounded-md"
                    />
                    {errors.startDateTime && <p className="text-red-500 text-sm">{errors.startDateTime.message}</p>}
                </div>

                <div>
                    <input
                        {...register("endDateTime", {
                            pattern: {
                                value: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$|^$/,
                                message: "endDateTime must be in format yyyy-MM-dd, e.g., 2025-06-01",
                            },
                        })}
                        placeholder="Filter by end date (yyyy-MM-dd, e.g., 2025-06-01)"
                        className="w-full p-2 border rounded-md"
                    />
                    {errors.endDateTime && <p className="text-red-500 text-sm">{errors.endDateTime.message}</p>}
                </div>

                <div>
                    <select
                        {...register("experienceLevel")}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">Select experience level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Extreme">Extreme</option>
                        <option value="All Welcome">All Welcome</option>
                    </select>
                </div>

                <div>
                    <input
                        type="number"
                        {...register("minAge", {
                            valueAsNumber: true,
                            min: { value: 0, message: "Minimum age must be 0 or greater" },
                            max: { value: 120, message: "Minimum age cannot be more than 120" },
                        })}
                        placeholder="Filter by min age (e.g., 18)"
                        className="w-full p-2 border rounded-md"
                    />
                    {errors.minAge && <p className="text-red-500 text-sm">{errors.minAge.message}</p>}
                </div>

                <div>
                    <input
                        type="number"
                        {...register("maxAge", {
                            valueAsNumber: true,
                            min: { value: 0, message: "Maximum age must be 0 or greater" },
                            max: { value: 120, message: "Maximum age cannot be more than 120" },
                        })}
                        placeholder="Filter by max age (e.g., 30)"
                        className="w-full p-2 border rounded-md"
                    />
                    {errors.maxAge && <p className="text-red-500 text-sm">{errors.maxAge.message}</p>}
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="p-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                    >
                        Apply Filters
                    </button>
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        Clear Filters
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventSearch;