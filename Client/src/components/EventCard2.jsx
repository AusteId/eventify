import React from 'react';
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';

const EventCard2 = () => {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition-all">
      <figure className="relative">
        {/* <Image
          src={'./src/assets/eventCardImgSample.png'}
          alt={'Title'}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        /> */}
        <img
          src="./src/assets/eventCardImgSample.png"
          alt="Image"
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="badge badge-neutral badge-lg">
            {5}/{7}
          </div>
          <div className={`badge badge-warning badge-lg`}>{'Hard'}</div>
        </div>
      </figure>

      <div className="card-body p-4">
        <h3 className="card-title text-xl">{'Title'}</h3>
        {event?.description ? (
          <p className="text-base-content/70 text-sm">{event.description}</p>
        ) : (
          <p className="text-base-content/70 text-sm italic">
            No description available
          </p>
        )}

        <div className="space-y-3 my-3">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4 text-base-content/70" />
            <span>{'2025/01/01'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-base-content/70" />
            <span>{'6:00'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-base-content/70" />
            <span>{'Kaunas'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-base-content/70" />
            <span>{'56'}</span>
          </div>
        </div>

        <div className="card-actions justify-end mt-2">
          <button className="btn btn-primary w-full">Register</button>
        </div>
      </div>
    </div>
  );
};

export default EventCard2;
