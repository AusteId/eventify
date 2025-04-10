import React, { useState } from 'react';
import EventsList from './EventsList';

const MyRegistrations = () => {
    const [activeTab, setActiveTab] = useState('registered');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const endpoint = activeTab === 'created'
        ? '/api/user/created-events'
        : '/api/user/registered-events';

    return (
        <div className="my-registrations container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2">My Registrations</h1>
            <p className="text-gray-600 mb-4">Manage your event registrations and creations</p>

            <div className="tabs mb-6">
                <button
                    className={`tab tab-bordered ${activeTab === 'registered' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('registered')}
                >
                    Events I’m Attending
                </button>
                <button
                    className={`tab tab-bordered ${activeTab === 'created' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('created')}
                >
                    Events I’ve Created
                </button>
            </div>

            <EventsList endpoint={endpoint} />
        </div>
    );
};

export default MyRegistrations;