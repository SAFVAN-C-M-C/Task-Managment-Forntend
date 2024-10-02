import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "@iconify/react";

const Header = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <nav className="bg-white border-gray-200 dark:bg-green-400">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <span className="self-center text-2xl font-semibold whitespace-nowrap ">
          Task Manager
        </span>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            onClick={handleLogout}
            className="text-white flex gap-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <span className="hidden md:flex">Logout</span> <Icon icon="material-symbols:logout" width="1.2rem" height="1.2rem" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
