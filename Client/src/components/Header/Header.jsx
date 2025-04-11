import {
  CalendarDays,
  House,
  LogIn,
  Menu,
  NotepadText,
  UserPlus,
  UsersRound,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import Button from '../Button';
import StepIndicator from '../StepIndicator';
import HeaderProfilePicture from './HeaderProfilePicture';

const Header = ({ loading, currentStep }) => {
  const [activeLink, setActiveLink] = useState('');
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', href: '/', auth: false },
    { name: 'Events', href: '/events', auth: false },
    { name: 'My Registrations', href: '/myRegistrations', auth: true },
    { name: 'About Us', href: '/about', auth: false },
  ];

  const location = useLocation();

  useEffect(() => {
    setActiveLink(location.pathname);
  });

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {!loading && (
            <>
              {/* Logo Section */}
              <div className="flex-shrink-0 flex items-center">
                <a href="/" className="flex items-center gap-4">
                  <svg
                    width="21"
                    height="24"
                    viewBox="0 0 21 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id="Vector"
                      d="M6 0C6.82969 0 7.5 0.670312 7.5 1.5V3H13.5V1.5C13.5 0.670312 14.1703 0 15 0C15.8297 0 16.5 0.670312 16.5 1.5V3H18.75C19.9922 3 21 4.00781 21 5.25V7.5H0V5.25C0 4.00781 1.00781 3 2.25 3H4.5V1.5C4.5 0.670312 5.17031 0 6 0ZM0 9H21V21.75C21 22.9922 19.9922 24 18.75 24H2.25C1.00781 24 0 22.9922 0 21.75V9ZM3 12.75V14.25C3 14.6625 3.3375 15 3.75 15H5.25C5.6625 15 6 14.6625 6 14.25V12.75C6 12.3375 5.6625 12 5.25 12H3.75C3.3375 12 3 12.3375 3 12.75ZM9 12.75V14.25C9 14.6625 9.3375 15 9.75 15H11.25C11.6625 15 12 14.6625 12 14.25V12.75C12 12.3375 11.6625 12 11.25 12H9.75C9.3375 12 9 12.3375 9 12.75ZM15.75 12C15.3375 12 15 12.3375 15 12.75V14.25C15 14.6625 15.3375 15 15.75 15H17.25C17.6625 15 18 14.6625 18 14.25V12.75C18 12.3375 17.6625 12 17.25 12H15.75ZM3 18.75V20.25C3 20.6625 3.3375 21 3.75 21H5.25C5.6625 21 6 20.6625 6 20.25V18.75C6 18.3375 5.6625 18 5.25 18H3.75C3.3375 18 3 18.3375 3 18.75ZM9.75 18C9.3375 18 9 18.3375 9 18.75V20.25C9 20.6625 9.3375 21 9.75 21H11.25C11.6625 21 12 20.6625 12 20.25V18.75C12 18.3375 11.6625 18 11.25 18H9.75ZM15 18.75V20.25C15 20.6625 15.3375 21 15.75 21H17.25C17.6625 21 18 20.6625 18 20.25V18.75C18 18.3375 17.6625 18 17.25 18H15.75C15.3375 18 15 18.3375 15 18.75Z"
                      fill="#F59E0B"
                    />
                  </svg>
                  <span className="text-2xl font-bold text-title">
                    Eventify
                  </span>
                </a>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex lg:px-6 md:flex md:px-6">
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
                        px-3 py-2 rounded-md text-sm font-inter font-bold transition-colors duration-150 ease-in-out text-nowrap
                        ${
                          activeLink === link.href
                            ? 'text-btn bg-yellow-50' // Active link style
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' // Inactive link style
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
                location.pathname != '/login' &&
                !location.pathname.startsWith('/register') ? (
                  <div className="hidden md:flex lg:flex space-x-3">
                    <NavLink tabIndex={-1} to={'/login'}>
                      <Button>Login</Button>
                    </NavLink>
                    <NavLink tabIndex={-1} to={'/register'}>
                      <Button>Sign Up</Button>
                    </NavLink>
                  </div>
                ) : !isAuthenticated &&
                  !location.pathname.startsWith('/register') ? (
                  <div className="w-45"></div>
                ) : !isAuthenticated ? (
                  <StepIndicator step={currentStep} totalSteps={4} />
                ) : null}
                {isAuthenticated && (
                  <div>
                    <div className="dropdown dropdown-end flex items-center">
                      <div
                        tabIndex={0}
                        role="button"
                        className="p-1 hover:bg-advanced rounded-full cursor-pointer"
                      >
                        <HeaderProfilePicture />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box bottom-[-98px] w-52 p-2 shadow-sm z-[1000]"
                      >
                        <li>
                          <a onClick={() => navigate('/profile')}>Profile</a>
                        </li>
                        <li>
                          <a onClick={() => navigate('/chat')}>Messages</a>
                        </li>
                        <li>
                          <a onClick={logout}>Logout</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="md:hidden lg:hidden">
                  <div className="drawer drawer-end">
                    <input
                      id="mobilenav"
                      type="checkbox"
                      className="drawer-toggle"
                    />
                    <div className="drawer-content">
                      {/* Page content here */}
                      <label htmlFor="mobilenav" className="drawer-button btn">
                        <Menu />
                      </label>
                    </div>
                    <div className="drawer-side">
                      <label
                        htmlFor="mobilenav"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                      ></label>
                      <ul className="menu bg-base-200 text-base-content min-h-full w-70 p-4 mr-4">
                        {/* Sidebar content here */}
                        <li>
                          <NavLink
                            to={'/'}
                            onClick={() =>
                              document.getElementById('mobilenav').click()
                            }
                            className="flex justify-center py-4 font-inter font-bold text-body-medium text-body-m"
                          >
                            <House />
                            Home
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to={'/events'}
                            onClick={() =>
                              document.getElementById('mobilenav').click()
                            }
                            className="flex justify-center py-4 font-inter font-bold text-body-medium text-body-m"
                          >
                            <CalendarDays />
                            Events
                          </NavLink>
                        </li>
                        {isAuthenticated && (
                          <li>
                            <NavLink
                              to={'/myRegistrations'}
                              onClick={() =>
                                document.getElementById('mobilenav').click()
                              }
                              className="flex justify-center py-4 font-inter font-bold text-body-medium text-body-m"
                            >
                              <NotepadText />
                              My Registrations
                            </NavLink>
                          </li>
                        )}
                        <li>
                          <NavLink
                            to={'/about'}
                            onClick={() =>
                              document.getElementById('mobilenav').click()
                            }
                            className="flex justify-center py-4 font-inter font-bold text-body-medium text-body-m"
                          >
                            <UsersRound />
                            About Us
                          </NavLink>
                        </li>
                        {!isAuthenticated && (
                          <div>
                            <li>
                              <NavLink
                                to={'/login'}
                                onClick={() =>
                                  document.getElementById('mobilenav').click()
                                }
                                className="flex justify-center py-4 font-inter font-bold text-body-medium text-body-m"
                              >
                                <LogIn />
                                Sign In
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={'/register'}
                                onClick={() =>
                                  document.getElementById('mobilenav').click()
                                }
                                className="flex justify-center py-4 font-inter font-bold text-body-medium text-body-m"
                              >
                                <UserPlus />
                                Sign Up
                              </NavLink>
                            </li>
                          </div>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
