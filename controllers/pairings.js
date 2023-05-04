const cloudinary = require("../middleware/cloudinary");//for images
const Pairing = require("../models/Pairing");
const Comment = require("../models/Comment");
const Flavor = require("../models/Flavor");
const User = require("../models/User");
const { compare } = require("bcrypt");


module.exports = {

  //render profile page of user passing pairings as an array to the ejs along with the user info//
  getProfile: async (req, res) => {
    console.log('getting profile')
    try {
      const pairings = await Pairing.find({ user: req.user.id }).sort({ createdAt: "desc" });
      res.render("profile.ejs", { pairings: pairings, user: req.user, userName: req.user.userName, profileUser: req.user._id});
    } catch (err) {
      console.log(err);
    }
  },

  //render another user's profile
  getCommunityProfile: async (req, res) => {
    try {
      const pairings = await Pairing.find({ user: req.params.id }).sort({ createdAt: "desc" });
      const profileInfo = await User.find({ _id: req.params.id });
      res.render("profile.ejs", { pairings: pairings, user: req.params.id, userName: profileInfo[0].userName, profileUser: req.user._id});
    } catch (err) {
      console.log(err);
    }
  },

  //renders the feed page
  getFeed: async (req, res) => {
    try {
      const pairings = await Pairing.find().sort({ createdAt: "desc" }).limit(40);
      res.render("feed.ejs", { pairings: pairings, user: req.user.id,})
    }catch (err){
      console.log(err)
    }
  },


  //renders search results page passing in pairings to ejs
  getBuilder: async (req, res) => {
    try {
      res.render("builder.ejs", {
        keyIngredient: false,
        pairings: false,
        communityPairings: false,
        user: req.user || false,
        selectedPairings: false,
        comparedDuplicates: false,
        selectedPairingsPurple:false,
      });
    } catch (err) {
      console.log(err);
    }
  },

  // autocomplete Mongo Pipeline
  getResults: async (req, res) => {
    try{
      let result = await Flavor.aggregate([
        {
            "$search" : {
                "index": "autocomplete",
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
      const communityPairings = await Pairing.find({keyIngredient: keyIngredient.ingredient})
      res.render("builder.ejs", {
        keyIngredient: keyIngredient.ingredient,
        pairings: keyIngredient.pairings,
        communityPairings: communityPairings,
        user: req.user.id,
        selectedPairings: false,
        comparedDuplicates: false,
        selectedPairingsPurple:false,})
    }catch (error){
        res.status(500).send({message: error.message})
    }
  },

  //Compare selected pairings with key ingredient pairings, render duplicate pairings in builder.ejs
  getComparedPairingsList: async (req, res) =>{
    try {
      console.log(req.query)
      const noneFound = 'none found'
      //this returns strings, need to find out how to return arrays. 
      const keyIngredient = await Flavor.findOne( {ingredient: decodeURIComponent(req.query.compareKeyIngredient).toLowerCase()} )
      const communityPairings = await Pairing.find({keyIngredient: decodeURIComponent(req.query.compareKeyIngredient).toLowerCase()})
      //all pairings added under key ingredient
      const pairings = JSON.parse(decodeURIComponent(req.query.compareSelectedPairings))
      //this is all selected pairing ingredients that user wants to compare (class = changeColor)
      const arrForCompared = JSON.parse(decodeURIComponent(req.query.comparedPairings))
      if (arrForCompared.length > 0){
        //this finds the array of pairings from only the selected pairings (purple color) and returns their pairings 
        let comparedSelections = await Flavor.findOne({ingredient: (arrForCompared[0])}).select('pairings -_id')
        //if there are pairings to compare and there are duplicated pairings:
          if(comparedSelections){
            let comparedDuplicates = (keyIngredient.pairings).filter(flavor => (comparedSelections.pairings).includes(flavor))
            console.log(comparedDuplicates)
            if(comparedDuplicates.length > 0){
              res.render("builder.ejs", {
                keyIngredient: keyIngredient.ingredient,
                communityPairings: communityPairings,
                selectedPairings: pairings,
                user: req.user.id,
                pairings: false,
                comparedDuplicates: comparedDuplicates,
                selectedPairingsPurple: arrForCompared,
              })
              console.log('item 1 (duplicates found)')
          //There are no Duplicates
            }else if (comparedDuplicates.length < 1){
              res.render("builder.ejs", {
                keyIngredient: keyIngredient.ingredient,
                communityPairings: communityPairings,
                selectedPairings: pairings,
                user: req.user.id,
                pairings: noneFound,
                comparedDuplicates: false,
                selectedPairingsPurple: arrForCompared,
            })
            console.log('item 2 (no duplicates)')
          }
    //threre are selections to compare but no pairings associacted with them
      }else if(comparedSelections == null){
        res.render("builder.ejs", {
          keyIngredient: keyIngredient.ingredient,
          communityPairings: communityPairings,
          selectedPairings: pairings,
          user: req.user.id,
          pairings: noneFound,
          comparedDuplicates: false,
          selectedPairingsPurple: arrForCompared,
        })
        console.log('item 3 (no pairings found)')
      }
    //there are no selections to compare:
    }else{
      res.render("builder.ejs", {
        keyIngredient: keyIngredient.ingredient,
        communityPairings: communityPairings,
        selectedPairings: pairings,
        user: req.user.id,
        pairings: false,
        comparedDuplicates: keyIngredient.pairings,
        selectedPairingsPurple: arrForCompared,
      })
      // Trying to compare multiple Arrays////////////////////////////////////////////////////////////////////////
      // let comparedPairingArr = await Promise.all (arrForCompared.map(element =>  
      //   Flavor.find({ingredient: element.toLowerCase()}).select('pairings -_id')))
      //   console.log(comparedPairingArr)
        // console.log('item 4 (no compares)')
      }
    }catch (error){
        res.status(500).send({message: error.message})
    }
  },

  //renders pairing.ejs with pairing, user, and comments. lean provides pure JS Object. 
  getPairing: async (req, res) => {
    try {
      const pairing = await Pairing.findById(req.params.id);
      const comments = await Comment.find({pairing: req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("pairing.ejs", { pairing: pairing, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },

  //create a pairing and render it to the profile
  createPairing: async (req, res) => {
    try {
      // console.log(req.body)
      const postID = await Pairing.create({
        keyIngredient: req.body.keyIngredient.toLowerCase(),
        pairings: req.body.pairings,
        // image: result.secure_url || null,
        // cloudinaryId: result.public_id || null,
        notes: req.body.note || null,
        likes: 0,
        likedBy: [],
        user: req.user.id || null,
        userName: req.user.userName,
      });
      res.redirect(`/profile`)
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
    console.log(req.user._id)
    try {
      await Pairing.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { likedBy: req.user._id } },
      );
      console.log("Likes +1");
      res.redirect(`/pairing/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

  //like feed pairing
  likeFeedPairing: async (req, res) => {
    try {
      await Pairing.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { likedBy: req.user._id } },
      );
      console.log("Likes +1");
      res.redirect("/feed");
    } catch (err) {
      console.log(err);
    }
  },

  //dislike feed pairing
  dislikeFeedPairing: async (req, res) => {
    try {
      await Pairing.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { likedBy: req.user._id }, },
        {safe: true}
      );
      console.log("Likes -1");
      res.redirect(`/feed/#${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

  //dislike pairing
  dislikePairing: async (req, res) => {
    try {
      await Pairing.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { likedBy: req.user._id }, },
        {safe: true}
      );
      console.log("Likes -1");
      res.redirect(`/pairing/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

  //add image
  addImg: async(req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      const comments = await Comment.find({pairing: req.params.id}).sort({ createdAt: "desc" }).lean();
      await Pairing.findOneAndUpdate(
        {_id: req.params.id},
        {cloudinaryId: result.public_id,
          image: result.secure_url
        })
      let pairing = await Pairing.findById(req.params.id)
      console.log(pairing)
      res.render("pairing.ejs", { pairing: pairing, user: req.user, comments: comments,});
    } catch (err) {
      console.log(err)
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
      let comments = await Comment.deleteMany({pairing: req.params.id})
      // Delete post from db
      await Pairing.deleteOne({ _id: req.params.id });
      console.log("Deleted Pairing");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
