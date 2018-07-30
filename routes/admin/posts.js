const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');




router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();
});


router.get('/',(req,res)=>{
    // finding all posts and sending them with render to the index view
    Post.find({}).then(posts=>{
        res.render('admin/posts/index', {posts : posts});
    });

});

router.get('/create',(req,res)=>{
    res.render('admin/posts/create');
});

router.post('/create',(req,res)=>{

    let allowComments = true;
    if (req.body.allowComments){
        allowComments = true;
    } else {
        allowComments = false;
    }

    const newPost = new Post({
        title : req.body.title,
        status : req.body.status,
        allowComments : allowComments,
        description : req.body.description


    });

    newPost.save().then(savedPost=>{
        console.log(savedPost);
        res.redirect('/admin/posts');
    }).catch(error=> console.log(error));

});


router.get('/edit/:id',(req,res)=>{

    Post.findOne({_id : req.params.id}).then(post=>{

        res.render('admin/posts/edit',{post : post})
    });


});

router.put('/edit/:id',(req,res)=>{
    Post.findOne({_id : req.params.id}).then(post=>{

        let allowComments = true;
        if (req.body.allowComments){
            allowComments = true;
        } else {
            allowComments = false;
        }

        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.description = req.body.description;

        post.save().then(updated=>{
            console.log(updated);
            res.redirect('/admin/posts');
        });
    });

});


router.delete('/:id',(req,res)=>{

    Post.remove({_id : req.params.id}).then(result=>{
        res.redirect('/admin/posts');
    });

});


module.exports = router;