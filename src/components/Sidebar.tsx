'use client';

import React, { useEffect, useRef, useState, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../images/Group.svg';
import SidebarLinkGroup from './SidebarLinkGroup';
import { AuthContext } from '../context/AuthContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  const [isCollapsed, setIsCollapsed] = useState(false);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      ref={sidebar}
      className={`z-9999 fixed top-0 left-0 flex flex-col h-screen  bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isCollapsed ? 'w-24' : 'w-80'}`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div
        className={`flex items-center justify-between gap-2 pt-8 pb-7 bg-[#C32033] h-[80px] relative ${
          isCollapsed ? 'px-2 justify-center' : ''
        }`}
      >
        <NavLink
          to="/"
          className={isCollapsed ? 'flex justify-center w-full' : ''}
        >
          <img
            src={Logo || '/placeholder.svg'}
            alt="Logo"
            style={{
              height: isCollapsed ? '40px' : '40px',
              marginLeft: isCollapsed ? '0' : 'auto',
              transition: 'all 0.3s ease',
            }}
          />
        </NavLink>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className={`${isCollapsed ? 'py-4 px-0' : 'py-4 lg:px-1'}`}>
          {/* <!-- Menu Group --> */}
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <li className="mb-4 relative">
                <NavLink
                  to="/"
                  className={
                    isCollapsed ? 'flex justify-center w-full py-2 ' : ''
                  }
                >
                  <img
                    src={Logo || '/placeholder.svg'}
                    alt="Logo"
                    style={{
                      height: isCollapsed ? '40px' : '50px',
                      marginLeft: isCollapsed ? '0' : '20px',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </NavLink>

                <button
                  onClick={toggleSidebar}
                  className="absolute right-[-15px] top-1/2 transform -translate-y-1/2 w-8 h-8 shadow-2xl bg-[#fff] border-2 border-[#C32033] rounded-full flex items-center justify-center transition-colors duration-200 z-50"
                >
                  {isCollapsed ? (
                    // 👉 Right Arrow (expand)
                    <svg
                      className="w-4 h-4 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  ) : (
                    // 👈 Left Arrow (collapse)
                    <svg
                      className="w-4 h-4 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  )}
                </button>
              </li>
              <li className="mb-1">
                <NavLink
                  to="/"
                  className={`group relative flex items-center ${
                    isCollapsed ? 'justify-center px-2' : 'gap-6 px-4'
                  } rounded-sm py-2 font-medium text-black text-lg duration-300 ease-in-out hover:bg-[#FFD7D7] ${
                    pathname === '/'
                      ? 'bg-[rgb(255,215,215)] border-l-6 border-[#C32033] text-black'
                      : ''
                  }`}
                >
                  <div
                    className={`w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0
                      ${pathname === '/' ? 'bg-white' : 'bg-[#C32033]'}`}
                  >
                    <svg
                      className={`fill-current ${
                        pathname === '/' ? 'text-[#C32033]' : 'text-white'
                      }`}
                      width="20"
                      height="20"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                        fill=""
                      />
                      <path
                        d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                        fill=""
                      />
                      <path
                        d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                        fill=""
                      />
                      <path
                        d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                        fill=""
                      />
                    </svg>
                  </div>
                  {!isCollapsed && 'Dashboard'}
                </NavLink>
              </li>
              {/* <!-- Menu Item Users --> */}
              {user?.role === 'admin' && (
                <li className="mb-1">
                  <NavLink
                    to="/users"
                    className={`group relative flex items-center ${
                      isCollapsed ? 'justify-center px-2' : 'gap-6 px-4'
                    } rounded-sm py-2 font-medium text-black text-lg duration-300 ease-in-out hover:bg-[#FFD7D7] ${
                      pathname.includes('users') && 'bg-[#FFD7D7] text-black'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 ${
                        pathname.includes('users') ? 'bg-white' : 'bg-[#C32033]'
                      }`}
                    >
                      <svg
                        className={`fill-current ${
                          pathname.includes('users')
                            ? 'text-[#C32033]'
                            : 'text-white'
                        }`}
                        width="20"
                        height="16"
                        viewBox="0 0 22 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                          fill=""
                        />
                        <path
                          d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                          fill=""
                        />
                        <path
                          d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                          fill=""
                        />
                      </svg>
                    </div>
                    {!isCollapsed && 'Registered Users'}
                  </NavLink>
                </li>
              )}
              {user?.role === 'admin' && (
                <li className="mb-1">
                  <NavLink
                    to="/deactivate"
                    className={`group relative flex items-center ${
                      isCollapsed ? 'justify-center px-2' : 'gap-6 px-4'
                    } rounded-sm py-2 font-medium text-black text-lg duration-300 ease-in-out hover:bg-[#FFD7D7] ${
                      pathname.includes('deactivate') &&
                      'bg-[#FFD7D7] text-black'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 ${
                        pathname.includes('deactivate')
                          ? 'bg-white'
                          : 'bg-[#C32033]'
                      }`}
                    >
                      <svg
                        className={`fill-current ${
                          pathname.includes('deactivate')
                            ? 'text-[#C32033]'
                            : 'text-white'
                        }`}
                        width="20"
                        height="16"
                        viewBox="0 0 22 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                          fill=""
                        />
                        <path
                          d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                          fill=""
                        />
                        <path
                          d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                          fill=""
                        />
                      </svg>
                    </div>
                    {!isCollapsed && 'Deactivate Users'}
                  </NavLink>
                </li>
              )}
              {/* <!-- Menu Item Users --> */}
              {/* <!-- Menu Item Profile --> */}
              {user?.role === 'admin' && (
                <li className="mb-1">
                  <NavLink
                    to="/import"
                    className={`group relative flex items-center ${
                      isCollapsed ? 'justify-center px-2' : 'gap-6 px-4'
                    } rounded-sm py-2 font-medium text-black text-lg duration-300 ease-in-out hover:bg-[#FFD7D7] ${
                      pathname.includes('import') && 'bg-[#FFD7D7] text-black'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 ${
                        pathname.includes('import')
                          ? 'bg-white'
                          : 'bg-[#C32033]'
                      }`}
                    >
                      <svg
                        className={`fill-current ${
                          pathname.includes('import')
                            ? 'text-[#C32033]'
                            : 'text-white'
                        }`}
                        width="20"
                        height="16"
                        viewBox="0 0 22 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                          fill=""
                        />
                        <path
                          d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                          fill=""
                        />
                        <path
                          d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                          fill=""
                        />
                      </svg>
                    </div>
                    {!isCollapsed && 'Import Users'}
                  </NavLink>
                </li>
              )}
              {user?.role === 'admin' && (
                <li className="mb-1">
                  <NavLink
                    to="/sales"
                    className={`group relative flex items-center ${
                      isCollapsed ? 'justify-center px-2' : 'gap-6 px-4'
                    } rounded-sm py-2 font-medium text-black text-lg duration-300 ease-in-out hover:bg-[#FFD7D7] ${
                      pathname.includes('sales') && 'bg-[#FFD7D7] text-black'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 ${
                        pathname.includes('sales') ? 'bg-white' : 'bg-[#C32033]'
                      }`}
                    >
                      <svg
                        className={`fill-current ${
                          pathname.includes('sales')
                            ? 'text-[#C32033]'
                            : 'text-white'
                        }`}
                        width="20"
                        height="16"
                        viewBox="0 0 22 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                          fill=""
                        />
                        <path
                          d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                          fill=""
                        />
                        <path
                          d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                          fill=""
                        />
                      </svg>
                    </div>
                    {!isCollapsed && 'Sales Persons'}
                  </NavLink>
                </li>
              )}
              {user?.role === 'admin' && (
                <li className="mb-1">
                  <NavLink
                    to="/customers"
                    className={`group relative flex items-center ${
                      isCollapsed ? 'justify-center px-2' : 'gap-6 px-4'
                    } rounded-sm py-2 font-medium text-black text-lg duration-300 ease-in-out hover:bg-[#FFD7D7] ${
                      pathname.includes('customers') &&
                      'bg-[#FFD7D7] text-black'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 ${
                        pathname.includes('customers')
                          ? 'bg-white'
                          : 'bg-[#C32033]'
                      }`}
                    >
                      <svg
                        className={`fill-current ${
                          pathname.includes('customers')
                            ? 'text-[#C32033]'
                            : 'text-white'
                        }`}
                        width="20"
                        height="16"
                        viewBox="0 0 22 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                          fill=""
                        />
                        <path
                          d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                          fill=""
                        />
                        <path
                          d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                          fill=""
                        />
                      </svg>
                    </div>
                    {!isCollapsed && 'Customers'}
                  </NavLink>
                </li>
              )}
              {/* <!-- Menu Item Users --> */}
              {/* <!-- Menu Item Leads --> */}
              {user?.role === 'salesPerson' && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/leads' || pathname.includes('leads')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center ${
                            isCollapsed ? 'justify-center px-2' : 'gap-6 px-4'
                          } rounded-sm py-2 mb-1 font-medium text-black text-lg duration-300 ease-in-out hover:bg-[#FFD7D7] ${
                            (pathname === '/leads' ||
                              pathname.includes('leads')) &&
                            'bg-[#FFD7D7] text-black'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <div
                            className={`w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 ${
                              open ? 'bg-white' : 'bg-[#C32033]'
                            }`}
                          >
                            <svg
                              className={`fill-current ${
                                open ? 'text-[#C32033]' : 'text-white'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.43425 7.5093H2.278C2.44675 7.5093 2.55925 7.3968 2.58737 7.31243L2.98112 6.32805H5.90612L6.27175 7.31243C6.328 7.48118 6.46862 7.5093 6.58112 7.5093H7.453C7.76237 7.48118 7.87487 7.25618 7.76237 7.03118L5.428 1.4343C5.37175 1.26555 5.3155 1.23743 5.14675 1.23743H3.88112C3.76862 1.23743 3.59987 1.29368 3.57175 1.4343L1.153 7.08743C1.0405 7.2843 1.20925 7.5093 1.43425 7.5093ZM4.47175 2.98118L5.3155 5.17493H3.59987L4.47175 2.98118Z"
                                fill=""
                              />
                              <path
                                d="M10.1249 2.5031H16.8749C17.2124 2.5031 17.5218 2.22185 17.5218 1.85623C17.5218 1.4906 17.2405 1.20935 16.8749 1.20935H10.1249C9.7874 1.20935 9.47803 1.4906 9.47803 1.85623C9.47803 2.22185 9.75928 2.5031 10.1249 2.5031Z"
                                fill=""
                              />
                              <path
                                d="M16.8749 6.21558H10.1249C9.7874 6.21558 9.47803 6.49683 9.47803 6.86245C9.47803 7.22808 9.75928 7.50933 10.1249 7.50933H16.8749C17.2124 7.50933 17.5218 7.22808 17.5218 6.86245C17.5218 6.49683 17.2124 6.21558 16.8749 6.21558Z"
                                fill=""
                              />
                              <path
                                d="M16.875 11.1656H1.77187C1.43438 11.1656 1.125 11.4469 1.125 11.8125C1.125 12.1781 1.40625 12.4594 1.77187 12.4594H16.875C17.2125 12.4594 17.5219 12.1781 17.5219 11.8125C17.5219 11.4469 17.2125 11.1656 16.875 11.1656Z"
                                fill=""
                              />
                              <path
                                d="M16.875 16.1156H1.77187C1.43438 16.1156 1.125 16.3969 1.125 16.7625C1.125 17.1281 1.40625 17.4094 1.77187 17.4094H16.875C17.2125 17.4094 17.5219 17.1281 17.5219 16.7625C17.5219 16.3969 17.2125 16.1156 16.875 16.1156Z"
                                fill=""
                              />
                            </svg>
                          </div>
                          {!isCollapsed && 'Leads'}
                          {!isCollapsed && (
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                open && 'rotate-180'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              font-medium
                              text-lg
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          )}
                        </NavLink>
                        {!isCollapsed && (
                          <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                              open
                                ? 'max-h-96 opacity-100'
                                : 'max-h-0 opacity-0'
                            }`}
                          >
                            <ul className="mt-4 mb-5.5 flex flex-col gap-4 pl-6">
                              <li>
                                <NavLink
                                  to="/leads/create"
                                  className={`flex items-center px-4 py-2 font-medium text-lg rounded-lg transition-colors
      ${
        pathname === '/leads/create' || pathname.includes('/leads/create')
          ? 'text-[#C32033]'
          : 'text-black'
      }
    `}
                                >
                                  Create
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/leads/manage"
                                  className={({ isActive }) =>
                                    `group relative flex items-center gap-6 rounded-md px-4 py-2 font-medium text-lg duration-300 ease-in-out
     ${
       isActive ||
       pathname === '/leads/manage' ||
       pathname.includes('/leads/manage')
         ? 'text-[#C32033]'
         : 'text-black '
     }`
                                  }
                                >
                                  Manage Leads
                                </NavLink>
                              </li>
                              {/* <li>
                                <NavLink
                                  to="/leads/follow-up"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-6 rounded-md px-4 font-medium text-black text-lg duration-300 ease-in-out hover:text-black ' +
                                    (isActive && 'text-[#C32033]')
                                  }
                                >
                                  Follow-Up Entries
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/leads/closure"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-6 rounded-md px-4 font-medium text-black text-lg duration-300 ease-in-out hover:text-black ' +
                                    (isActive && 'text-[#C32033]')
                                  }
                                >
                                  Closure Entries
                                </NavLink>
                              </li> */}
                            </ul>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* <!-- Menu Item Leads --> */}
              {/* <!-- Menu Item Opportunities --> */}
              {user?.role === 'salesPerson' && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/opportunities' ||
                    pathname.includes('opportunities')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center ${
                            isCollapsed ? 'justify-center px-2' : 'gap-6 px-4'
                          } rounded-sm py-2 mb-1 font-medium text-black text-lg duration-300 ease-in-out hover:bg-[#FFD7D7] ${
                            (pathname === '/opportunities' ||
                              pathname.includes('opportunities')) &&
                            'bg-[#FFD7D7] text-black'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <div
                            className={`w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 ${
                              open ? 'bg-white' : 'bg-[#C32033]'
                            }`}
                          >
                            <svg
                              className={`fill-current ${
                                open ? 'text-[#C32033]' : 'text-white'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.43425 7.5093H2.278C2.44675 7.5093 2.55925 7.3968 2.58737 7.31243L2.98112 6.32805H5.90612L6.27175 7.31243C6.328 7.48118 6.46862 7.5093 6.58112 7.5093H7.453C7.76237 7.48118 7.87487 7.25618 7.76237 7.03118L5.428 1.4343C5.37175 1.26555 5.3155 1.23743 5.14675 1.23743H3.88112C3.76862 1.23743 3.59987 1.29368 3.57175 1.4343L1.153 7.08743C1.0405 7.2843 1.20925 7.5093 1.43425 7.5093ZM4.47175 2.98118L5.3155 5.17493H3.59987L4.47175 2.98118Z"
                                fill=""
                              />
                              sales
                              <path
                                d="M10.1249 2.5031H16.8749C17.2124 2.5031 17.5218 2.22185 17.5218 1.85623C17.5218 1.4906 17.2405 1.20935 16.8749 1.20935H10.1249C9.7874 1.20935 9.47803 1.4906 9.47803 1.85623C9.47803 2.22185 9.75928 2.5031 10.1249 2.5031Z"
                                fill=""
                              />
                              <path
                                d="M16.8749 6.21558H10.1249C9.7874 6.21558 9.47803 6.49683 9.47803 6.86245C9.47803 7.22808 9.75928 7.50933 10.1249 7.50933H16.8749C17.2124 7.50933 17.5218 7.22808 17.5218 6.86245C17.5218 6.49683 17.2124 6.21558 16.8749 6.21558Z"
                                fill=""
                              />
                              <path
                                d="M16.875 11.1656H1.77187C1.43438 11.1656 1.125 11.4469 1.125 11.8125C1.125 12.1781 1.40625 12.4594 1.77187 12.4594H16.875C17.2125 12.4594 17.5219 12.1781 17.5219 11.8125C17.5219 11.4469 17.2125 11.1656 16.875 11.1656Z"
                                fill=""
                              />
                              <path
                                d="M16.875 16.1156H1.77187C1.43438 16.1156 1.125 16.3969 1.125 16.7625C1.125 17.1281 1.40625 17.4094 1.77187 17.4094H16.875C17.2125 17.4094 17.5219 17.1281 17.5219 16.7625C17.5219 16.3969 17.2125 16.1156 16.875 16.1156Z"
                                fill=""
                              />
                            </svg>
                          </div>
                          {!isCollapsed && 'Opportunities'}
                          {!isCollapsed && (
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                open && 'rotate-180'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          )}
                        </NavLink>
                        {!isCollapsed && (
                          <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                              open
                                ? 'max-h-96 opacity-100'
                                : 'max-h-0 opacity-0'
                            }`}
                          >
                            <ul className="mt-4 mb-5.5 flex flex-col gap-4 pl-6">
                              <li>
                                <NavLink
                                  to="/opportunities/create"
                                  className={`flex items-center px-4 py-2 font-medium text-lg rounded-lg transition-colors
      ${
        pathname === '/opportunities/create' ||
        pathname.includes('/opportunities/create')
          ? 'text-[#C32033]'
          : 'text-black'
      }
    `}
                                >
                                  Create
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/opportunities/manage"
                                  className={`flex items-center px-4 py-2 font-medium text-lg rounded-lg transition-colors
      ${
        pathname === '/opportunities/manage' ||
        pathname.includes('/opportunities/manage')
          ? 'text-[#C32033]'
          : 'text-black'
      }
    `}
                                >
                                  Manage Opportunities
                                </NavLink>
                              </li>
                              {/* <li>
                                <NavLink
                                  to="/opportunities/follow-up"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-6 rounded-md px-4 font-medium text-black text-lg duration-300 ease-in-out hover:text-black ' +
                                    (isActive && 'text-[#C32033]')
                                  }
                                >
                                  Follow-Up Entries
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/opportunities/closure"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-6 rounded-md px-4 font-medium text-black text-lg duration-300 ease-in-out hover:text-black ' +
                                    (isActive && 'text-[#C32033]')
                                  }
                                >
                                  Closure Entries
                                </NavLink>
                              </li> */}
                            </ul>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}

              {/* <!-- Menu Item Opportunities --> */}
              {/* <!-- Menu Item Sales Orders --> */}
              {user?.role === 'salesPerson' && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/forms' || pathname.includes('forms')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center ${
                            isCollapsed ? 'justify-center px-2' : 'gap-6 px-4'
                          } rounded-sm py-2 mb-1 font-medium text-black text-lg duration-300 ease-in-out hover:bg-[#FFD7D7] ${
                            (pathname === '/forms' ||
                              pathname.includes('forms')) &&
                            'bg-[#FFD7D7] text-black'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <div
                            className={`w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 ${
                              open ? 'bg-white' : 'bg-[#C32033]'
                            }`}
                          >
                            <svg
                              className={`fill-current ${
                                open ? 'text-[#C32033]' : 'text-white'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.43425 7.5093H2.278C2.44675 7.5093 2.55925 7.3968 2.58737 7.31243L2.98112 6.32805H5.90612L6.27175 7.31243C6.328 7.48118 6.46862 7.5093 6.58112 7.5093H7.453C7.76237 7.48118 7.87487 7.25618 7.76237 7.03118L5.428 1.4343C5.37175 1.26555 5.3155 1.23743 5.14675 1.23743H3.88112C3.76862 1.23743 3.59987 1.29368 3.57175 1.4343L1.153 7.08743C1.0405 7.2843 1.20925 7.5093 1.43425 7.5093ZM4.47175 2.98118L5.3155 5.17493H3.59987L4.47175 2.98118Z"
                                fill=""
                              />
                              <path
                                d="M10.1249 2.5031H16.8749C17.2124 2.5031 17.5218 2.22185 17.5218 1.85623C17.5218 1.4906 17.2405 1.20935 16.8749 1.20935H10.1249C9.7874 1.20935 9.47803 1.4906 9.47803 1.85623C9.47803 2.22185 9.75928 2.5031 10.1249 2.5031Z"
                                fill=""
                              />
                              <path
                                d="M16.8749 6.21558H10.1249C9.7874 6.21558 9.47803 6.49683 9.47803 6.86245C9.47803 7.22808 9.75928 7.50933 10.1249 7.50933H16.8749C17.2124 7.50933 17.5218 7.22808 17.5218 6.86245C17.5218 6.49683 17.2124 6.21558 16.8749 6.21558Z"
                                fill=""
                              />
                              <path
                                d="M16.875 11.1656H1.77187C1.43438 11.1656 1.125 11.4469 1.125 11.8125C1.125 12.1781 1.40625 12.4594 1.77187 12.4594H16.875C17.2125 12.4594 17.5219 12.1781 17.5219 11.8125C17.5219 11.4469 17.2125 11.1656 16.875 11.1656Z"
                                fill=""
                              />
                              <path
                                d="M16.875 16.1156H1.77187C1.43438 16.1156 1.125 16.3969 1.125 16.7625C1.125 17.1281 1.40625 17.4094 1.77187 17.4094H16.875C17.2125 17.4094 17.5219 17.1281 17.5219 16.7625C17.5219 16.3969 17.2125 16.1156 16.875 16.1156Z"
                                fill=""
                              />
                            </svg>
                          </div>
                          {!isCollapsed && 'Sales Orders'}
                          {!isCollapsed && (
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                open && 'rotate-180'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          )}
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        {!isCollapsed && (
                          <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                              open
                                ? 'max-h-96 opacity-100'
                                : 'max-h-0 opacity-0'
                            }`}
                          >
                            <ul className="mt-4 mb-5.5 flex flex-col gap-4 pl-6">
                              <li>
                                <NavLink
                                  to="/sales-orders/history"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-6 rounded-md px-4 font-medium text-black text-lg duration-300 ease-in-out hover:text-black ' +
                                    (isActive && 'text-[#C32033]')
                                  }
                                >
                                  Track Delivery Status
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/sales-orders/open"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-6 rounded-md px-4 font-medium text-black text-lg duration-300 ease-in-out hover:text-black ' +
                                    (isActive && 'text-[#C32033]')
                                  }
                                >
                                  Closed Orders
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/sales-orders/uninvoiced"
                                  className={`flex items-center px-4 py-2 font-medium text-lg  rounded-lg transition-colors
      ${
        pathname === '/sales-orders/uninvoiced' ||
        pathname.includes('/sales-orders/uninvoiced')
          ? 'text-[#C32033]'
          : 'text-black'
      }
    `}
                                >
                                  Uninvoiced Orders
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        )}
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* <!-- Menu Item SalesclassName={`flex items-center px-4 py-2 rounded-lg transition-colors
      ${
        pathname === '/sales-orders/uninvoiced' ||
        pathname.includes('/sales-orders/uninvoiced')
          ? 'text-[#C32033]'
          : 'text-black'
      }
    `} Orders --> */}
              {/* <!-- Menu Item Sales Requests --> */}
              {user?.role === 'salesPerson' && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/sales-request' ||
                    pathname.includes('sales-request')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center ${
                            isCollapsed
                              ? 'justify-center px-2 py-2'
                              : 'gap-6 px-4 py-2'
                          } rounded-sm py-2 mb-1 font-medium text-black text-lg whitespace-nowrap duration-600 ease-in-out hover:bg-[#FFD7D7] ${
                            pathname === '/sales-request' ||
                            pathname.includes('sales-request')
                              ? 'bg-[#FFD7D7]'
                              : 'bg-transparent'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <div
                            className={`w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 ${
                              open ? 'bg-white' : 'bg-[#C32033]'
                            }`}
                          >
                            <svg
                              className={`fill-current ${
                                open ? 'text-[#C32033]px-4 py-2' : 'text-white'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.43425 7.5093H2.278C2.44675 7.5093 2.55925 7.3968 2.58737 7.31243L2.98112 6.32805H5.90612L6.27175 7.31243C6.328 7.48118 6.46862 7.5093 6.58112 7.5093H7.453C7.76237 7.48118 7.87487 7.25618 7.76237 7.03118L5.428 1.4343C5.37175 1.26555 5.3155 1.23743 5.14675 1.23743H3.88112C3.76862 1.23743 3.59987 1.29368 3.57175 1.4343L1.153 7.08743C1.0405 7.2843 1.20925 7.5093 1.43425 7.5093ZM4.47175 2.98118L5.3155 5.17493H3.59987L4.47175 2.98118Z"
                                fill=""
                              />
                              <path
                                d="M10.1249 2.5031H16.8749C17.2124 2.5031 17.5218 2.22185 17.5218 1.85623C17.5218 1.4906 17.2405 1.20935 16.8749 1.20935H10.1249C9.7874 1.20935 9.47803 1.4906 9.47803 1.85623C9.47803 2.22185 9.75928 2.5031 10.1249 2.5031Z"
                                fill=""
                              />
                              <path
                                d="M16.8749 6.21558H10.1249C9.7874 6.21558 9.47803 6.49683 9.47803 6.86245C9.47803 7.22808 9.75928 7.50933 10.1249 7.50933H16.8749C17.2124 7.50933 17.5218 7.22808 17.5218 6.86245C17.5218 6.49683 17.2124 6.21558 16.8749 6.21558Z"
                                fill=""
                              />
                              <path
                                d="M16.875 11.1656H1.77187C1.43438 11.1656 1.125 11.4469 1.125 11.8125C1.125 12.1781 1.40625 12.4594 1.77187 12.4594H16.875C17.2125 12.4594 17.5219 12.1781 17.5219 11.8125C17.5219 11.4469 17.2125 11.1656 16.875 11.1656Z"
                                fill=""
                              />
                              <path
                                d="M16.875 16.1156H1.77187C1.43438 16.1156 1.125 16.3969 1.125 16.7625C1.125 17.1281 1.40625 17.4094 1.77187 17.4094H16.875C17.2125 17.4094 17.5219 17.1281 17.5219 16.7625C17.5219 16.3969 17.2125 16.1156 16.875 16.1156Z"
                                fill=""
                              />
                            </svg>
                          </div>
                          {!isCollapsed && 'Sales Requests'}
                          {!isCollapsed && (
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                open && 'rotate-180'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          )}
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        {!isCollapsed && (
                          <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                              open
                                ? 'max-h-96 opacity-100'
                                : 'max-h-0 opacity-0'
                            }`}
                          >
                            <ul className="mt-4 mb-5.5 flex flex-col gap-4 pl-6">
                              <li>
                                <NavLink
                                  to="/sales-request/create"
                                  className={`flex items-center px-4 py-2 font-medium text-lg rounded-lg transition-colors
      ${
        pathname === '/sales-request/create' ||
        pathname.includes('/sales-request/create')
          ? 'text-[#C32033]'
          : 'text-black'
      }
    `}
                                >
                                  Create
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/sales-request/manage"
                                  className={`flex items-center px-4 py-2 font-medium text-lg rounded-lg transition-colors
      ${
        pathname === '/sales-request/manage' ||
        pathname.includes('/sales-request/manage')
          ? 'text-[#C32033]'
          : 'text-black'
      }
    `}
                                >
                                  Manage Requests
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/sales-request/draft"
                                  className={`flex items-center px-4 py-2 font-medium text-lg rounded-lg transition-colors
      ${
        pathname === '/sales-request/draft' ||
        pathname.includes('/sales-request/draft')
          ? 'text-[#C32033]'
          : 'text-black'
      }
    `}
                                >
                                  Manage Drafts
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        )}
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* <!-- Menu Item Sales Requests --> */}
              {/* <!-- Menu Item Reports --> */}
              {/* {user?.role === 'salesPerson' && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/forms' || pathname.includes('forms')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center ${
                            isCollapsed ? 'justify-center px-2' : 'gap-6 px-4'
                          } rounded-sm py-2 mb-1 font-medium text-black text-lg duration-300 ease-in-out hover:bg-[#FFD7D7] ${
                            (pathname === '/forms' ||
                              pathname.includes('forms')) &&
                            'bg-[#FFD7D7] text-black'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <div
                            className={`w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 ${
                              open ? 'bg-white' /sales-request/manage: 'bg-[#C32033]'
                            }`}
                          >
                            <svg
                              className={`fill-current ${
                                open ? 'text-[#C32033]' : 'text-white'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.43425 7.5093H2.278C2.44675 7.5093 2.55925 7.3968 2.58737 7.31243L2.98112 6.32805H5.90612L6.27175 7.31243C6.328 7.48118 6.46862 7.5093 6.58112 7.5093H7.453C7.76237 7.48118 7.87487 7.25618 7.76237 7.03118L5.428 1.4343C5.37175 1.26555 5.3155 1.23743 5.14675 1.23743H3.88112C3.76862 1.23743 3.59987 1.29368 3.57175 1.4343L1.153 7.08743C1.0405 7.2843 1.20925 7.5093 1.43425 7.5093ZM4.47175 2.98118L5.3155 5.17493H3.59987L4.47175 2.98118Z"
                                fill=""
                              />
                              <path
                                d="M10.1249 2.5031H16.8749C17.2124 2.5031 17.5218 2.22185 17.5218 1.85623C17.5218 1.4906 17.2405 1.20935 16.8749 1.20935H10.1249C9.7874 1.20935 9.47803 1.4906 9.47803 1.85623C9.47803 2.22185 9.75928 2.5031 10.1249 2.5031Z"
                                fill=""
                              />
                              <path
                                d="M16.8749 6.21558H10.1249C9.7874 6.21558 9.47803 6.49683 9.47803 6.86245C9.47803 7.22808 9.75928 7.50933 10.1249 7.50933H16.8749C17.2124 7.50933 17.5218 7.22808 17.5218 6.86245C17.5218 6.49683 17.2124 6.21558 16.8749 6.21558Z"
                                fill=""
                              />
                              <path
                                d="M16.875 11.1656H1.77187C1.43438 11.1656 1.125 11.4469 1.125 11.8125C1.125 12.1781 1.40625 12.4594 1.77187 12.4594H16.875C17.2125 12.4594 17.5219 12.1781 17.5219 11.8125C17.5219 11.4469 17.2125 11.1656 16.875 11.1656Z"
                                fill=""
                              />
                              <path
                                d="M16.875 16.1156H1.77187C1.43438 16.1156 1.125 16.3969 1.125 16.7625C1.125 17.1281 1.40625 17.4094 1.77187 17.4094H16.875C17.2125 17.4094 17.5219 17.1281 17.5219 16.7625C17.5219 16.3969 17.2125 16.1156 16.875 16.1156Z"
                                fill=""
                              />
                            </svg>
                          </div>
                          {!isCollapsed && 'Reports'}
                          {!isCollapsed && (
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                open && 'rotate-180'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          )}
                        </NavLink>
                        {!isCollapsed && (
                          <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                              open
                                ? 'max-h-96 opacity-100'
                                : 'max-h-0 opacity-0'
                            }`}
                          >
                            <ul className="mt-4 mb-5.5 flex flex-col gap-4 pl-6">
                              <li>
                                <NavLink
                                  to="/forms/form-elements"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-6 rounded-md px-4 font-medium text-black text-lg duration-300 ease-in-out hover:text-black ' +
                                    (isActive && 'text-[#C32033]')
                                  }
                                >
                                  Create
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/forms/form-layout"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-6 rounded-md px-4 font-medium text-black text-lg duration-300 ease-in-out hover:text-black ' +
                                    (isActive && 'text-[#C32033]')
                                  }
                                >
                                  Manage Orders
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/forms/form-layout"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-6 rounded-md px-4 font-medium text-black text-lg duration-300 ease-in-out hover:text-black ' +
                                    (isActive && 'text-[#C32033]')
                                  }
                                >
                                  Follow-Up Entries
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/forms/form-layout"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-6 rounded-md px-4 font-medium text-black text-lg duration-300 ease-in-out hover:text-black ' +
                                    (isActive && 'text-[#C32033]')
                                  }
                                >
                                  Closure Entries
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )} */}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
