const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/Story");

// @desc show add page
// @route GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add")
});

// @desc process the add form
// @route POST /stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    // the request comes without id of the user that has added the story
    // req.body has a user attribute which specified in the model and its required and refers to the user who created this story
    // we set the user attribute to be the id of the user
    // then we set the property in the req.body object to the value of the req.user.id
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    res.render("error/500");
  }
});

// @desc show all stories
// @route GET /stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" }).populate("user").sort({ createdAt: -1 }).lean();
    res.render("stories/index", { stories });
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
})

// @desc show single story
// @route GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();
    if(!story){
      return res.render("error/404");
    }
    res.render("stories/show", { story });
  } catch (err) {
    console.log(err);
    res.render("error/404");
  }
});

// @desc edit story
// @route GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({_id: req.params.id}).lean();
    if(!story){
      return res.render("error/404");
    }
    if(story.user != req.user.id){
      res.redirect("/stories");
    } else{
      res.render("stories/edit", { story });
    }
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
});

// @desc update story
// @route PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();
    if(!story){
      return res.render("error/404");
    }
    if(story.user != req.user.id){
      res.redirect("/stories");
    } else{
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
      });
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
});

// @desc delete story
// @route DELETE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.remove({_id: req.params.id});
    res.redirect("/dashboard"); 
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
})

// @desc show user stories
// @route GET /stories/user/:userid
router.get("/user/:userID", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userID,
      status: "public"
    })
    .populate("user")
    .lean();

    res.render("stories/index", { stories });
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
});

module.exports = router;