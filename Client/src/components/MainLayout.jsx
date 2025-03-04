import { Outlet } from "react-router";
import Header from "./Header/Header";
import NoSignedInHeader from "./Header/NotSignedInHeader";

const MainLayout = () => {
 
  return (

    <div className="flex justify-center flex-col">
      <div>
        <NoSignedInHeader/>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;