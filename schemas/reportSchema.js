const mongoose = require('mongoose');

// report schema
const reportSchema = new mongoose.Schema({
  description: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  media: {
    data: Buffer,
    contentType: String
  },
  type:{
    type: String,
  },
  severity: {
    type: String,
  },
  necessities: {
    type: String,
  },
  status: {
    type: String,
    default: 'pending',
  },
  // * this is when the volunteers report to the incident
  feedback :{
    type: String
  }
}, {
  // This toJSON method helps in converting Binary to base64 when sending
  toJSON: { 
    transform: (doc, ret) => {
      if (ret.media && ret.media.data) {
        ret.media.data = ret.media.data.toString('base64');
      }
      return ret;
    } 
  },
  timestamps: true,
});

module.exports = mongoose.model('Report', reportSchema);