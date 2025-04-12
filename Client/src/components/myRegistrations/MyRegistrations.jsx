import React, { useState } from 'react';
import MyEventsList from './MyEventsList';

const MyRegistrations = () => {
    const [activeTab, setActiveTab] = useState('registered');
    const [loading, setLoading] = useState(true);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const endpoint = activeTab === 'created'
        ? '/api/events/user/created-events'
        : '/api/events/user/registered-events';

    return (
        <div className="flex flex-col items-center gap-5 py-10 px-10 text-black min-h-screen">
            <div className="w-full max-w-5xl mx-auto">
                <h1
                    className={`text-heading-m font-[700] leading-[1.5rem] text-center tablet:text-left ${loading && 'text-center'
                        }`}
                >
                    My Registrations
                </h1>

                <div className="flex justify-center tablet:justify-start mb-6 mt-6">
                    <div className="inline-flex rounded-lg bg-btn/10 p-1 shadow-sm">
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-inter transition-colors duration-200 cursor-pointer ${activeTab === 'registered'
                                ? 'bg-btn !text-white'
                                : 'bg-transparent !text-body-medium'
                                }`}
                            onClick={() => handleTabChange('registered')}
                        >
                            Events I’m Attending
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-inter transition-colors duration-200 cursor-pointer ${activeTab === 'created'
                                ? 'bg-btn !text-white'
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
                    endpoint={endpoint}
                    setLoading={setLoading}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default MyRegistrations;