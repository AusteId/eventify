import React from 'react';
import EventCard from './EventCard';

const EventsList = () => {
  const start = new Date();
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  return (
    <div className="inline-grid tablet:grid-cols-2 desktop:grid-cols-3 justify-items-center gap-7">
      <EventCard
        experienceLevel={2}
        isRegistered={0}
        currentParticipants={2}
        maxParticipants={9}
        title="Great Paulino Event"
        description="Lorem ipsum yra tekstas naudojamas spaudos ir grafinio dizaino industrijoje jau nuo XVI amžiaus pradžios. Jis naudojamas parodyti grafinio"
        startDateTime={start}
        endDateTime={end}
        location="Paulino g. 20"
        requiredAge="+18"
      />
      <EventCard
        experienceLevel={2}
        isRegistered={1}
        currentParticipants={2}
        maxParticipants={9}
        title="Great Paulino Event"
        // description="Lorem ipsum yra tekstas naudojamas spaudos ir grafinio dizaino industrijoje jau nuo XVI amžiaus pradžios. Jis naudojamas parodyti grafinio"
        startDateTime={start}
        endDateTime={end}
        location="Paulino g. 20"
        requiredAge="All ages"
      />
      <EventCard
        experienceLevel={2}
        isRegistered={0}
        currentParticipants={2}
        maxParticipants={9}
        title="Great Paulino Event"
        description="Lorem ipsum yra tekstas naudojamas spaudos ir grafinio dizaino industrijoje jau nuo XVI amžiaus pradžios. Jis naudojamas parodyti grafinio"
        startDateTime={start}
        // endDateTime={end}
        location="Paulino g. 20"
        requiredAge="+18"
      />
      <EventCard
        experienceLevel={2}
        isRegistered={0}
        currentParticipants={2}
        maxParticipants={9}
        title="Great Paulino Event"
        description="Lorem ipsum yra tekstas naudojamas spaudos ir grafinio dizaino industrijoje jau nuo XVI amžiaus pradžios. Jis naudojamas parodyti grafinio"
        startDateTime={start}
        endDateTime={end}
        location="Paulino g. 20"
        requiredAge="+18"
      />

      <EventCard experienceLevel={2} />
    </div>
  );
};

export default EventsList;
