const Schema = require('../mongoose-connect').Schema;
const mongoose = require('../mongoose-connect');

const datehoursSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  open: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  close: {
    type: String,
    required: true
  },
  venueId: {
    type: Schema.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('DateHours', datehoursSchema);