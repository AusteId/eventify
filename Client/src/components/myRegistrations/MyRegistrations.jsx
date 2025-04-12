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
        <div className="flex flex-col items-center gap-5 py-10 px-10 text-black">
            <div
                className={`flex flex-col justify-start gap-8 h-full items-center tablet:items-baseline ${loading && 'tablet:items-center'
                    }`}
            >
                <h1
                    className={`text-heading-m font-[700] leading-[1.5rem] ${loading && 'text-center'
                        }`}
                >
                    My Registrations
                </h1>

                <div className="tabs mb-6 flex gap-4">
                    <button
                        className={`tab tab-bordered px-4 py-2 rounded-lg text-sm font-inter ${activeTab === 'registered'
                                ? 'bg-btn !text-white'
                                : 'bg-[#FFFFFF] hover:bg-btn/8 !text-body-medium'
                            }`}
                        onClick={() => handleTabChange('registered')}
                    >
                        Events I’m Attending
                    </button>
                    <button
                        className={`tab tab-bordered px-4 py-2 rounded-lg text-sm font-inter ${activeTab === 'created'
                                ? 'bg-btn !text-white'
                                : 'bg-[#FFFFFF] hover:bg-btn/8 !text-body-medium'
                            }`}
                        onClick={() => handleTabChange('created')}
                    >
                        Events I’ve Created
                    </button>
                </div>

                <div className="h-full w-full">
                    <MyEventsList
                        endpoint={endpoint}
                        setLoading={setLoading}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyRegistrations;