import heroBanner from "../assets/HeroBanner.png";


const Home = () => {

    return (
        <>
            <div className="relative w-full h-[37.5rem]">
                <section className="absolute w-full h-full" style={{ backgroundImage: `url(${heroBanner})` }}>
                    <div className="m-20">
                        <h1 className="text-wh">Connect, Create, Celebrate</h1>
                    </div>
                </section >
                <section className="bg-black/50 w-full h-full absolute"></section>
            </div>


        </>
    )
}
export default Home;