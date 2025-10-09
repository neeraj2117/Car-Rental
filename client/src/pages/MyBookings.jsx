import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { axios, user, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);

  // Fetch user's bookings from backend
  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Fetch bookings error:", error.message);
      toast.error("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    if (user) fetchMyBookings();
  }, [user]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return format(date, "dd MMM yyyy");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-semibold mt-10 text-gray-900">
        My Bookings
      </h1>
      <p className="text-gray-500 mb-6 mt-3">
        View and manage your car bookings
      </p>

      <div className="space-y-6 mt-10">
        {bookings.length > 0 ? (
          bookings.map((booking, index) => {
            const car = booking.car || {};
            const pickupDate = formatDate(booking.pickupDate);
            const returnDate = formatDate(booking.returnDate);
            const bookedOn = formatDate(booking.createdAt);

            return (
              <div
                key={booking._id}
                className="flex flex-col md:flex-row gap-6 p-7 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-all duration-200"
              >
                {/* Car Image & Info */}
                <div className="w-full md:w-72 flex flex-col items-start">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="mt-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {car.brand} {car.model}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {car.category} • {car.year} • {car.location}
                    </p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="flex-1 flex flex-col md:flex-row gap-6">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-gray-100 px-3 py-1 rounded-md">
                        Booking #{index + 1}
                      </span>
                      <span
                        className={`text-sm px-3 py-1 rounded-md capitalize ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-[15px] text-gray-700">
                      {/* Rental Period */}
                      <div>
                        <p className="flex items-center gap-2 text-gray-500 font-medium">
                          <Calendar size={18} />
                          Rental Period
                        </p>
                        <p className="mt-[2px] ml-6 text-gray-900 font-medium">
                          {pickupDate} - {returnDate}
                        </p>
                      </div>

                      {/* Pickup & Return Locations */}
                      <div>
                        <p className="flex items-center gap-2 text-gray-500 font-medium">
                          <img
                            src={assets.location_icon_colored}
                            alt="pickup"
                            className="w-4 h-5"
                          />
                          Pick-up Location
                        </p>
                        <p className="mt-[2px] ml-6 text-gray-900 font-medium">
                          {car.location || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-2 text-gray-500 font-medium">
                          <img
                            src={assets.location_icon_colored}
                            alt="return"
                            className="w-4 h-5"
                          />
                          Return Location
                        </p>
                        <p className="mt-[2px] ml-6 text-gray-900 font-medium">
                          {car.location || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="text-right flex-shrink-0 md:w-48">
                    <p className="text-[15px] text-gray-500">Total Price</p>
                    <p className="text-blue-600 font-semibold text-3xl mb-1 mt-0">
                      {currency}
                      {booking.price}
                    </p>
                    <p className="text-[14px] text-gray-400">
                      Booked on {bookedOn}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-8 text-[16px]">
            You have no bookings yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
