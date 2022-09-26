const mongoose = require("mongoose");

const PairingSchema = new mongoose.Schema({
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
  notes: {
    type: String,
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
