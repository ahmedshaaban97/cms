const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const faker = require('faker');
const {userAuthed} = require('../../helpers/auth');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();
});

router.get('/',(req,res)=>{
    Post.count({}).then(postCount=>{
        res.render('admin/index',{postCount : postCount});
    });

});


router.post('/generate-fake-posts',(req,res)=>{
    
    for (let i =0 ; i <req.body.amount ; i++){


        let post = new Post();
        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.description = faker.lorem.sentence();

        post.save().then(saved=>{

        });


    }

    res.redirect('/admin/posts');
    
});




module.exports = router;