const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const {isEmpty , uploadedDir} = require('../../helpers/upload-helpers');
const fs =require('fs');
const path = require('path');




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
    let fileName = 'no-image.jpeg';
    if (!isEmpty(req.files)) {
        let file = req.files.file;
        fileName = Date.now() + '-' + file.name;
        file.mv('./public/uploads/' + fileName,(err)=>{
            if (err) throw err;
        });
       // console.log('it is not empty');
    }


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
        description : req.body.description,
        file : fileName


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
        post.file = req.body.file;

        post.save().then(updated=>{
            console.log(updated);
            res.redirect('/admin/posts');
        });
    });

});


router.delete('/:id',(req,res)=>{

    Post.findOne({_id : req.params.id}).then(post=>{
        fs.unlink(uploadedDir + post.file , (err)=>{
            if (err) throw err;
        });
        Post.remove({_id : req.params.id}).then(err=>{
            if (err) throw err;
        });
        res.redirect('/admin/posts');
    });

});


module.exports = router;