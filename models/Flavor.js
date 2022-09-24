const mongoose = require("mongoose");

const FlavorSchema = new mongoose.Schema({
  ingredient: {
    type: String,
    required: true,
  },
  pairings: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Flavor", FlavorSchema);