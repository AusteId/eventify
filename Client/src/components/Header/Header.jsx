import { NavLink } from "react-router";
import HeaderProfilePicture from "./HeaderProfilePicture";
import Button from "../button";
const setActive = ({ isActive }) =>
    isActive ? "text-[#F59E0B]" : "text-body-medium hover:text-[#F59E0B] hover:underline";
  
const Header = () => {

    return(
        <header className=" sticky h-[4rem] bg-[#FFFFFF] shadow-md flex ">
            <nav className=" flex justify-between  self-center items-center w-[100%] px-6">
                <section className=" flex items-center gap-[1rem]">
                    <svg 
                        width="21" 
                        height="24" viewBox="0 0 21 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                    <path 
                        id="Vector" d="M6 0C6.82969 0 7.5 0.670312 7.5 1.5V3H13.5V1.5C13.5 0.670312 14.1703 0 15 0C15.8297 0 16.5 0.670312 16.5 1.5V3H18.75C19.9922 3 21 4.00781 21 5.25V7.5H0V5.25C0 4.00781 1.00781 3 2.25 3H4.5V1.5C4.5 0.670312 5.17031 0 6 0ZM0 9H21V21.75C21 22.9922 19.9922 24 18.75 24H2.25C1.00781 24 0 22.9922 0 21.75V9ZM3 12.75V14.25C3 14.6625 3.3375 15 3.75 15H5.25C5.6625 15 6 14.6625 6 14.25V12.75C6 12.3375 5.6625 12 5.25 12H3.75C3.3375 12 3 12.3375 3 12.75ZM9 12.75V14.25C9 14.6625 9.3375 15 9.75 15H11.25C11.6625 15 12 14.6625 12 14.25V12.75C12 12.3375 11.6625 12 11.25 12H9.75C9.3375 12 9 12.3375 9 12.75ZM15.75 12C15.3375 12 15 12.3375 15 12.75V14.25C15 14.6625 15.3375 15 15.75 15H17.25C17.6625 15 18 14.6625 18 14.25V12.75C18 12.3375 17.6625 12 17.25 12H15.75ZM3 18.75V20.25C3 20.6625 3.3375 21 3.75 21H5.25C5.6625 21 6 20.6625 6 20.25V18.75C6 18.3375 5.6625 18 5.25 18H3.75C3.3375 18 3 18.3375 3 18.75ZM9.75 18C9.3375 18 9 18.3375 9 18.75V20.25C9 20.6625 9.3375 21 9.75 21H11.25C11.6625 21 12 20.6625 12 20.25V18.75C12 18.3375 11.6625 18 11.25 18H9.75ZM15 18.75V20.25C15 20.6625 15.3375 21 15.75 21H17.25C17.6625 21 18 20.6625 18 20.25V18.75C18 18.3375 17.6625 18 17.25 18H15.75C15.3375 18 15 18.3375 15 18.75Z" 
                        fill="#F59E0B"
                    />
                    </svg>
                    <h1 className=" text-title text-heading-s font-inter not-italic font-[700] ">Eventify</h1>
                </section>
                <section className=" h-[1.5rem] w-[23.28613rem] p-1 ">
                    <section className=" flex justify-evenly font-inter text-body-m not-italic font-[400] leading-4 items-center  ">
                        <NavLink to="/" className={setActive}>
                            <h1 className=" hover:underline hover">Home</h1>
                        </NavLink>
                        <NavLink to="/events" className={setActive}>
                            <h1 className="  hover:underline">Events</h1>
                        </NavLink>
                        <NavLink to="/myRegistrations" className={setActive}>
                            <h1 className="  hover:underline ">My Registrations</h1>
                        </NavLink>
                        <NavLink to="/aboutUs" className={setActive}>
                            <h1 className="  hover:underline ">About Us</h1>
                        </NavLink>
                    </section>
                </section>
                <section className=" w-[10.83694rem] h-[2.5rem]  flex justify-center items-center gap-[1rem] ">
                    <Button>Create Event</Button>
                    <HeaderProfilePicture/>
                </section>
            </nav>
        </header>
    )
}
export default Header;