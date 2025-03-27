import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { CiSearch, CiCircleRemove } from "react-icons/ci";
import { FaArrowUp, FaArrowDown, FaChevronDown, FaCheck } from "react-icons/fa";
import { FaArrowUpAZ, FaArrowDownZA, FaArrowUp19, FaArrowDown91, FaSort } from "react-icons/fa6";
import { RiFilter2Fill } from "react-icons/ri";
import { DateRange } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from "date-fns";
import { FaList, FaUser, FaMapMarkerAlt, FaStar } from "react-icons/fa";

const EventSearch = ({ onSearch }) => {
    const [searchInput, setSearchInput] = useState('');
    const [sortBy, setSortBy] = useState('startDateTime');
    const [sortDirection, setSortDirection] = useState('ASC');
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: null,
            endDate: null,
            key: 'selection',
        },
    ]);

    const dropdownRef = useRef(null);
    const filterDropdownRef = useRef(null);

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
            experienceLevel: '',
            minAge: '',
            maxAge: '',
        },
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setIsFilterDropdownOpen(false);
            }
        };

        if (isSortDropdownOpen || isFilterDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSortDropdownOpen, isFilterDropdownOpen]);

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
                experienceLevel: watch("experienceLevel"),
                minAge: watch("minAge") ? parseInt(watch("minAge")) : undefined,
                maxAge: watch("maxAge") ? parseInt(watch("maxAge")) : undefined,
            },
            sortBy,
            sortDirection,
        });
    };

    const handleSortChange = (newSortBy, newSortDirection) => {
        setSortBy(newSortBy);
        setSortDirection(newSortDirection);
        setIsSortDropdownOpen(false);
        onSearch({
            searchTerm: searchInput,
            filters: {
                categoryName: watch("categoryName"),
                city: watch("city"),
                startDateTime: watch("startDateTime"),
                experienceLevel: watch("experienceLevel"),
                minAge: watch("minAge") ? parseInt(watch("minAge")) : undefined,
                maxAge: watch("maxAge") ? parseInt(watch("maxAge")) : undefined,
            },
            sortBy: newSortBy,
            sortDirection: newSortDirection,
        });
    };

    const onSubmit = (data) => {

        // if (data.startDateTime && data.endDateTime) {
        //     const start = new Date(data.startDateTime);
        //     const end = new Date(data.endDateTime);
        //     if (end <= start) {
        //         setError("endDateTime", {
        //             type: "manual",
        //             message: "End date must be after start date",
        //         });
        //         return;
        //     }
        // }

        if (data.minAge !== "" && data.maxAge !== "" && parseInt(data.minAge) > parseInt(data.maxAge)) {
            setError("minAge", {
                type: "manual",
                message: "Minimum age cannot be greater than maximum age",
            });
            return;
        }

        clearErrors(["minAge"]);
        onSearch({
            searchTerm: searchInput,
            filters: {
                categoryName: data.categoryName || undefined,
                city: data.city || undefined,
                startDateTime: data.startDateTime || undefined,
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
        setDateRange([
            {
                startDate: null,
                endDate: null,
                key: 'selection',
            },
        ]);
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

            <div className="flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-4">

                <div className="relative w-full tablet:w-3/5 desktop:w-2/3 mx-auto">
                    <button
                        onClick={handleSearchSubmit}
                        className="absolute left-2 rounded-full text-btn hover:opacity-80 text-xl top-1/2 -translate-y-1/2"
                    >
                        <CiSearch />
                    </button>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Search for events..."
                        className="h-10 appearance-none border border-input-light rounded-lg w-full py-2 pl-10 pr-10 text-body-medium leading-tight focus:outline-none placeholder:text-input-muted font-inter bg-white"
                    />
                    {searchInput && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-2 btn-circle text-btn hover:opacity-80 text-xl top-1/2 -translate-y-1/2"
                        >
                            <CiCircleRemove />
                        </button>
                    )}
                </div>

                <div className="flex gap-2 justify-center tablet:justify-end">

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                            className="bg-[#FFFFFF] text-body-medium rounded-lg border-0 flex items-center gap-2 font-inter hover:bg-btn/8 px-4 py-2 min-w-[120px]"
                        >
                            <FaSort className="text-btn" />Sort by <FaChevronDown className="text-btn" />
                        </button>

                        {isSortDropdownOpen && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-fit min-w-[150px] sm:min-w-[200px] max-w-[90vw] bg-white shadow-md rounded-lg z-10 font-inter text-body-medium">
                                <div className="flex flex-col gap-1 p-2">
                                    <button
                                        onClick={() => handleSortChange("name", "ASC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowUpAZ className="text-btn text-lg" />
                                            A to Z
                                        </div>
                                        {sortBy === "name" && sortDirection === "ASC" && (
                                            <FaCheck className="text-btn" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange("name", "DESC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowDownZA className="text-btn text-lg" />
                                            Z to A
                                        </div>
                                        {sortBy === "name" && sortDirection === "DESC" && (
                                            <FaCheck className="text-btn" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange("experienceLevel", "ASC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowUp className="text-btn text-lg" />
                                            Beginner to Advanced
                                        </div>
                                        {sortBy === "experienceLevel" && sortDirection === "ASC" && (
                                            <FaCheck className="text-btn" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange("experienceLevel", "DESC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowDown className="text-btn text-lg" />
                                            Advanced to Beginner
                                        </div>
                                        {sortBy === "experienceLevel" && sortDirection === "DESC" && (
                                            <FaCheck className="text-btn" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange("startDateTime", "ASC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowUp19 className="text-btn text-lg" />
                                            Soonest to Latest
                                        </div>
                                        {sortBy === "startDateTime" && sortDirection === "ASC" && (
                                            <FaCheck className="text-btn" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange("startDateTime", "DESC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowDown91 className="text-btn text-lg" />
                                            Latest to Soonest
                                        </div>
                                        {sortBy === "startDateTime" && sortDirection === "DESC" && (
                                            <FaCheck className="text-btn" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange("createdAt", "ASC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowUp19 className="text-btn text-lg" />
                                            Newest to Latest
                                        </div>
                                        {sortBy === "createdAt" && sortDirection === "ASC" && (
                                            <FaCheck className="text-btn" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange("createdAt", "DESC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowDown91 className="text-btn text-lg" />
                                            Latest to Newest
                                        </div>
                                        {sortBy === "createdAt" && sortDirection === "DESC" && (
                                            <FaCheck className="text-btn" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>


                    {/* Filter mygtukas */}
                    {/* <button
                        className="bg-[#FFFFFF] text-body-medium rounded-lg border-0 flex items-center gap-2 font-inter hover:bg-btn/8 px-4 py-2 min-w-[120px]"
                    >
                        <RiFilter2Fill className="text-btn" /> Filter <FaChevronDown className="text-btn" />
                    </button> */}









                    <div className="relative" ref={filterDropdownRef}>
                        <button
                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            className="bg-[#FFFFFF] text-body-medium rounded-lg border-0 flex items-center gap-2 font-inter hover:bg-btn/8 px-4 py-2 min-w-[120px]"
                        >
                            <RiFilter2Fill className="text-btn" /> Filter <FaChevronDown className="text-btn" />
                        </button>

                        {isFilterDropdownOpen && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-fit min-w-[250px] sm:min-w-[300px] max-w-[90vw] bg-white shadow-md rounded-lg z-10 font-inter text-body-medium">
                                <div className="flex flex-col gap-4 p-4">
                                    {/* Category */}
                                    <div className="flex items-center gap-2">
                                        <FaList className="text-btn text-lg" />
                                        <select
                                            {...register("categoryName")}
                                            className="select select-bordered w-full p-1 text-body-medium font-inter"
                                        >
                                            <option value="">All Categories</option>
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

                                    {/* Date Range */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <FaList className="text-btn text-lg" />
                                            <span>Date Range</span>
                                        </div>
                                        <DateRange
                                            editableDateInputs={true}
                                            onChange={(ranges) => {
                                                setDateRange([ranges.selection]);
                                                setValue("startDateTime", ranges.selection.startDate?.toISOString().split("T")[0]);
                                                setValue("endDateTime", ranges.selection.endDate?.toISOString().split("T")[0]);
                                            }}
                                            moveRangeOnFirstSelection={false}
                                            ranges={dateRange}
                                            className="border rounded-md w-full"
                                        />
                                    </div>

                                    {/* Greiti datos pasirinkimai */}
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const today = new Date();
                                                setDateRange([
                                                    {
                                                        startDate: today,
                                                        endDate: today,
                                                        key: 'selection',
                                                    },
                                                ]);
                                                setValue("startDateTime", today.toISOString().split("T")[0]);
                                                setValue("endDateTime", today.toISOString().split("T")[0]);
                                            }}
                                            className="btn btn-sm bg-btn text-white rounded-md hover:bg-btn-hover"
                                        >
                                            Today
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const tomorrow = addDays(new Date(), 1);
                                                setDateRange([
                                                    {
                                                        startDate: tomorrow,
                                                        endDate: tomorrow,
                                                        key: 'selection',
                                                    },
                                                ]);
                                                setValue("startDateTime", tomorrow.toISOString().split("T")[0]);
                                                setValue("endDateTime", tomorrow.toISOString().split("T")[0]);
                                            }}
                                            className="btn btn-sm bg-btn text-white rounded-md hover:bg-btn-hover"
                                        >
                                            Tomorrow
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const today = new Date();
                                                const start = startOfWeek(today, { weekStartsOn: 1 }); // Pirmadienis
                                                const end = endOfWeek(today, { weekStartsOn: 1 }); // Sekmadienis
                                                setDateRange([
                                                    {
                                                        startDate: start,
                                                        endDate: end,
                                                        key: 'selection',
                                                    },
                                                ]);
                                                setValue("startDateTime", start.toISOString().split("T")[0]);
                                                setValue("endDateTime", end.toISOString().split("T")[0]);
                                            }}
                                            className="btn btn-sm bg-btn text-white rounded-md hover:bg-btn-hover"
                                        >
                                            This Week
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const today = new Date();
                                                const startOfWeekend = new Date(today);
                                                startOfWeekend.setDate(today.getDate() + (6 - today.getDay())); // Šeštadienis
                                                const endOfWeekend = new Date(startOfWeekend);
                                                endOfWeekend.setDate(startOfWeekend.getDate() + 1); // Sekmadienis
                                                setDateRange([
                                                    {
                                                        startDate: startOfWeekend,
                                                        endDate: endOfWeekend,
                                                        key: 'selection',
                                                    },
                                                ]);
                                                setValue("startDateTime", startOfWeekend.toISOString().split("T")[0]);
                                                setValue("endDateTime", endOfWeekend.toISOString().split("T")[0]);
                                            }}
                                            className="btn btn-sm bg-btn text-white rounded-md hover:bg-btn-hover"
                                        >
                                            This Weekend
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const today = new Date();
                                                const start = startOfMonth(today);
                                                const end = endOfMonth(today);
                                                setDateRange([
                                                    {
                                                        startDate: start,
                                                        endDate: end,
                                                        key: 'selection',
                                                    },
                                                ]);
                                                setValue("startDateTime", start.toISOString().split("T")[0]);
                                                setValue("endDateTime", end.toISOString().split("T")[0]);
                                            }}
                                            className="btn btn-sm bg-btn text-white rounded-md hover:bg-btn-hover"
                                        >
                                            This Month
                                        </button>
                                    </div>

                                    {/* Age Range */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <FaUser className="text-btn text-lg" />
                                            <input
                                                type="number"
                                                {...register("minAge", {
                                                    valueAsNumber: true,
                                                    min: { value: 0, message: "Minimum age must be 0 or greater" },
                                                    max: { value: 120, message: "Minimum age cannot be more than 120" },
                                                })}
                                                placeholder="From"
                                                className="input input-bordered w-full p-1 text-body-medium font-inter"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaUser className="text-btn text-lg" />
                                            <input
                                                type="number"
                                                {...register("maxAge", {
                                                    valueAsNumber: true,
                                                    min: { value: 0, message: "Maximum age must be 0 or greater" },
                                                    max: { value: 120, message: "Maximum age cannot be more than 120" },
                                                })}
                                                placeholder="To"
                                                className="input input-bordered w-full p-1 text-body-medium font-inter"
                                            />
                                        </div>
                                        {errors.minAge && <p className="text-red-500 text-sm">{errors.minAge.message}</p>}
                                        {errors.maxAge && <p className="text-red-500 text-sm">{errors.maxAge.message}</p>}
                                    </div>

                                    {/* City */}
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-btn text-lg" />
                                        <input
                                            {...register("city", {
                                                pattern: {
                                                    value: /^([a-zA-Z0-9\u0080-\u02FF\u1E00-\u1EFF\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF]+(?:[\s.\-'’‘]){0,2})*[a-zA-Z0-9\u0080-\u02FF\u1E00-\u1EFF\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF]*$|^$/,
                                                    message: "City name can only contain letters, numbers, spaces, dots, or hyphens (e.g., Vilnius, Kaunas)",
                                                },
                                            })}
                                            placeholder="City (e.g., Vilnius)"
                                            className="input input-bordered w-full p-1 text-body-medium font-inter"
                                        />
                                        {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                                    </div>

                                    {/* Experience Level */}
                                    <div className="flex items-center gap-2">
                                        <FaStar className="text-btn text-lg" />
                                        <select
                                            {...register("experienceLevel")}
                                            className="select select-bordered w-full p-1 text-body-medium font-inter"
                                        >
                                            <option value="">Any Level</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Extreme">Extreme</option>
                                            <option value="All Welcome">All Welcome</option>
                                        </select>
                                    </div>

                                    {/* Apply Filters ir Clear Filters mygtukai */}
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            onClick={handleSubmit((data) => {
                                                onSubmit(data);
                                                setIsFilterDropdownOpen(false);
                                            })}
                                            className="btn btn-primary w-full"
                                        >
                                            Apply Filters
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleClearFilters();
                                                setIsFilterDropdownOpen(false);
                                            }}
                                            className="btn btn-secondary w-full"
                                        >
                                            Clear Filters
                                        </button>

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div >












            {/* Laikina forma filtrams */}
            < form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2" >

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
            </form >
        </div >
    );
};

export default EventSearch;