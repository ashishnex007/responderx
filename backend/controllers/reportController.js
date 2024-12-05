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
  let media = '';

  if (req.file) {
    if (req.file.mimetype.startsWith('image/')) {
      // Compress image to 100KB
      media = await sharp(req.file.buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 50 })
        .toBuffer();
    } else if (req.file.mimetype.startsWith('video/')) {
      // Compress video to 5MB (using ffmpeg or similar tool)
      // For simplicity, we assume the video is already compressed
      media = req.file.buffer;
    }
  }

  try {
    const newReport = new Report({ description, location, media, type, severity, necessities, feedback });
    await newReport.save();
    res.status(201).send('Report submitted successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;