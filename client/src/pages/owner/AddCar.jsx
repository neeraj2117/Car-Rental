import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddCar = () => {
  const { axios, currency } = useAppContext();

  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    location: "",
    description: "",
  });

  const transmissionOptions = ["Automatic", "Manual", "Semi-Automatic"];
  const categoryOptions = [
    "Sedan",
    "SUV",
    "Hatchback",
    "Convertible",
    "Coupe",
    "Truck",
    "Van",
  ];
  const fuelOptions = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];

  // handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  // handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar((prev) => ({ ...prev, [name]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData);
      if (data.success) {
        toast.success(data.message);
        setImage("");
        setCar({
          brand: "",
          model: "",
          year: 0,
          pricePerDay: 0,
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: 0,
          location: "",
          description: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-start font-[Sansation] px-10 py-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-semibold mb-1">Add New Car</h1>
        <p className="text-gray-500 font-light mb-7 mt-1 text-[16px]">
          Fill in details to list a new car for booking, including pricing,
          availability, and car specifications.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Upload Section */}
          <div className="mb-5 flex flex-row items-center gap-4">
            <label className="w-32 h-20 flex flex-col items-center justify-center bg-gray-100 text-gray-500 rounded-md border border-dashed border-gray-300 cursor-pointer hover:bg-gray-200 transition">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Car"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mb-1 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0l4 4m-4-4L3 8m14"
                    />
                  </svg>
                  <span className="text-[11px]">Upload</span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            <p className="text-gray-700 text-sm font-medium">
              Upload a picture of your car
            </p>
          </div>

          {/* Brand & Model */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Brand</label>
              <input
                type="text"
                name="brand"
                value={car.brand}
                onChange={handleChange}
                placeholder="e.g. BMW, Mercedes, Audi..."
                className="w-full border border-gray-300 rounded-lg py-3 p-2 text-gray-700 text-sm focus:ring-1 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Model</label>
              <input
                type="text"
                name="model"
                value={car.model}
                onChange={handleChange}
                placeholder="e.g. X5, E-Class, M4..."
                className="w-full border border-gray-300 rounded-lg py-3 p-2 text-gray-700 text-sm focus:ring-1 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Year, Category, Daily Price */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Year</label>
              <input
                type="number"
                name="year"
                value={car.year}
                onChange={handleChange}
                placeholder="2025"
                className="w-full border border-gray-300 rounded-lg py-3 p-2 text-gray-700 text-sm focus:ring-1 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 text-sm">
                Category
              </label>
              <select
                name="category"
                value={car.category}
                onChange={handleChange}
                className="w-full appearance-none border border-gray-300 rounded-lg mr-2 py-3 px-2 text-gray-700 text-sm focus:ring-1 focus:ring-blue-400 outline-none bg-white"
              >
                <option value="">Select Category</option>
                {categoryOptions.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm">
                Daily Price ($)
              </label>
              <input
                type="number"
                name="pricePerDay"
                value={car.pricePerDay}
                onChange={handleChange}
                placeholder="100"
                className="w-full border border-gray-300 rounded-lg py-3 p-2 text-gray-700 text-sm focus:ring-1 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Transmission, Fuel Type, Capacity */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1 text-sm">
                Transmission
              </label>
              <select
                name="transmission"
                value={car.transmission}
                onChange={handleChange}
                className="w-full appearance-none border border-gray-300 rounded-lg py-3 px-2 text-gray-700 text-sm focus:ring-1 focus:ring-blue-400 outline-none bg-white"
              >
                <option value="">Select Transmission</option>
                {transmissionOptions.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm">
                Fuel Type
              </label>
              <select
                name="fuel_type"
                value={car.fuel_type}
                onChange={handleChange}
                className="w-full appearance-none border border-gray-300 rounded-lg py-3 px-2 text-gray-700 text-sm focus:ring-1 focus:ring-blue-400 outline-none bg-white"
              >
                <option value="">Select Fuel Type</option>
                {fuelOptions.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm">
                Seating Capacity
              </label>
              <input
                type="number"
                name="seating_capacity"
                value={car.seating_capacity}
                onChange={handleChange}
                placeholder="5"
                className="w-full border border-gray-300 rounded-lg py-3 p-2 text-gray-700 text-sm focus:ring-1 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm">Location</label>
            <input
              type="text"
              name="location"
              value={car.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA"
              className="w-full border border-gray-300 rounded-lg py-3 p-2 text-gray-700 text-sm focus:ring-1 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-gray-700 mb-1 text-sm">
              Description
            </label>
            <textarea
              rows="5"
              name="description"
              value={car.description}
              onChange={handleChange}
              placeholder="Describe your car, its condition, and any notable details..."
              className="w-full border border-gray-300 rounded-lg py-3 p-2 text-gray-700 text-sm focus:ring-1 focus:ring-blue-400 outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-500 cursor-pointer text-white px-6 py-2 rounded-md text-sm hover:bg-blue-600 transition"
          >
            {`${isLoading ? "Listing..." : "List your car"}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCar;
