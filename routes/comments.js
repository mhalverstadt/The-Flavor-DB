//NOT IN USE YET

const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const commentsController = require("../controllers/comments");
// const pairingsController = require("../controllers/pairings");

//Comment Routes - simplified for now

router.post("/createComment/:id",  commentsController.createComment);


module.exports = router;
