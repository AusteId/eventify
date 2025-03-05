import EventsList from '../components/EventsList';

const Events = () => {
  return (
    <div className="flex flex-col items-center gap-5 bg-amber-50 py-10 px-10">
      <div className="flex flex-col justify-center gap-8">
        <h1 className="text-heading-m font-[700] leading-[1.5rem]">Events</h1>

        <div>
          <EventsList />
        </div>
      </div>
    </div>
  );
};
export default Events;
