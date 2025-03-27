"use client"

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { CiSearch, CiCircleRemove } from "react-icons/ci";
import { FaArrowUp, FaArrowDown, FaChevronDown, FaCheck } from "react-icons/fa";
import { FaArrowUpAZ, FaArrowDownZA, FaArrowUp19, FaArrowDown91, FaSort } from "react-icons/fa6";
import { RiFilter2Fill } from "react-icons/ri";
import { IoCalendarOutline } from "react-icons/io5";
import CategoryImage from "../category/CategoryImage";

const EventSearch = ({ onSearch }) => {
    const [searchInput, setSearchInput] = useState("");
    const [sortBy, setSortBy] = useState("startDateTime");
    const [sortDirection, setSortDirection] = useState("ASC");
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [activeDateFilter, setActiveDateFilter] = useState("");

    const filterDropdownRef = useRef(null);
    const dropdownRef = useRef(null);
    const categoryDropdownRef = useRef(null);

    const categories = [
        { id: 1, name: "Sports" },
        { id: 2, name: "Boardgames" },
        { id: 3, name: "Music" },
        { id: 4, name: "Arts and Culture" },
        { id: 5, name: "Food and Drinks" },
        { id: 6, name: "Outdoor" },
        { id: 7, name: "Wellness" },
        { id: 8, name: "Business" },
        { id: 9, name: "Technology" },
    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setError,
        clearErrors,
        reset,
        setValue,
    } = useForm({
        defaultValues: {
            categoryName: "",
            city: "",
            startDateTime: "",
            endDateTime: "",
            experienceLevel: "",
            minAge: "",
            maxAge: "",
        },
    })

    const categoryName = watch("categoryName");
    const startDateTime = watch("startDateTime");
    const endDateTime = watch("endDateTime");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false)
            }
        };

        if (isSortDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        };
    }, [isSortDropdownOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setIsFilterDropdownOpen(false)
            }
        };

        if (isFilterDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        };
    }, [isFilterDropdownOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
        };

        if (isCategoryDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isCategoryDropdownOpen]);

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value)
    }

    const handleSearchSubmit = () => {
        onSearch({
            searchTerm: searchInput,
            filters: {
                categoryName: watch("categoryName"),
                city: watch("city"),
                startDateTime: watch("startDateTime"),
                endDateTime: watch("endDateTime"),
                experienceLevel: watch("experienceLevel"),
                minAge: watch("minAge") ? Number.parseInt(watch("minAge")) : undefined,
                maxAge: watch("maxAge") ? Number.parseInt(watch("maxAge")) : undefined,
            },
            sortBy,
            sortDirection,
        })
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearchSubmit()
        }
    }

    const handleClearSearch = () => {
        setSearchInput("")
        onSearch({
            searchTerm: "",
            filters: {
                categoryName: watch("categoryName"),
                city: watch("city"),
                startDateTime: watch("startDateTime"),
                endDateTime: watch("endDateTime"),
                experienceLevel: watch("experienceLevel"),
                minAge: watch("minAge") ? Number.parseInt(watch("minAge")) : undefined,
                maxAge: watch("maxAge") ? Number.parseInt(watch("maxAge")) : undefined,
            },
            sortBy,
            sortDirection,
        })
    }

    const handleSortChange = (newSortBy, newSortDirection) => {
        setSortBy(newSortBy)
        setSortDirection(newSortDirection)
        setIsSortDropdownOpen(false)
        onSearch({
            searchTerm: searchInput,
            filters: {
                categoryName: watch("categoryName"),
                city: watch("city"),
                startDateTime: watch("startDateTime"),
                endDateTime: watch("endDateTime"),
                experienceLevel: watch("experienceLevel"),
                minAge: watch("minAge") ? Number.parseInt(watch("minAge")) : undefined,
                maxAge: watch("maxAge") ? Number.parseInt(watch("maxAge")) : undefined,
            },
            sortBy: newSortBy,
            sortDirection: newSortDirection,
        })
    }

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

        if (data.minAge !== "" && data.maxAge !== "" && Number.parseInt(data.minAge) > Number.parseInt(data.maxAge)) {
            setError("minAge", {
                type: "manual",
                message: "Minimum age cannot be greater than maximum age",
            });
            return;
        }

        clearErrors(["endDateTime", "minAge"])
        onSearch({
            searchTerm: searchInput,
            filters: {
                categoryName: data.categoryName || undefined,
                city: data.city || undefined,
                startDateTime: data.startDateTime || undefined,
                endDateTime: data.startDateTime && data.endDateTime ? data.endDateTime : undefined,
                experienceLevel: data.experienceLevel || undefined,
                minAge: data.minAge ? Number.parseInt(data.minAge) : undefined,
                maxAge: data.maxAge ? Number.parseInt(data.maxAge) : undefined,
            },
            sortBy,
            sortDirection,
        })

        setIsFilterDropdownOpen(false)
    }

    const handleClearFilters = () => {
        reset()
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
        })
    }

    // Greiti datos pasirinkimai
    const setDateFilter = (option) => {

        if (activeDateFilter === option) {
            setValue("startDateTime", "");
            setValue("endDateTime", "");
            setActiveDateFilter("");
            return;
        }

        const today = new Date()
        let startDate = new Date(today)
        let endDate = null

        switch (option) {
            case "today":
                // Šiandien - palikti tik šios dienos datą
                startDate = new Date(today.setHours(0, 0, 0, 0));
                endDate = new Date(today);
                endDate.setHours(23, 59, 59, 999);
                break;
            case "tomorrow":
                // Rytoj
                startDate = new Date(today);
                startDate.setDate(today.getDate() + 1);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setHours(23, 59, 59, 999);
                break;
            case "thisWeek":
                // Šią savaitę
                const dayOfWeek = today.getDay(); // 0 = sekmadienis, 6 = šeštadienis
                const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Pirmadienį padaryti savaitės pradžia
                startDate = new Date(today.setDate(diff));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                break;
            case "thisWeekend":
                // Savaitgalį
                const daysUntilSaturday = (6 - today.getDay()) % 7;
                startDate = new Date(today);
                startDate.setDate(today.getDate() + daysUntilSaturday);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 1);
                endDate.setHours(23, 59, 59, 999);
                break;
            case "nextWeek":
                // Kitą savaitę
                const nextMonday = today.getDate() + ((7 - today.getDay() + 1) % 7) + (today.getDay() === 1 ? 7 : 0);
                startDate = new Date(today.setDate(nextMonday));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                break;
            default:
                return;
        }

        // Formatuoti datas į YYYY-MM-DD formatą
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        setValue("startDateTime", formatDate(startDate));
        if (endDate) {
            setValue("endDateTime", formatDate(endDate));
        }
        setActiveDateFilter(option);
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
                            <FaSort className="text-btn" />
                            Sort by <FaChevronDown className="text-btn" />
                        </button>

                        {isSortDropdownOpen && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-fit min-w-[150px] sm:min-w-[200px] max-w-[90vw] bg-white shadow-md rounded-lg z-10 font-inter text-body-medium">
                                <div className="flex flex-col gap-1 p-2">
                                    <button
                                        onClick={() => handleSortChange("name", "ASC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowUpAZ className="text-btn text-lg" />A to Z
                                        </div>
                                        {sortBy === "name" && sortDirection === "ASC" && <FaCheck className="text-btn" />}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange("name", "DESC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowDownZA className="text-btn text-lg" />Z to A
                                        </div>
                                        {sortBy === "name" && sortDirection === "DESC" && <FaCheck className="text-btn" />}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange("experienceLevel", "ASC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowUp className="text-btn text-lg" />
                                            Beginner to Advanced
                                        </div>
                                        {sortBy === "experienceLevel" && sortDirection === "ASC" && <FaCheck className="text-btn" />}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange("experienceLevel", "DESC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowDown className="text-btn text-lg" />
                                            Advanced to Beginner
                                        </div>
                                        {sortBy === "experienceLevel" && sortDirection === "DESC" && <FaCheck className="text-btn" />}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange("startDateTime", "ASC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowUp19 className="text-btn text-lg" />
                                            Soonest to Latest
                                        </div>
                                        {sortBy === "startDateTime" && sortDirection === "ASC" && <FaCheck className="text-btn" />}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange("startDateTime", "DESC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowDown91 className="text-btn text-lg" />
                                            Latest to Soonest
                                        </div>
                                        {sortBy === "startDateTime" && sortDirection === "DESC" && <FaCheck className="text-btn" />}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange("createdAt", "ASC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowUp19 className="text-btn text-lg" />
                                            Newest to Latest
                                        </div>
                                        {sortBy === "createdAt" && sortDirection === "ASC" && <FaCheck className="text-btn" />}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange("createdAt", "DESC")}
                                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <FaArrowDown91 className="text-btn text-lg" />
                                            Latest to Newest
                                        </div>
                                        {sortBy === "createdAt" && sortDirection === "DESC" && <FaCheck className="text-btn" />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Filter mygtukas */}
                    <div className="relative" ref={filterDropdownRef}>
                        <button
                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            className="bg-[#FFFFFF] text-body-medium rounded-lg border-0 flex items-center gap-2 font-inter hover:bg-btn/8 px-4 py-2 min-w-[120px]"
                        >
                            <RiFilter2Fill className="text-btn" /> Filter <FaChevronDown className="text-btn" />
                        </button>

                        {/* Filtravimo dropdown */}
                        {isFilterDropdownOpen && (
                            <div className="filter-dropdown absolute right-0 top-full mt-2 w-72 bg-white shadow-lg rounded-lg z-20">
                                <div className="p-4 flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-body-medium">Category</label>

                                        <div className="relative" ref={categoryDropdownRef}>
                                            <button
                                                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                                className={`bg-[#FFFFFF] text-body-medium rounded-lg border border-input-light flex items-center gap-2 font-inter hover:bg-btn/8 px-4 py-2 w-full justify-between ${categoryName ? "text-black" : "text-gray-400"
                                                    }`}
                                                aria-expanded={isCategoryDropdownOpen}
                                                aria-controls="category-dropdown"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {categoryName && (
                                                        <CategoryImage
                                                            categoryId={categories.find((cat) => cat.name === categoryName)?.id}
                                                        />
                                                    )}
                                                    <span>{categoryName || "All Categories"}</span>
                                                </div>
                                                <FaChevronDown className="text-btn" />
                                            </button>

                                            {isCategoryDropdownOpen && (
                                                <div
                                                    id="category-dropdown"
                                                    className="absolute left-0 top-full mt-2 w-full bg-white shadow-md rounded-lg z-10 font-inter text-body-medium"
                                                >
                                                    <div className="flex flex-col gap-1 p-2">
                                                        <button
                                                            onClick={() => {
                                                                setValue("categoryName", "");
                                                                setIsCategoryDropdownOpen(false);
                                                            }}
                                                            className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                                        >
                                                            <div className="flex items-center gap-3 text-sm">
                                                                <span>All Categories</span>
                                                            </div>
                                                            {!categoryName && <FaCheck className="text-btn" />}
                                                        </button>
                                                        {categories.map((category) => (
                                                            <button
                                                                key={category.id}
                                                                onClick={() => {
                                                                    setValue("categoryName", category.name);
                                                                    setIsCategoryDropdownOpen(false);
                                                                }}
                                                                className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-btn/8 hover:text-black whitespace-nowrap"
                                                            >
                                                                <div className="flex items-center gap-3 text-sm">
                                                                    <CategoryImage categoryId={category.id} />
                                                                    <span>{category.name}</span>
                                                                </div>
                                                                {categoryName === category.name && <FaCheck className="text-btn" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-body-medium">Date Range</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <button
                                                type="button"
                                                onClick={() => setDateFilter("today")}
                                                className={`px-3 py-1 text-xs rounded-full text-body-medium border border-input-light ${activeDateFilter === "today" ? "bg-btn text-white hover:bg-btn-hover" : "bg-white hover:bg-btn/8"
                                                    }`}
                                            >
                                                Today
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDateFilter("tomorrow")}
                                                className={`px-3 py-1 text-xs rounded-full text-body-medium border border-input-light ${activeDateFilter === "tomorrow" ? "bg-btn text-white hover:bg-btn-hover" : "bg-white hover:bg-btn/8"
                                                    }`}
                                            >
                                                Tomorrow
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDateFilter("thisWeek")}
                                                className={`px-3 py-1 text-xs rounded-full text-body-medium border border-input-light ${activeDateFilter === "thisWeek" ? "bg-btn text-white hover:bg-btn-hover" : "bg-white hover:bg-btn/8"
                                                    }`}
                                            >
                                                This Week
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDateFilter("thisWeekend")}
                                                className={`px-3 py-1 text-xs rounded-full text-body-medium border border-input-light ${activeDateFilter === "thisWeekend" ? "bg-btn text-white hover:bg-btn-hover" : "bg-white hover:bg-btn/8"
                                                    }`}
                                            >
                                                This Weekend
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDateFilter("nextWeek")}
                                                className={`px-3 py-1 text-xs rounded-full text-body-medium border border-input-light ${activeDateFilter === "nextWeek" ? "bg-btn text-white hover:bg-btn-hover" : "bg-white hover:bg-btn/8"
                                                    }`}
                                            >
                                                Next Week
                                            </button>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <IoCalendarOutline className="text-btn" />
                                                <span className="text-xs text-body-medium">Event Date</span>
                                            </div>
                                            <input
                                                type="date"
                                                {...register("startDateTime")}
                                                className="input input-bordered w-full bg-white border border-input-light rounded-lg h-10 text-sm"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <IoCalendarOutline className="text-btn" />
                                                <span className="text-xs text-body-medium">To Date</span>
                                            </div>
                                            <input
                                                type="date"
                                                {...register("endDateTime")}
                                                lang="lt"
                                                disabled={!startDateTime}
                                                className="input input-bordered w-full bg-white border border-input-light rounded-lg h-10 text-sm"
                                            />
                                        </div>
                                        {errors.endDateTime && <p className="text-red-500 text-xs">{errors.endDateTime.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-body-medium">Age Range</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                {...register("minAge", {
                                                    valueAsNumber: true,
                                                    min: { value: 0, message: "Minimum age must be 0 or greater" },
                                                    max: { value: 120, message: "Maximum age cannot be more than 120" },
                                                })}
                                                placeholder="From"
                                                className="input input-bordered w-full bg-white border border-input-light rounded-lg h-10 text-sm"
                                            />
                                            <input
                                                type="number"
                                                {...register("maxAge", {
                                                    valueAsNumber: true,
                                                    min: { value: 0, message: "Maximum age must be 0 or greater" },
                                                    max: { value: 120, message: "Maximum age cannot be more than 120" },
                                                })}
                                                placeholder="To"
                                                className="input input-bordered w-full bg-white border border-input-light rounded-lg h-10 text-sm"
                                            />
                                        </div>
                                        {errors.minAge && <p className="text-red-500 text-xs">{errors.minAge.message}</p>}
                                        {errors.maxAge && <p className="text-red-500 text-xs">{errors.maxAge.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-body-medium">City</label>
                                        <input
                                            {...register("city", {
                                                pattern: {
                                                    value:
                                                        /^([a-zA-Z0-9\u0080-\u02FF\u1E00-\u1EFF\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF]+(?:[\s.\-''']){0,2})*[a-zA-Z0-9\u0080-\u02FF\u1E00-\u1EFF\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF]*$|^$/,
                                                    message: "City name can only contain letters, numbers, spaces, dots, or hyphens",
                                                },
                                            })}
                                            placeholder="Enter location"
                                            className="input input-bordered w-full bg-white border border-input-light rounded-lg h-10 text-sm"
                                        />
                                        {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-body-medium">Experience Level</label>
                                        <select
                                            {...register("experienceLevel")}
                                            className="select select-bordered w-full bg-white border border-input-light rounded-lg h-10 text-sm"
                                        >
                                            <option value="">Any Level</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Extreme">Extreme</option>
                                            <option value="All Welcome">All Welcome</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={handleSubmit(onSubmit)}
                                            className="btn bg-btn hover:bg-btn-hover text-white rounded-lg flex-1"
                                        >
                                            Apply Filters
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleClearFilters}
                                            className="btn bg-white hover:bg-gray-100 text-body-medium border border-input-light rounded-lg flex-1"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default EventSearch

