import heroBanner from "../assets/HeroBanner.png";
import Button from "../components/button";


const Home = () => {

    return (
        <div>
            <div className="relative w-full h-[37.5rem]">
                <section className="absolute w-full h-full bg-cover bg-bottom" style={{ backgroundImage: `url(${heroBanner})` }}></section >
                <section className="bg-black/50 w-full h-full absolute">
                    <div className="mx-20 w-[42rem] flex flex-col gap-8">
                        <h1 className="text-white text-heading-xl mt-48 font-[700]">Connect, Create, Celebrate</h1>
                        <p className="text-white text-heading-s/tight font-[400]">
                            Discover amazing events or create your own.
                            Join a comminty of people who love to connect and share experiences.
                        </p>
                        <div className="flex gap-4">
                            <Button >Create Event</Button>
                            <Button background="bg-white" textColor="text-btn">Join Event</Button>
                        </div>
                    </div>
                </section>
            </div>
            <div className="text-center py-16 px-20">
                <h1 className="text-heading-l">Explore Events By Category</h1>
                <CategoryButton></CategoryButton>

            </div>

        </div>
    )
}
export default Home;