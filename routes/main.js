const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const pairingsController = require("../controllers/pairings");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, pairingsController.getProfile);
router.get("/builder", pairingsController.getBuilder); 
router.get("/search", pairingsController.getResults);
router.get("/search/:id", pairingsController.getPairingsList);
router.post("/search/createPairing",pairingsController.createPairing);
router.post("/createPairing",pairingsController.createPairing);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

router.put("/createNote/:id", pairingsController.createNote);


module.exports = router;
