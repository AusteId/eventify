import { useState } from 'react';
import EventsList from '../components/EventsList';

const Events = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col items-center gap-5 py-10 px-10 text-black">
      <div
        className={`flex flex-col justify-start gap-8 h-full items-center tablet:items-baseline ${loading && 'tablet:items-center'}`}
      >
        <h1
          className={`text-heading-m font-[700] leading-[1.5rem] ${loading && 'text-center'}`}
        >
          Events
        </h1>

        <div className="h-full">
          <EventsList setLoading={setLoading} loading={loading} />
        </div>
      </div>
    </div>
  );
};
export default Events;
