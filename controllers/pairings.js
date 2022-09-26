const cloudinary = require("../middleware/cloudinary");//for images
const Pairing = require("../models/Pairing");
const Comment = require("../models/Comment");
const Flavor = require("../models/Flavor");


module.exports = {
  //render profile page of user passing pairings as an array to the ejs along with the user info//
  getProfile: async (req, res) => {
    try {
      const pairings = await Pairing.find({ user: req.user.id });
      res.render("profile.ejs", { pairings: pairings || false, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  //renders search results page passing in pairings to ejs
  getBuilder: async (req, res) => {
    try {
      res.render("builder.ejs", {keyIngredient: false, pairings: false, pair: false});
    } catch (err) {
      console.log(err);
    }
  },

  //autocomplete Mongo Pipeline
  getResults: async (req, res) => {
    try{
      let result = await Flavor.aggregate([
        {
            "$search" : {
                "autocomplete" : {
                    "query" : `${req.query.query}`,
                    "path" : "ingredient",
                    "fuzzy" : {
                        "maxEdits" : 1,
                        "prefixLength" : 2,
                    }
                }
            }
        }
    ])
    res.send(result)
    }catch (err){
      console.log(err)
    }
  },

  //renders array of pairings of key ingredient from "/search/:id" route
  getPairings: async (req, res) =>{
    try {
      const keyIngredient = await Flavor.findById(req.params.id)
      res.render("builder.ejs", {keyIngredient: keyIngredient.ingredient, pairings: keyIngredient.pairings, pair: false})
    }catch (error){
        res.status(500).send({message: error.message})
    }
  },

  //adding pairing 
  // addPairing: async (req, res) => {
  //   try{
  //     const keyIngredient = Document.getElementById('keyIngredient').innerText
  //     const pair = 
  //     res.render("builder.ejs", {keyIngredient: keyIngredient, pairings: keyIngredient.pairings, pair: pair})
  //   } catch(err){
  //     console.log(err) 
  //   }
  // },

  //renders pairing.ejs with pairing, user, and comments. lean provides pure JS Object. 
  getPairing: async (req, res) => {
    try {
      const pairing = await Pairing.findById(req.params.id);
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc" }).lean();
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
