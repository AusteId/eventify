import { Outlet } from "react-router";
import Header from "./Header/Header";
import NoSignedInHeader from "./Header/NotSignedInHeader";
import Footer from "./Footer";
import RegistrationHeader from "./Header/RegistrationHeader";
import AboutRegistrationPage from "./Registration/AboutRegistrationPage";

const MainLayout = () => {
 
  return (

    <div className="flex justify-center flex-col">
      <div>
        <RegistrationHeader/>
      </div>
      <div>
        <AboutRegistrationPage/>
      </div>
      <div>
        <Footer/>
      </div>
    </div>
  );
};

export default MainLayout;