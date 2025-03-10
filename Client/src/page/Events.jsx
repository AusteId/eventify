import EventsList from '../components/EventsList';

const Events = () => {
  return (
    <div className="flex flex-col items-center gap-5 py-10 px-10 text-black">
      <div className="flex flex-col justify-start gap-8 h-full">
        <h1 className="text-heading-m font-[700] leading-[1.5rem]">Events</h1>

        <div className="h-full">
          <EventsList />
        </div>
      </div>
    </div>
  );
};
export default Events;
