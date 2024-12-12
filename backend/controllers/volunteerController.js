const express = require("express");
const Volunteer = require("../schemas/volunteerSchema");
const router = express.Router();

// Middleware for admin authorization (implement your own logic)
function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    // Assuming req.user is set after authentication
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
}

// Add a new volunteer
router.post("/add", async (req, res) => {
  const { name, phoneNumber, email, skills, availability } = req.body;

  try {
    const newVolunteer = new Volunteer({
      name,
      phoneNumber,
      email,
      skills,
      availability,
    });
    await newVolunteer.save();
    res.status(201).json({
      message: "Volunteer added successfully",
      volunteer: newVolunteer,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error adding volunteer", error: error.message });
  }
});

module.exports = router;
