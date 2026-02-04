import React, { useContext, useState } from "react";
import { FaGlobe, FaBars, FaUserCircle, FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import { GiChefToque } from "react-icons/gi";
import { IoBalloonOutline } from "react-icons/io5";
import { AuthContext } from "../../Contexts/userContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Search state
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  const totalGuests = adults + children;

  const handleSearch = () => {
    let query = `?location=${location}&guests=${totalGuests}`;
    if (checkIn) query += `&checkIn=${checkIn}`;
    if (checkOut) query += `&checkOut=${checkOut}`;

    navigate(`/${query}`);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await fetch("/api/v1/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Left: Logo */}
        <div
          onClick={() => (window.location.href = "/")}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <img src="/icon.jpg" alt="" className="size-10" />
          <span className="hidden sm:block font-bold text-xl text-red-500">
            airbnb
          </span>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <button className="flex items-center space-x-2 pb-4 border-b-2 border-gray-900">
            <span className="text-2xl">🏠</span>
            <span className="text-sm font-medium">Homes</span>
          </button>
          <button className="flex items-center space-x-2 pb-4 text-gray-600 hover:text-gray-900 transition">
            <IoBalloonOutline className="text-2xl" />
            <span className="text-sm font-medium">Experiences</span>
            <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded font-semibold">
              NEW
            </span>
          </button>
          <button className="flex items-center space-x-2 pb-4 text-gray-600 hover:text-gray-900 transition">
            <GiChefToque className="text-2xl" />
            <span className="text-sm font-medium">Services</span>
            <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded font-semibold">
              NEW
            </span>
          </button>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3 relative">
          {/* Become a host button (hidden if user exists) */}



          <button className="p-3 rounded-full hover:bg-gray-100 transition">
            <FaGlobe className="text-gray-700 text-base" />
          </button>

          <div className="relative">
            <button
              className="flex items-center space-x-2 border border-gray-300 py-1 pl-3 pr-1 rounded-full hover:shadow-md transition duration-200 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaBars className="text-gray-600 text-sm" />
              <div className="ml-2">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="bg-gray-500 text-white rounded-full p-1">
                    <FaUserCircle className="text-2xl" />
                  </div>
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-2 z-50 overflow-hidden font-sans">
                {/* Show user info if logged in */}
                {user ? (
                  <>
                    <div className="px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-default">
                      <div className="flex items-center space-x-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                        ) : (
                          <div className="bg-gray-800 text-white p-2 rounded-full">
                            <FaUserCircle className="text-xl" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-800">{user.name}</span>
                          <span className="text-xs text-gray-500 font-medium">View your profile</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-2"></div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => (window.location.href = "/signup")}
                      className="block w-full text-left px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
                    >
                      Sign up
                    </button>
                    <button
                      onClick={() => (window.location.href = "/login")}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition"
                    >
                      Log in
                    </button>
                    <hr className="my-2 border-gray-200" />
                  </>
                )}

                {/* Common Menu Items */}
                <button className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                  Airbnb your home
                </button>
                <button className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                  Host an experience
                </button>
                <button className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                  Help Center
                </button>

                {/* Logout */}
                {user && (
                  <>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition hover:text-black"
                    >
                      Log out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-md hover:shadow-xl transition-all duration-300 h-16 overflow-hidden">

            {/* Where */}
            <div className="flex-[1.5] flex items-center px-6 py-2 hover:bg-gray-50 transition cursor-pointer h-full group">
              <FaMapMarkerAlt className="text-rose-500 mr-3 text-lg group-hover:scale-110 transition-transform" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-800">Location</div>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs font-medium outline-none placeholder-gray-400 bg-transparent truncate"
                />
              </div>
            </div>

            <div className="w-[1px] h-8 bg-gray-200"></div>

            {/* Check-in */}
            <div className="flex-1 flex items-center px-5 py-2 hover:bg-gray-50 transition cursor-pointer h-full group">
              <FaCalendarAlt className="text-rose-500 mr-3 text-lg group-hover:scale-110 transition-transform" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-800">Check-in</div>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-xs font-medium outline-none bg-transparent cursor-pointer"
                />
              </div>
            </div>

            <div className="w-[1px] h-8 bg-gray-200"></div>

            {/* Check-out */}
            <div className="flex-1 flex items-center px-5 py-2 hover:bg-gray-50 transition cursor-pointer h-full group">
              <FaCalendarAlt className="text-rose-500 mr-3 text-lg group-hover:scale-110 transition-transform" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-800">Check-out</div>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-xs font-medium outline-none bg-transparent cursor-pointer"
                />
              </div>
            </div>

            <div className="w-[1px] h-8 bg-gray-200"></div>

            {/* Who */}
            <div className="flex-1 flex items-center px-5 py-2 hover:bg-gray-50 transition cursor-pointer h-full group">
              <FaUserFriends className="text-rose-500 mr-3 text-lg group-hover:scale-110 transition-transform" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-800">Guests</div>
                <input
                  type="number"
                  min="1"
                  placeholder="Add guests"
                  value={adults > 0 ? adults : ""}
                  onChange={(e) => setAdults(parseInt(e.target.value) || 0)}
                  className="w-full text-xs font-medium outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="pr-2">
              <button
                onClick={handleSearch}
                className="bg-rose-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-rose-600 transition-all shadow-md active:scale-90 group"
                title="Search"
              >
                <FaSearch className="text-lg group-hover:rotate-12 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
