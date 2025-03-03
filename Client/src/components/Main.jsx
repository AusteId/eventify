import { Outlet } from "react-router";
import Header from "./Header/Header";
import NoSinginHeader from "./Header/NotSinginHeader";

const Main = () => {
 
  return (
    <div className="bg-gradient-to-b from-[#F3E3C7] via-[#F3E3C7] to-[#F9F4EB] h-screen">
      <div>
        <Header />
        <NoSinginHeader/>
      </div>
      <div className="p-8">
        <Outlet
         />
        
      </div>
    </div>
  );
};

export default Main;