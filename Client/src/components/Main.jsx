import { Outlet } from "react-router";
import Header from "./Header/Header";
import NoSinginHeader from "./Header/NotSinginHeader";

const Main = () => {
 
  return (

    <div className="desktop:flex desktop:gap-[2.25rem] ">
      <div>
        <Header />
        <NoSinginHeader/>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Main;