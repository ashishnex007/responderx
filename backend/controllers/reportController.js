const express = require('express');
const Report = require('../schemas/reportSchema');
const multer = require('multer');
const sharp = require('sharp');
const router = express.Router();

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
    res.status(201).send('Report submitted successfully');
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