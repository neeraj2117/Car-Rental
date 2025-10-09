import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageCar = () => {
  const { isOwner, axios, currency } = useAppContext();
  const [cars, setCars] = useState([]);

  // Fetch all cars for the logged-in owner
  const fetchOwnerCars = async () => {
    try {
      const response = await axios.get("/api/owner/cars");
      if (response.data.success) {
        setCars(response.data.cars);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Toggle car availability
  const toggleAvailability = async (carId) => {
    try {
      const response = await axios.post("/api/owner/toggle-car", { carId });
      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh car list after toggle
        fetchOwnerCars();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete a car
  const deleteCar = async (carId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this car?"
      );
      if (!confirmDelete) return;

      const response = await axios.post("/api/owner/delete-car", { carId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchOwnerCars();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch cars on mount
  useEffect(() => {
    if (isOwner) {
      fetchOwnerCars();
    }
  }, [isOwner]);

  return (
    <div className="min-h-screen bg-gray-50 font-[Sansation] px-10 py-6">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm p-6">
        {/* Header */}
        <h1 className="text-3xl font-semibold mb-1">Manage Cars</h1>
        <p className="text-gray-500 font-light text-[16px] mt-2 mb-6">
          View all listed cars, update their details, or remove them from the
          booking platform.
        </p>

        {/* Table */}
        <div className="overflow-x-auto mt-10 border border-gray-100 rounded-lg">
          <table className="min-w-full text-[15px] text-gray-700">
            <thead className="bg-gray-100 text-gray-700 font-light">
              <tr>
                <th className="text-left py-3 px-8">Car</th>
                <th className="text-left py-3 px-10">Category</th>
                <th className="text-left py-3 px-10">Price</th>
                <th className="text-left py-3 px-12">Status</th>
                <th className="text-left py-3 px-12">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.length > 0 ? (
                cars.map((car, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    {/* Car info */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-20 h-14 rounded-md object-cover"
                      />
                      <div className="py-2">
                        <p className="font-semibold text-[18px]">
                          {car.brand}{" "}
                          <span className="text-gray-800 font-light text-[14px]">
                            ({car.model})
                          </span>
                        </p>
                        <p className="text-gray-500 mt-0 font-light text-[15px]">
                          {car.seating_capacity} seats • {car.transmission}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-13">{car.category}</td>

                    {/* Price */}
                    <td className="py-4 px-6">
                      {currency}
                      {car.pricePerDay}/day
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          car.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {car.isAvailable ? "Available" : "Not Available"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 flex items-center gap-2">
                      <button
                        className="text-gray-600 hover:text-blue-500 transition"
                        onClick={() => toggleAvailability(car._id)}
                      >
                        <img
                          src={
                            car.isAvailable
                              ? assets.eye_icon
                              : assets.eye_close_icon
                          }
                          alt="toggle availability"
                          className="w-12 h-12"
                        />
                      </button>
                      <button
                        className="text-gray-600 hover:text-red-500 transition"
                        onClick={() => deleteCar(car._id)}
                      >
                        <img
                          src={assets.delete_icon}
                          alt="delete"
                          className="w-12 h-11"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 py-8 text-[16px]"
                  >
                    No cars found.
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

export default ManageCar;
