import React from "react";
import Dialog from "./Dialog";

const Navbar = () => {
  return (
    <div className="flex  items-center navbar bg-base-100 shadow-sm">
      <div className="navbar-start ">
        <a className="btn flex-shrink-1 btn-ghost text-xl sm:text-1xl">
          Tuition DATA
        </a>
      </div>
      <label className="input border-2 border-gray-900">
        <svg
          className="h-[1em] opacity-50 "
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input type="search" required placeholder="Search" />
      </label>
      <div className="navbar-end">
        <a
          className="btn btn-neutral"
          onClick={() => document.getElementById("my_modal_5").showModal()}
        >
          Add+
        </a>
      </div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}

      <Dialog />
    </div>
  );
};

export default Navbar;
