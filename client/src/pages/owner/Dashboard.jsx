import React, { useEffect, useState } from "react";
import { Car, Calendar, AlertCircle } from "lucide-react";
import Title from "../../components/Title";
import { assets, dummyDashboardData } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { isOwner, axios, currency } = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("/api/owner/dashboard");
      if (response.data.success) {
        setData(response.data.dashboardData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData();
    }
  }, [isOwner]);

  const stats = [
    {
      title: "Total Cars",
      value: data.totalCars,
      icon: assets.carIconColored,
    },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored,
    },
    {
      title: "Pending Bookings",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
    },
    {
      title: "Completed Bookings",
      value: data.completedBookings,
      icon: assets.listIconColored,
    },
  ];

  const bookings = data.recentBookings || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 w-[80%] bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mt-8 mb-10">
        <Title
          title="Admin Dashboard"
          subtitle="Monitor overall platform performance including total cars, bookings,
          revenue, and recent activities"
        />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4"
          >
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-xl font-semibold mt-1">{item.value}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <img src={item.icon} alt={item.title} className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-start">
        {/* Recent Bookings */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 col-span-2">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Bookings
          </h2>
          <p className="text-[15px] text-gray-400 mt-1 mb-6">
            Latest customer bookings
          </p>

          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-100 last:border-none pb-3"
              >
                <div className="flex flex-row gap-4">
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <img
                      src={assets.listIconColored}
                      className="h-5 w-5"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-gray-800">{booking.name}</p>
                    <p className="text-[14px] mt-1 text-gray-400">
                      {booking.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-gray-700 font-semibold">{booking.price}</p>
                  <span
                    className={`text-xs text-black font-medium px-3 py-1 rounded-full ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 self-start h-fit">
          <h2 className="text-lg font-semibold text-gray-800">
            Monthly Revenue
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            Revenue for current month
          </p>
          <p className="text-4xl font-bold mt-4 text-blue-600">{currency}{data.monthlyRevenue}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
