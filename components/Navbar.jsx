"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/public/images/logo2.jpg";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const pathname = usePathname();
  const [timestamp, setTimestamp] = useState("");
  const [systemStatus, setSystemStatus] = useState({
    status: "online",
    color: "#22c55e",
    text: "System Online",
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const dateString = now.toLocaleDateString("en-GB");
      setTimestamp(`${dateString}, ${timeString}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const statusInterval = setInterval(() => {
      const random = Math.random();
      if (random > 0.95) {
        setSystemStatus({ status: "critical", color: "#ef4444", text: "System Critical" });
      } else if (random > 0.9) {
        setSystemStatus({ status: "warning", color: "#fbbf24", text: "System Warning" });
      } else {
        setSystemStatus({ status: "online", color: "#22c55e", text: "System Online" });
      }
    }, 10000);

    return () => clearInterval(statusInterval);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const menuItems = [
    { name: "Leak Detection", href: "/leak-detection" },
    { name: "Flow Measurement", href: "/flow" },
    { name: "Pressure & Temperature", href: "/pressure-temp-monitoring" },
    { name: "Queue", href: "/queue" },
    { name: "System Control", href: "/system-control" },
    { name: "Settings", href: "/settings" },
    { name: "System Design", href: "/system-design" },
  ];

  return (
    <div className="w-full fixed bg-[rgba(31,_33,_33,_1)] text-gray-100">
      <nav className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white p-4 md:p-6 flex flex-wrap justify-between items-center border-b-4 border-blue-400">
        <Link href={"/"}>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Image src={logo} alt="Logo" className="h-10 md:h-12 w-13" />
            <h2 className="text-xl md:text-2xl font-bold text-white mr-4 relative after:content-[''] after:right-[-1rem] after:top-1/2 after:transform after:-translate-y-1/2 after:w-1 after:h-8 after:bg-blue-400">
              H2 Refueling Station Control
            </h2>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
          <button className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap">
            EMERGENCY STOP
          </button>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: systemStatus.color }}
            ></div>
            <span className="text-cyan-400 bg-gray-700 border border-gray-700 rounded-full px-3 py-1 text-xs md:text-sm font-medium whitespace-nowrap">
              {systemStatus.text} | {timestamp}
            </span>
          </div>
          <button
            className="md:hidden ml-2 text-white text-2xl flex-shrink-0"
            onClick={toggleMenu}
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </nav>

      <div
        className={`bg-[rgba(38,_40,_40,_1)] p-2 border-b border-gray-700 md:flex md:flex-row md:space-x-1 md:items-center ${
          menuOpen ? "flex flex-col" : "hidden md:flex"
        }`}
      >
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`px-2 py-2 rounded-full transition-colors font-medium ${
                isActive ? "text-blue-500" : "text-white hover:bg-[#4b4b4b] hover:text-blue-400"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
