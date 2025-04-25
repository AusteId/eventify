import {
  CalendarDays,
  House,
  LogIn,
  Menu,
  NotepadText,
  UserPlus,
  UsersRound,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import Button from '../Button';
import HeaderProfilePicture from './HeaderProfilePicture';
import DarkModeToggle from './DarkModeToggle';
import ProfileSVG from '../../assets/ProfileSVG';
import MessageSVG from '../../assets/MessageSVG';
import LogoutSVG from '../../assets/LogoutSVG';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import AdminPanelSVG from '../../assets/AdminPanelSVG.jsx';

const Header = () => {
  const [activeLink, setActiveLink] = useState('');
  const { isAuthenticated, logout, roles } = useAuth();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerCheckboxRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', auth: false },
    { name: 'Events', href: '/events', auth: false },
    { name: 'My Registrations', href: '/myRegistrations', auth: true },
    { name: 'About Us', href: '/about', auth: false },
  ];

  const adminRole = roles.find(role => role.name === 'ADMIN');

  const location = useLocation();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleMediaChange = e => {
      if (e.matches && isDrawerOpen) {
        if (drawerCheckboxRef.current) {
          drawerCheckboxRef.current.checked = false;
          setIsDrawerOpen(false);
        }
      }
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsDrawerOpen(false);
  }, [navigate]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`shadow-sm sticky top-0 z-11 duration-750 ${isDarkMode ? 'bg-slate-900 shadow-sm shadow-slate-900' : 'bg-white'}`}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {isDarkMode ? (
                <img
                  src="/eventify-dark.png"
                  alt="eventify logo dark"
                  className="cursor-pointer w-[30px] h-[32px] "
                  onClick={() => navigate('/')}
                />
              ) : (
                <img
                  src="/eventify-light.png"
                  alt="eventify logo light"
                  className="cursor-pointer w-[30px] h-[32px] "
                  onClick={() => navigate('/')}
                />
              )}
              <span
                className={`cursor-pointer text-2xl font-bold duration-750 ${isDarkMode ? 'text-[#f59e0b] text-shadow-lg text-shadow-yellow-200' : 'text-title'}`}
                onClick={() => navigate('/')}
              >
                Eventify
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex lg:px-6 md:flex md:px-6 relative">
              <ul className="flex space-x-4 lg:space-x-6 items-center">
                {navLinks.map(link => {
                  if (!isAuthenticated && link.auth) {
                    return null;
                  } else {
                    return (
                      <li key={link.name}>
                        <NavLink
                          to={link.href}
                          onClick={() => setActiveLink(link.name)}
                          className={`
                    px-3 py-2 rounded-md text-sm font-inter font-bold transition-colors ease-in-out text-nowrap 
                    ${
                      activeLink === link.href && isDarkMode
                        ? 'text-btn bg-slate-700 duration-750'
                        : activeLink === link.href
                          ? 'text-btn bg-yellow-50'
                          : isDarkMode
                            ? 'text-gray-200 hover:bg-slate-600 duration 750'
                            : 'duration-150 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                          aria-current={
                            activeLink === link.name ? 'page' : undefined
                          }
                        >
                          {link.name}
                        </NavLink>
                      </li>
                    );
                  }
                })}
                {(location.pathname === '/login' ||
                  location.pathname.startsWith('/register')) && (
                  <div className="absolute top-[-77%] left-[85%] mt-[2.5px] md:block min-[1px]:hidden">
                    <DarkModeToggle />
                  </div>
                )}
              </ul>
            </div>

            {/* Right Section: Actions & User Menu */}
            <div className="flex items-center gap-3 sm:gap-4">
              {isAuthenticated && (
                <div className="hidden md:block lg:block">
                  <Button
                    onClick={() => {
                      document
                        .getElementById('event_creation_modal')
                        .showModal();
                    }}
                  >
                    Create Event
                  </Button>
                </div>
              )}
              {!isAuthenticated &&
              location.pathname !== '/login' &&
              !location.pathname.startsWith('/register') ? (
                <div className="relative hidden md:flex lg:flex space-x-3">
                  <NavLink tabIndex={-1} to={'/login'}>
                    <Button>Login</Button>
                  </NavLink>
                  <NavLink tabIndex={-1} to={'/register'}>
                    <Button>Sign Up</Button>
                  </NavLink>
                  <div className="absolute right-[-25%] top-[-24%] mt-[2.5px] md:block min-[1px]:hidden">
                    <DarkModeToggle />
                  </div>
                </div>
              ) : !isAuthenticated &&
                !location.pathname.startsWith('/register') ? (
                <div className="w-45"></div>
              ) : !isAuthenticated ? (
                <div className="w-45"></div>
              ) : null}
              {isAuthenticated && (
                <div className="relative" ref={dropdownRef}>
                  <div className="absolute z-50 md:right-[-90%] min-[2px]:hidden md:block top-[0%]">
                    <DarkModeToggle />
                  </div>
                  <div className="relative flex items-center">
                    <div
                      role="button"
                      className="p-1 hover:bg-advanced rounded-full cursor-pointer"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <HeaderProfilePicture />
                    </div>
                    {isDropdownOpen && (
                      <ul
                        className={`absolute right-0 top-full mt-2 bg-base-100 rounded-box w-52 p-2 shadow-sm z-[1000] ${
                          isDarkMode
                            ? 'bg-slate-900 text-gray-200 border-[#f59e0b] border-1 shadow-lg shadow-[#f59e0b]'
                            : 'border-1 border-gray-500'
                        }`}
                        style={{ transition: 'background-color 750ms ease' }}
                      >
                        {(adminRole && location.pathname !== '/admin') ? (
                          <li
                            className={`relative flex justify-center py-1 cursor-pointer ${
                              isDarkMode
                                ? 'hover:bg-slate-600 duration-750'
                                : 'hover:bg-gray-100 duration-150'
                            }`}
                            onClick={() => {
                              navigate('/admin');
                              setIsDropdownOpen(false);
                            }}
                          >
                            <div className="absolute left-[5%]">
                              <AdminPanelSVG />
                            </div>
                            <a>Admin Panel</a>
                          </li>
                        ) : adminRole && (
                          <li
                            className={`relative flex justify-center py-1 cursor-pointer ${
                              isDarkMode
                                ? 'hover:bg-slate-600 duration-750'
                                : 'hover:bg-gray-100 duration-150'
                            }`}
                            onClick={() => {
                              navigate('/admin/ban-page');
                              setIsDropdownOpen(false);
                            }}
                          >
                            <div className="absolute left-[5%]">
                              <AdminPanelSVG />
                            </div>
                            <a>View All Bans</a>
                          </li>
                        )}

                        <li
                          className={`relative flex justify-center py-1 cursor-pointer ${
                            isDarkMode
                              ? 'hover:bg-slate-600 duration-750'
                              : 'hover:bg-gray-100 duration-150'
                          }`}
                          onClick={() => {
                            navigate('/profile');
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="absolute left-[15%]">
                            <ProfileSVG />
                          </div>
                          <a>Profile</a>
                        </li>
                        <li
                          className={`relative flex justify-center py-1 cursor-pointer ${
                            isDarkMode
                              ? 'hover:bg-slate-600 duration-750'
                              : 'hover:bg-gray-100 duration-150'
                          }`}
                          onClick={() => {
                            navigate('/chat');
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="absolute left-[15%]">
                            <MessageSVG />
                          </div>
                          <a>Messages</a>
                        </li>
                        <li
                          className={`relative flex justify-center py-1 cursor-pointer ${
                            isDarkMode
                              ? 'hover:bg-slate-600 duration-750'
                              : 'hover:bg-gray-100 duration-150'
                          }`}
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="absolute left-[15%]">
                            <LogoutSVG />
                          </div>
                          <a>Logout</a>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              )}

              <div className="md:hidden lg:hidden">
                <div className="drawer drawer-end">
                  <input
                    id="mobilenav"
                    type="checkbox"
                    className="drawer-toggle"
                    ref={drawerCheckboxRef}
                    onChange={e => setIsDrawerOpen(e.target.checked)}
                  />
                  <div className="drawer-content">
                    {/* Page content here */}
                    <label
                      htmlFor="mobilenav"
                      className={`drawer-button btn ${isDarkMode && 'bg-slate-800 border-advanced shadow-sm shadow-[#f59e0b] text-[#f59e0b]'}`}
                    >
                      <Menu />
                    </label>
                  </div>
                  <div className="drawer-side">
                    <label
                      htmlFor="mobilenav"
                      aria-label="close sidebar"
                      className="drawer-overlay"
                    ></label>
                    <ul
                      className={`menu text-base-content min-h-full w-70 p-4 mr-4 ${isDarkMode ? 'bg-slate-900' : 'bg-base-200'}
                    `}
                      style={{ transition: 'background-color 750ms ease' }}
                    >
                      {/* Sidebar content here */}

                      <li>
                        <NavLink
                          to={'/'}
                          onClick={toggleDrawer}
                          className={`flex justify-center py-4 font-inter font-bold text-body-medium text-body-m ${isDarkMode && 'text-gray-200 duration-750 hover:bg-slate-600'}`}
                        >
                          <House />
                          Home
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={'/events'}
                          onClick={toggleDrawer}
                          className={`flex justify-center py-4 font-inter font-bold text-body-medium text-body-m ${isDarkMode && 'text-gray-200 duration-750 hover:bg-slate-600'}`}
                        >
                          <CalendarDays />
                          Events
                        </NavLink>
                      </li>
                      {isAuthenticated && (
                        <li>
                          <NavLink
                            to={'/myRegistrations'}
                            onClick={toggleDrawer}
                            className={`flex justify-center py-4 font-inter font-bold text-body-medium text-body-m ${isDarkMode && 'text-gray-200 duration-750 hover:bg-slate-600'}`}
                          >
                            <NotepadText />
                            My Registrations
                          </NavLink>
                        </li>
                      )}
                      <li>
                        <NavLink
                          to={'/about'}
                          onClick={toggleDrawer}
                          className={`flex justify-center py-4 font-inter font-bold text-body-medium text-body-m ${isDarkMode && 'text-gray-200 duration-750 hover:bg-slate-600'}`}
                        >
                          <UsersRound />
                          About Us
                        </NavLink>
                      </li>
                      {!isAuthenticated && (
                        <>
                          <div>
                            <li>
                              <NavLink
                                to={'/login'}
                                onClick={toggleDrawer}
                                className={`flex justify-center py-4 font-inter font-bold text-body-medium text-body-m ${isDarkMode && 'text-gray-200 duration-750 hover:bg-slate-600'}`}
                              >
                                <LogIn />
                                Sign In
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={'/register'}
                                onClick={toggleDrawer}
                                className={`flex justify-center py-4 font-inter font-bold text-body-medium text-body-m ${isDarkMode && 'text-gray-200 duration-750 hover:bg-slate-600'}`}
                              >
                                <UserPlus />
                                Sign Up
                              </NavLink>
                            </li>
                          </div>
                        </>
                      )}
                      <div className="flex justify-center ">
                        <DarkModeToggle />
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
