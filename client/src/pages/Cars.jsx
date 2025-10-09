import React, { useEffect, useState } from "react";
import { assets, dummyCarData } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Cars = () => {
  // getting search params from URL
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();
  const [input, setInput] = useState("");

  const isSearchedData = pickupLocation && pickupDate && returnDate;
  const [filteredCars, setFilteredCars] = useState([]);

  const applyFilter = async () => {
    if (input === "") {
      setFilteredCars(cars);
      return null;
    }

    const filtered = cars.slice().filter((car) => {
      return (
        car.brand.toLowerCase().includes(input.toLowerCase()) ||
        car.model.toLowerCase().includes(input.toLowerCase()) ||
        car.category.toLowerCase().includes(input.toLowerCase()) ||
        car.transmission.toLowerCase().includes(input.toLowerCase())
      );
    });
    setFilteredCars(filtered);
  };

  const searchCarAvailability = async () => {
    if (!pickupLocation || !pickupDate || !returnDate) return;

    try {
      const { data } = await axios.post(`/api/bookings/check-availability`, {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        if (data.availableCars.length === 0) {
          setFilteredCars([]); // ensure empty list is shown
          toast.error("No cars available for the selected dates");
        } else {
          setFilteredCars(data.availableCars);
        }
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isSearchedData && searchCarAvailability();
  }, [isSearchedData]);

  useEffect(() => {
    cars.length > 0 && !isSearchedData && applyFilter();
  }, [input, cars]);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Hero Section */}
      <div className="bg-gray-100 px-6 md:px-16 lg:px-24 py-16 text-center">
        <h1 className="text-5xl mt-3 md:text-5xl font-semibold text-gray-900">
          Available Cars
        </h1>
        <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
          Browse our selection of premium vehicles available for your next
          adventure
        </p>

        {/* Search */}
        <div className="mt-10 flex justify-center">
          <div className="flex items-center w-full max-w-xl bg-white border border-gray-200 rounded-full shadow-sm px-4 py-1">
            <img src={assets.search_icon} alt="" className="h-5 opacity-60" />
            <input
              type="text"
              placeholder="Search by make, model, or features"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 outline-none text-gray-700"
            />
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <img src={assets.filter_icon} alt="" className="h-5 opacity-70" />
            </button>
          </div>
        </div>
      </div>

      {/* Cars Section */}
      <div className="bg-white px-6 md:px-16 lg:px-70 py-12">
        {/* Cars Count */}
        <p className="text-gray-600 mb-6">Showing {filteredCars.length} Cars</p>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
