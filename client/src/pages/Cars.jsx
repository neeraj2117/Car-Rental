import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import noCarsAnimation from "../assets/animations/no-car.json";
import loadingAnimation from "../assets/animations/loading.json";

const Cars = () => {
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const isSearchedData = pickupLocation && pickupDate && returnDate;
  const [filteredCars, setFilteredCars] = useState([]);

  const applyFilter = async () => {
    if (input === "") {
      setFilteredCars(cars);
      return;
    }

    const filtered = cars.filter((car) =>
      [car.brand, car.model, car.category, car.transmission]
        .some((field) => field.toLowerCase().includes(input.toLowerCase()))
    );
    setFilteredCars(filtered);
  };

  const searchCarAvailability = async () => {
    if (!pickupLocation || !pickupDate || !returnDate) return;
    setLoading(true);

    try {
      const { data } = await axios.post(`/api/bookings/check-availability`, {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        if (data.availableCars.length === 0) {
          setFilteredCars([]);
          toast.error("No cars available for the selected dates");
        } else {
          setFilteredCars(data.availableCars);
        }
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSearchedData) {
      searchCarAvailability();
    } else if (cars.length > 0) {
      setFilteredCars(cars);
      setLoading(false);
    }
  }, [isSearchedData, cars]);

  useEffect(() => {
    if (!isSearchedData) applyFilter();
  }, [input]);

  // ✅ Conditional rendering for loading / no-cars states
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Lottie animationData={loadingAnimation} loop className="h-56" />
          <p className="text-gray-600 mt-4 text-lg">Loading cars...</p>
        </div>
      );
    }

    if (!loading && filteredCars.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Lottie animationData={noCarsAnimation} loop className="h-72" />
          <p className="text-gray-500 mt-6 text-lg">
            No cars available for your selected dates.
          </p>
        </div>
      );
    }

    return (
      <>
        <p className="text-gray-600 mb-6">Showing {filteredCars.length} Cars</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Hero Section */}
      <div className="bg-gray-100 px-6 md:px-16 lg:px-24 py-16 text-center">
        <h1 className="text-5xl mt-3 md:text-5xl font-semibold text-gray-900">
          Available Cars
        </h1>
        <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
          Browse our selection of premium vehicles available for your next adventure
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
        {renderContent()}
      </div>
    </div>
  );
};

export default Cars;
