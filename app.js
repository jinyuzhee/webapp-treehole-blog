 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const { toLower } = require("lodash");
const mongoose = require('mongoose');
const Contact = require('./models/contact');
const Post = require('./models/post');

const homeStartingContent = "Welcome to our anonymous journal website! We provide a safe and secure space for you to express your thoughts, feelings, and experiences without the fear of judgment or criticism. Our platform is designed to be user-friendly and intuitive, allowing you to easily navigate and create posts. To add a bit of visual interest, we offer random photos to accompany your journal entries. Whether you're looking to vent, reflect, or simply share your story, our website is the perfect place to do so. So come join our community and start writing today!";
const aboutContent = "At Tree Hole, we believe that everyone needs a safe space to express their thoughts and feelings, without the fear of being judged or exposed. Our name is inspired by the concept of 'tree holes', which have long been used as a secret place for people to leave their notes, messages, and confessions. Just like the tree holes, our website provides a virtual space for anyone who needs to talk to someone, to pour out their hearts and connect with others, anonymously and securely.";
const contactContent = "Please fill out the form below to get in touch with us.";


const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin:58EEa0QKh1WJZrIM@cluster0.3xunqfg.mongodb.net/blogDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB'));

app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  Post.find({})
    
    .then(posts => {
      posts.sort((a, b) => b.date - a.date);
      res.render("home", {
        pageTitle: "Intro", startingContent: homeStartingContent, posts: posts
      });
    })
    .catch(err => console.log(err));
})


app.get("/about", (req, res) => {
  res.render("about", {
    pageTitle: "About", startingContent: aboutContent
  });
})


app.get("/contact", (req, res) => {
  res.render("contact", {
    success: true/false, pageTitle: "Contact", startingContent: contactContent
  });
})


app.get("/compose", (req, res) => {
  res.render("compose", {
    pageTitle: "Compose", content: contactContent
  });
})

app.post("/compose", (req, res) => {
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody,
    date: new Date()
  })

  post.save()
  .then(() => {
    console.log('New post saved to database');
    res.redirect("/");
  })
  .catch(err => {
    console.error(err);
  });

  
})


app.get("/posts/:postId", (req, res) => {
  const reqId = req.params.postId;
  
  Post.findOne({_id: reqId})
    .then(post => {
         res.render("post", {
            pageTitle: post.title, content: post.content, postDate: post.date
          });
    })
    .catch(err => console.log(err));
})

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const contact = new Contact({
    name,
    email,
    message,
    date: new Date()
  });

  contact.save()
    .then(() => {
      console.log('Contact saved to database');
      res.render('contact', { success: true, pageTitle: "Contact", startingContent: contactContent });
    })
    .catch(err => {
      console.error(err);
      res.render('contact', { success: false, pageTitle: "Contact", startingContent: contactContent });
    });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
