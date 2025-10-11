import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../CalendarStyles.css";

const CarDetails = () => {
  const { id } = useParams();
  const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate } =
    useAppContext();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const currency = import.meta.env.VITE_CURRENCY;

  // Normalize a date to midnight for consistent comparison
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  // Set current car
  useEffect(() => {
    setCar(cars.find((car) => car._id === id));
  }, [cars, id]);

  // Fetch booked dates for this car
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const { data } = await axios.get(
          `/api/bookings/car-booked-dates/${id}`
        );
        // Normalize all booked dates
        setBookedDates((data.bookedDates || []).map((d) => normalizeDate(d)));
      } catch (error) {
        console.error(
          "Error fetching booked dates:",
          error.response?.data || error.message
        );
        toast.error("Failed to fetch booked dates");
      }
    };
    fetchBookedDates();
  }, [id, axios]);

  // Check if selected dates overlap with booked dates
  const isDateOverlap = (pickup, returnD) => {
    if (!pickup || !returnD) return false;
    const start = normalizeDate(pickup);
    const end = normalizeDate(returnD);

    for (let d = start; d <= end; d += 24 * 60 * 60 * 1000) {
      if (bookedDates.includes(d)) return true;
    }
    return false;
  };

  // Handle booking form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickupDate || !returnDate) {
      toast.error("Please select both pickup and return dates");
      return;
    }

    if (isDateOverlap(pickupDate, returnDate)) {
      toast.error("Selected dates are already booked");
      return;
    }

    try {
      const { data } = await axios.post("/api/bookings/create", {
        car: id,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        toast.success("Car booked successfully!");
        navigate("/my-bookings");
      } else {
        toast.error(data.message || "Failed to book the car");
      }
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  // Calendar tile styling
  const tileClassName = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateTime = normalizeDate(date);

    if (bookedDates.includes(dateTime)) return "booked-date"; // Booked
    if (dateTime === today.getTime()) return "react-calendar__tile--now"; // Today
    if (dateTime < today.getTime()) return "past-date"; // Past

    return "available-date"; // Future available
  };

  // Disable booked dates in calendar
  const tileDisabled = ({ date }) => {
    const dateTime = normalizeDate(date);
    return bookedDates.includes(dateTime);
  };

  if (!car) return <Loader />;

  return (
    <div className="px-6 md:px-16 lg:px-24 mt-5 ml-8 mb-50 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="cursor-pointer text-gray-500 gap-3 text-[16px] mb-4 flex items-center hover:underline"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />{" "}
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2">
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="rounded-lg w-full h-105 object-cover mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900">
            {car.brand} {car.model}
          </h1>
          <p className="text-gray-500 text-[18px] mb-6">
            {car.category} {car.year}
          </p>

          <div className="border-t border-gray-400 opacity-70 my-7"></div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50">
              <img
                src={assets.users_icon}
                className="text-xl h-5 mb-2 text-gray-600"
              />
              <p className="text-[16px] text-gray-700">
                {car.seating_capacity} Seats
              </p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50">
              <img
                src={assets.fuel_icon}
                className="text-xl h-5 mb-2 text-gray-600"
              />
              <p className="text-[16px] text-gray-700">{car.fuel_type}</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50">
              <img
                src={assets.carIcon}
                className="text-xl h-6 mb-2 text-gray-600"
              />
              <p className="text-[16px] text-gray-700">{car.transmission}</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50">
              <img
                src={assets.location_icon}
                className="text-xl h-5 mb-2 text-gray-900"
              />
              <p className="text-[16px] text-gray-700">{car.location}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{car.description}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-25">
            {/* Calendar */}
            <div className="p-6 mb-6 rounded-xl border border-gray-200 bg-white">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Availability Calendar
              </h2>
              <Calendar
                tileClassName={tileClassName}
                tileDisabled={tileDisabled}
                prev2Label={null}
                next2Label={null}
              />
              <div className="calendar-legend px-5">
                <span className="booked">
                  <span className="legend-dot"></span>Booked
                </span>
                <span className="available">
                  <span className="legend-dot"></span>Available
                </span>
              </div>
            </div>

            {/* Booking Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 rounded-xl border border-gray-200 bg-white"
            >
              <div className="flex flex-row justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {currency}
                  {car.pricePerDay}
                </h2>
                <p className="text-[16px] text-gray-400 mb-0">per day</p>
              </div>

              <div className="border-t border-gray-400 opacity-40 my-6"></div>

              <div className="mb-6">
                <label className="block text-[16px] text-gray-500 mb-1">
                  Pickup Date
                </label>
                <input
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-[16px] text-gray-500 mb-1">
                  Return Date
                </label>
                <input
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 mt-7 cursor-pointer hover:bg-blue-700 text-white font-medium rounded-xl py-3 transition"
              >
                Book Now
              </button>

              <p className="text-[15px] text-gray-500 text-center mt-4">
                No credit card required to reserve
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
