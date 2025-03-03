import { Outlet } from "react-router";
import Header from "./Header/Header";
import NoSinginHeader from "./Header/NotSinginHeader";
import Footer from "./Footer";

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
        <Footer/>
      </div>
    </div>
  );
};

export default Main;