import { Outlet } from "react-router";
import Header from "./Header/Header";
import NoSinginHeader from "./Header/NotSinginHeader";
import RegistrationHeader from "./Header/RegistrationHeader";

const Main = () => {
 
  return (

    <div className="flex justify-center flex-col ">
      <div>
        <Header />
        <NoSinginHeader/>
        <RegistrationHeader/>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Main;