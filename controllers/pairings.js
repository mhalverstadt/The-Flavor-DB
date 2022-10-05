const cloudinary = require("../middleware/cloudinary");//for images
const Pairing = require("../models/Pairing");
const Comment = require("../models/Comment");
const Flavor = require("../models/Flavor");


module.exports = {

  //render profile page of user passing pairings as an array to the ejs along with the user info//
  getProfile: async (req, res) => {
    console.log('getting profile')
    try {
      const pairings = await Pairing.find({ user: req.user.id });
      res.render("profile.ejs", { pairings: pairings, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  //renders search results page passing in pairings to ejs
  getBuilder: async (req, res) => {
    try {
      res.render("builder.ejs", {
        keyIngredient: false,
        pairings: false,
        communityPairings: false,
        user: req.user.id,
        pair: false
      });
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
  getPairingsList: async (req, res) =>{
    try {
      const keyIngredient = await Flavor.findById(req.params.id)
      console.log(keyIngredient.ingredient)
      const communityPairings = await Pairing.find({keyIngredient: keyIngredient.ingredient})
      console.log(communityPairings)
      res.render("builder.ejs", {
        keyIngredient: keyIngredient.ingredient,
        pairings: keyIngredient.pairings,
        communityPairings: communityPairings,
        user: req.user.id,
        pair: false})
    }catch (error){
        res.status(500).send({message: error.message})
    }
  },


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

  //create a pairing and render it to the profile
  createPairing: async (req, res) => {
    try {
      // console.log(req.body)
      await Pairing.create({
        keyIngredient: req.body.keyIngredient.toLowerCase(),
        pairings: req.body.pairings,
        // image: result.secure_url || null,
        // cloudinaryId: result.public_id || null,
        notes: req.body.note || null,
        likes: 0,
        user: req.user.id,
        userName: req.user.userName,
      });
      console.log('new pairing created!');
      res.redirect('/profile')
    } catch (err) {
      console.log(err);
    }
  },

  //creates a note to add to pairing 
  createNote: async (req, res) => {
    try{
      console.log(req.body)
      await Pairing.findOneAndUpdate(
        { _id: req.params.id },
        {notes: req.body.note},
        );
        console.log('added note')
        res.redirect(`/pairing/${req.params.id}`);
    }catch(err){
      console.log(err)
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
      let pairing = await Pairing.findById({ _id: req.params.id });
      // Delete image from cloudinary
      if (pairing.image){
        await cloudinary.uploader.destroy(pairing.cloudinaryId);
      }
      // Delete post from db
      await Pairing.deleteOne({ _id: req.params.id });
      console.log("Deleted Pairing");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
