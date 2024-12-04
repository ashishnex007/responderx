const monogoose = require('monogoose');

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
    type: String,
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
  // * this is when the volunteers report to the incident
  feedback :{
    type: String
  }
}, {
    timestamps: true,
});