import { Outlet } from "react-router";
import Header from "./Header";

const Main = () => {
 
  return (

    <div className="desktop:flex desktop:gap-[2.25rem] ">
      <div className=" desktop:ml-[2rem] desktop:mt-[2rem] desktop:mr-0 desktop:pt-0 md:pt-[1.44rem] md:ml-[1.56rem] md:mr-[1.5rem]">
        <Header />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Main;