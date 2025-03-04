import { Outlet } from "react-router";
import Header from "./Header/Header";
import NoSinginHeader from "./Header/NotSinginHeader";

const Main = () => {
 
  return (

    <div className="flex justify-center flex-col ">
      <div>
        <Header />
        <NoSinginHeader/>
      </div>
      <div>
        <Outlet />
      </div>
      <div>
        
      </div>
    </div>
  );
};

export default Main;