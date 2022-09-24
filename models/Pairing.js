const mongoose = require("mongoose");

const PairingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  keyIngredient: {
    type: String,
  },
  pairings: {
    type: Array,
  },
  image: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },
  caption: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Pairing", PairingSchema);
