import React from "react";

const NewsLetter = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center bg-white border border-gray-200 mt-0 mb-30 shadow-[0px_4px_25px_0px_#0000000D] text-gray-900/60 rounded-xl max-w-lg md:w-full w-11/12 md:py-8 py-6">
        <div className="flex items-center justify-center p-3 bg-red-100 rounded-full">
          <img
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/model/faceIcon.svg"
            alt="faceIcon"
          />
        </div>
        <h2 className="text-slate-900 font-medium mt-3 text-lg">
          Never miss a deal
        </h2>
        <p className="text-sm text-slate-900/60 mt-1 md:w-80 w-72 text-center">
          Subscribe to get more content like this delivered to your inbox for free!
        </p>
        <div className="flex items-center mt-5 w-full md:px-16 px-6">
          <input
            type="email"
            placeholder="Enter Your Email"
            className="text-sm border-r-0 outline-none border border-gray-500/50 pl-3 w-full h-10 rounded-l-md"
          />
          <button
            type="button"
            className="font-medium text-sm text-white bg-gray-900/90 w-36 h-10 rounded-r-md"
          >
            Subscribe
          </button>
        </div>
        <div className="w-full h-px bg-gray-500/20 mt-5"></div>
        <p className="text-sm mt-4">
          Already a subscriber?{" "}
          <a className="text-blue-500 underline" href="#">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default NewsLetter;
