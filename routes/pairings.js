const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const pairingsController = require("../controllers/pairings");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Pairing Routes - simplified for now
router.get("/:id", ensureAuth, pairingsController.getPairing);
// router.post("/createPairing", pairingsController.createPairing);
router.put("/likePairing/:id", pairingsController.likePairing);
router.put("/createNote/:id", pairingsController.createNote);
router.delete("/deletePairing/:id", pairingsController.deletePairing);

module.exports = router;
