import React, { useState } from "react";
import { assets, cityList } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");

  const {pickupDate, setPickupDate, returnDate, setReturnDate, navigate, } = useAppContext();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-14 bg-light text-center">
      <h1 className="font-semibold text-4xl md:text-5xl">
        Luxury cars on Rent
      </h1>

      <form onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-1g 
      md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8">
          <div className="flex flex-col items-start gap-2">
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
            >
              <option value="">Pickup location</option>
              {cityList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <p className="px-1 text-sm text-gray-500">
              {pickupLocation ? pickupLocation : "Please selection location"}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="pickup-date">Pick-up Date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
              className="text-sm text-gray-500"
              required
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="return-date">Return Date</label>
            <input
              type="date"
              id="return-date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="text-sm text-gray-500"
              required
            />
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 px-10 py-3 max-sm:mt-4 
        bg-primary hover:bg-primary-dull font-light text-[18px] text-white rounded-full cursor-pointer">
            <img src={assets.search_icon} alt="search" className="brightness-300" />
            Search
          </button>
      </form>
      <img src={assets.main_car} alt="car" className="max-h-74" />
    </div>
  );
};

export default Hero;
