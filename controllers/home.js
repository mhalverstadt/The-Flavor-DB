module.exports = {
  //direct to homepage
  getIndex: (req, res) => {
    res.render("index.ejs");
  },

  //direct to about page
  getAbout: (req, res) => {
    res.render("about.ejs");
  },
};
