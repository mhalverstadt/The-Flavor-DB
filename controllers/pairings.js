const cloudinary = require("../middleware/cloudinary");//for images
const Pairing = require("../models/Pairing");
const Comment = require("../models/Comment");


module.exports = {
  //render profile page of user passing pairings as an array to the ejs along with the user info//
  getProfile: async (req, res) => {
    try {
      const pairings = await Pairing.find({ user: req.user.id });
      res.render("profile.ejs", { pairings: pairings, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  //renders search results page passing in pairings to ejs
  getResults: async (req, res) => {
    try {
      // const posts = await Pairings.find().sort({ createdAt: "desc" }).lean(); this will be our call to the ingredients DB
      res.render("search-results.ejs", { pairings: pairings });
    } catch (err) {
      console.log(err);
    }
  },
  //renders pairing.ejs with pairing, user, and comments 
  getPairing: async (req, res) => {
    try {
      const pairing = await Pairing.findById(req.params.id);
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc" }).lean(); //Comments for certain pairing, lean returns a pure js object instead of the mongoose document. 
      res.render("pairing.ejs", { pairing: pairing, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  //create a pairing and reder it to the profile
  createPairing: async (req, res) => {
    try {
      // Upload image to cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path); // cloudinary images 

      await Pairing.create({
        title: req.body.title,
        // pairings: , //need to add this somehow
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Pairing has been created!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  //like a pairing
  likePairing: async (req, res) => {
    try {
      await Pairing.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/pairing/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  //delete a pairing
  deletePairing: async (req, res) => {
    try {
      // Find post by id
      let post = await Pairing.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(pairing.cloudinaryId);
      // Delete post from db
      await Pairing.remove({ _id: req.params.id });
      console.log("Deleted Pairing");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
