const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');

// express app
const app = express();

// Connect to mongoDb
const dbURI = 'mongodb+srv://ankit:1nKit_Blogs@node.x5ovuxr.mongodb.net/nodeApp?retryWrites=true&w=majority';
mongoose.connect(dbURI)
    .then((result)=> app.listen(3000)) // fire when connected to database
    .catch((err)=> console.log(err)) // when error occurs

// Registe view engine
app.set('view engine', 'ejs');

// Middlewere and static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
// If we not use this the data send by form will not be there in app.post --> req.body


// routes
app.get('/',(req,res)=>{
    res.redirect('/blogs');
});

app.get('/about',(req,res)=>{
    res.render('about', {title: 'About'});
});

// Blog route

app.get('/blogs/create',(req,res)=>{
    res.render('create', {title: 'Create a new blog'});
});

app.get('/blogs', (req,res)=>{
    Blog.find().sort({createdAt: -1})// will sort in deccending(newest -> oldest)
        .then((result)=>{
            res.render('index', { title: 'All Blogs', blogs: result})
        })
        .catch((err)=>{
            console.log(err);
        })

})

// Post after get
// action="/blogs"
app.post('/blogs', (req,res)=>{
    // console.log(req.body);
    const blog = new Blog(req.body);

    blog.save()
        .then((result)=>{
           res.redirect('/blogs'); 
        })
        .catch((err)=>{
            console.log(err);
        })
});

app.get('/blogs/:id',(req,res)=>{
    const id = req.params.id;
    // console.log(id);
    Blog.findById(id)
        .then((result)=>{
            res.render('details', {blog: result, title: 'Blog Details'});
        })
        .catch((err)=>{
            res.status(404).render('error404', {title: 'Blog not found'});
        })
});

// Delete
app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    
    Blog.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/blogs' });
      })
      .catch(err => {
        console.log(err);
    });
});

// 404 error page

app.use((req,res)=>{
    res.status(404).render('error404', {title: '404'});
});