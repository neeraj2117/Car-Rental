import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },
    image: {
        type: String,
        required: [true, "Image is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Sedan", "SUV", "Hatchback", "Convertible", "Coupe", "Truck", "Van", "Other"],
      default: "Other",
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    seating_capacity: {
      type: Number,
      default: 4,
    },
    fuel_type: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "Other"],
      default: "Petrol",
    },
    transmission: {
      type: String,
      enum: ["Automatic", "Manual", "Semi-Automatic"],
      default: "Automatic",
    },
    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
export default Car;
