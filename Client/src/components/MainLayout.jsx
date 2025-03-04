import { Outlet } from "react-router";
import Header from "./Header/Header";
import NoSignedInHeader from "./Header/NotSignedInHeader";
import Footer from "./Footer";

const MainLayout = () => {
 
  return (

    <div className="flex justify-center flex-col">
      <div>
        <NoSignedInHeader/>
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

export default MainLayout;