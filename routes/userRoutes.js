const express = require("express");
const userRoutes = express.Router();
const models = require("../models");

userRoutes.get("/", function(req, res) {
  models.user.findAll().then(function(foundUsers) {
    res.send(foundUsers);
  });
});

userRoutes.get("/profile", (req, res) => {
  console.log("REQ SESSION", req.session);
  models.post
    .findAll({
      where: { authorId: req.session.userId },
      include: [
        {
          model: models.like,
          as: "likes"
        }
      ]
    })
    .then(userPosts => {
      console.log("USERPOSTSSS", userPosts);
      console.log("USERRR", req.session);
      res.render("profile", { userPosts: userPosts, user: req.session });
    });
});


userRoutes.post("/message", function(req, res) {
  var message = req.body.message;
  console.log("REQ SESSION USER", req.session.user);
  console.log("REQ BODY FOR MESSAGE", req.body);
  var newPost = models.post
    .build({
      post: message,
      authorId: req.session.userId
    })
    .save()
    .then(function(newMessage) {
      res.redirect("./profile");
    });
});


userRoutes.post("/like", (req, res) => {
  var postid = req.body.postId;
  var newLike = models.like
    .build({
      userid: req.body.userId,
      postid: postid
    })
    .save()
    .then(savedLike => {
      res.redirect("/");
    });
});


userRoutes.post("/post/delete", (req, res) => {
  console.log("REQ BODY", req.body);
  var postId = Number(req.body.postid);
  models.like.destroy({ where: { postid: postId } }).then(deletedLikes => {
    models.post.destroy({ where: { id: postId } }).then(deletedPost => {
      res.redirect("/users/profile");
    });
  });
});



module.exports = userRoutes;
