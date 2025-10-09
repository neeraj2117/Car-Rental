import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageBookings = () => {
  const { isOwner, axios, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);

  // Fetch all bookings for owner
  const fetchOwnerBookings = async () => {
    try {
      const response = await axios.get("/api/bookings/owner");
      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Change booking status
  const changeBookingStatus = async (bookingId, status) => {
    try {
      const response = await axios.post("/api/bookings/change-status", {
        bookingId,
        status,
      });
      if (response.data.success) {
        toast.success(response.data.message);

        // Update UI immediately
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status } : b
          )
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOwner) fetchOwnerBookings();
  }, [isOwner]);

  const bookingStatuses = ["pending", "confirmed", "completed", "cancelled"];

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[Sansation] px-10 py-6">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-semibold mb-1">Manage Bookings</h1>
        <p className="text-gray-500 font-light text-[16px] mt-2 mb-6">
          View all your car bookings, manage their status, and update booking details.
        </p>

        <div className="overflow-x-auto mt-10 border border-gray-100 rounded-lg">
          <table className="w-full text-[15px] text-gray-700">
            <thead className="bg-gray-100 text-gray-700 font-light">
              <tr>
                <th className="text-left py-3 px-8">Car</th>
                <th className="text-left py-3 px-14">Date Range</th>
                <th className="text-left py-3 px-6">Total</th>
                <th className="text-left py-3 px-10">Status</th>
                <th className="text-left py-3 px-10">Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => {
                  const car = booking.car;
                  return (
                    <tr
                      key={booking._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      {/* Car info */}
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img
                          src={car.image}
                          alt={`${car.brand} ${car.model}`}
                          className="w-20 h-12 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-semibold text-[16px]">
                            {car.brand} {car.model}
                          </p>
                          <p className="text-gray-500 font-light text-[13px]">
                            {car.seating_capacity} seats • {car.transmission}
                          </p>
                        </div>
                      </td>

                      {/* Date Range */}
                      <td className="py-4 px-6">
                        {formatDate(booking.pickupDate)} -{" "}
                        {formatDate(booking.returnDate)}
                      </td>

                      {/* Total */}
                      <td className="py-4 px-6">
                        {currency}
                        {booking.price}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
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
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            changeBookingStatus(booking._id, e.target.value)
                          }
                          className="border border-gray-300 bg-transparent text-gray-700 text-sm rounded-lg px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 capitalize"
                        >
                          {bookingStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 py-8 text-[16px]"
                  >
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
