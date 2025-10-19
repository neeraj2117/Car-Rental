import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const {
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    navigate,
    cars,
  } = useAppContext();

  useEffect(() => {
    if (cars && cars.length > 0) {
      const unique = [...new Set(cars.map((car) => car.location))];
      setLocations(unique);
    }
  }, [cars]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!pickupLocation || !pickupDate || !returnDate) {
      toast.error("Please fill all fields before searching");
      return;
    }

    navigate(
      `/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`
    );
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-14 bg-light text-center">
      <h1 className="font-semibold text-4xl md:text-5xl">
        Luxury Cars on Rent
      </h1>

      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 rounded-lg 
  md:rounded-full w-full max-w-80 md:max-w-220 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:ml-8">
          {/* Pickup Location */}
          <div className="relative w-40 md:w-48">
            <label
              htmlFor="pickup-location"
              className="block text-sm text-gray-500 mb-1 ml-2 text-left"
            >
              Pickup Location
            </label>
            <select
              id="pickup-location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
              className="w-full appearance-none px-4 py-3 pr-8 text-sm text-gray-700 bg-white border border-gray-200 rounded-full outline-none"
            >
              <option value="">Please select location</option>
              {locations.length > 0 ? (
                locations.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))
              ) : (
                <option disabled>Loading locations...</option>
              )}
            </select>

            {/* Dropdown icon */}
            <div className="absolute inset-y-11.5 right-4 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>

          {/* Pickup Date */}
          <div className="flex flex-col items-start gap-1">
            <label htmlFor="pickup-date" className="text-sm ml-2 text-gray-500">
              Pick-up Date
            </label>
            <input
              type="date"
              id="pickup-date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
              className="px-4 py-3 text-sm outline-none text-gray-700 bg-white border border-gray-200 rounded-full"
            />
          </div>

          {/* Return Date */}
          <div className="flex flex-col items-start gap-1">
            <label htmlFor="return-date" className="text-sm ml-2 text-gray-500">
              Return Date
            </label>
            <input
              type="date"
              id="return-date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
              className="px-4 py-3 text-sm outline-none text-gray-700 bg-white border border-gray-200 rounded-full"
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-12 py-4.5 mt-4 md:mt-0
        bg-primary hover:bg-primary-dull font-light text-lg text-white rounded-full cursor-pointer"
        >
          <img
            src={assets.search_icon}
            alt="search"
            className="brightness-200"
          />
          Search
        </button>
      </form>

      <img src={assets.main_car} alt="car" className="max-h-74" />
    </div>
  );
};

export default Hero;
