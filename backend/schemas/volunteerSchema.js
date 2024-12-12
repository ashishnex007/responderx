const mongoose = require("mongoose");

// Volunteer schema
const VolunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    skills: {
      type: [String], // Array of skills (e.g., first aid, rescue operations, etc.)
    },
    availability: {
      type: Boolean,
      default: true, // Whether the volunteer is currently available
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteer", VolunteerSchema);
