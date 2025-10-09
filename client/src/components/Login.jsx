import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowLogin, axios, setToken, navigate, setUser } = useAppContext();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });
      console.log("Response data:", data);

      if (data.token) {
        // Set token in context, axios, and localStorage
        setToken(data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        localStorage.setItem("token", data.token);

        // Fetch user and set in context
        const { data: userData } = await axios.get("/api/user/data");
        if (userData.success) {
          setUser(userData.user);
        }

        // Success toast
        toast.success(
          state === "register"
            ? "Account created successfully!"
            : "Logged in successfully!"
        );

        // Close modal and navigate
        setShowLogin(false);
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("User already exists!");
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col gap-4 p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setShowLogin(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 border border-gray-300 py-0.5 px-2 rounded-lg cursor-pointer"
        >
          ✕
        </button>

        <p className="text-2xl font-medium m-auto">
          <span className="text-indigo-500">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            required
          />
        </div>

        {state === "register" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-indigo-500 hover:underline cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-indigo-500 hover:underline cursor-pointer"
            >
              click here
            </span>
          </p>
        )}

        <button className="bg-indigo-500 mt-2 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
