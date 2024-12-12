const express = require('express');
const Report = require('../schemas/reportSchema');
const multer = require('multer');
const sharp = require('sharp');
const router = express.Router();
const twilio = require("twilio"); // Import Twilio
const Volunteer = require("../schemas/volunteerSchema");

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Configure multer for media uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Submit report controller
router.post('/submit', upload.single('media'), async (req, res) => {
  const { description, location, type, severity, necessities, feedback } = req.body;
  let mediaBuffer = null;
  
  if (req.file) {
    if (req.file.mimetype.startsWith('image/')) {
      // Compress image to 100KB
      mediaBuffer = await sharp(req.file.buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 50 })
        .toBuffer();
    } else if (req.file.mimetype.startsWith('video/')) {
      // Compress video to 5MB (using ffmpeg or similar tool)
      // For simplicity, we assume the video is already compressed
      mediaBuffer = req.file.buffer;
    }
  }
  
  try {
    const newReport = new Report({ 
      description, 
      location, 
      media: {
        data: mediaBuffer,
        contentType: req.file ? req.file.mimetype : null
      }, 
      type, 
      severity, 
      necessities, 
      feedback 
    });
    
    await newReport.save();
    console.log("Report done");
    // Fetch volunteers from the database
    const volunteers = await Volunteer.find(); // Assuming Volunteer schema has a phoneNumber field

    // Notify volunteers via SMS
    const smsPromises = volunteers.map((volunteer) => {
      // Generate Google Maps link
      const latitudeMatch = location.match(/Latitude:\s*([\d.-]+)/);
      const longitudeMatch = location.match(/Longitude:\s*([\d.-]+)/);
      
      const googleMapsLink = `https://www.google.com/maps?q=${latitudeMatch[1]},${longitudeMatch[1]}`;
      return client.messages.create({
        body: `New disaster report: ${description}. Location: ${googleMapsLink}. Type: ${type}, Severity: ${severity}.`,
        from: twilioPhoneNumber,
        to: volunteer.phoneNumber,
      });
    });

    await Promise.all(smsPromises);

    res
      .status(201)
      .send("Report submitted successfully and volunteers notified");
      console.log("notif done");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    // console.log(reports);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    // If media is a Binary type, convert to a format easy to send
    if (report.media && report.media.data) {
        report.media = {
            data: report.media.data.toString('base64'),
            contentType: report.media.contentType
        };
    }
    
    res.json(report);
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

module.exports = router;