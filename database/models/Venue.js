const Schema = require('../mongoose-connect').Schema;
const mongoose = require('../mongoose-connect');

const venueSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  venueId: {
    type: Number,
    required: true
  },
  venueType: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Venue', venueSchema);