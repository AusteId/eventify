import React, { useState } from 'react';
import MyEventsList from './MyEventsList';
import { useNotifications } from '../context/NotificationContext';

const MyRegistrations = () => {
    const [activeTab, setActiveTab] = useState('registered');
    const [loading, setLoading] = useState(true);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const {isDarkMode} = useNotifications();

    const endpoint = activeTab === 'created'
        ? '/api/events/user/created-events'
        : '/api/events/user/registered-events';

    return (
        <div className="flex flex-col items-center gap-5 py-10 px-10 text-black min-h-screen">
            <div className="w-full max-w-5xl mx-auto">
                <h1
                    className={`${isDarkMode && "text-gray-200"} text-heading-m font-[700] leading-[1.5rem] text-center tablet:text-left ${loading && 'text-center'
                        }`}
                >
                    My Registrations
                </h1>

                <div className="flex justify-center tablet:justify-start mb-6 mt-6 ">
                    <div className={`inline-flex rounded-lg p-1 shadow-sm border duration-750 ${isDarkMode ? "bg-slate-900 border-[#f59e0b]" : "border-transparent bg-btn/10"}`}>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-inter transition-colors duration-200 cursor-pointer ${activeTab === 'registered' && isDarkMode ? "bg-amber-600/80 text-gray-200"
                                : activeTab === "registered" 
                                ? 'bg-btn !text-white'
                                : isDarkMode ? "text-gray-400"
                                : 'bg-transparent !text-body-medium'
                                }`}
                            onClick={() => handleTabChange('registered')}
                        >
                            Events I’m Attending
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-inter transition-colors duration-200 cursor-pointer ${activeTab === 'created' && isDarkMode ? "bg-amber-600/80 text-gray-200"
                                : activeTab === "created" 
                                ? 'bg-btn !text-white'
                                : isDarkMode ? "text-gray-400"
                                : 'bg-transparent !text-body-medium'
                                }`}
                            onClick={() => handleTabChange('created')}
                        >
                            Events I’ve Created
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto">
                <MyEventsList
                    isDarkMode={isDarkMode}
                    endpoint={endpoint}
                    setLoading={setLoading}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default MyRegistrations;