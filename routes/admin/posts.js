const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const {isEmpty , uploadedDir , isFull} = require('../../helpers/upload-helpers');
const fs =require('fs');
const path = require('path');
const {userAuthed} = require('../../helpers/auth')





router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();
});


router.get('/',(req,res)=>{
    // finding all posts and sending them with render to the index view
    Post.find({})
        .populate('category')
        .then(posts=>{
        res.render('admin/posts/index', {posts : posts});
    });

});

router.get('/myPosts',(req,res)=>{
    Post.find({user : req.user.id}).populate('category').then(userPosts=>{
        res.render('admin/posts/myPosts', {posts : userPosts});
    });

});



router.get('/create',(req,res)=>{
    Category.find({}).then(categories=>{
        res.render('admin/posts/create',{categories : categories});
    });

});

router.post('/create',(req,res)=>{
    let fileName = 'No_Image_Available.jpg';
    let hasPhoto = false;
    if (!isEmpty(req.files)) {
        let file = req.files.file;
        fileName = Date.now() + '-' + file.name;
        hasPhoto = true;
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
        user : req.user.id,
        title : req.body.title,
        status : req.body.status,
        category : req.body.category,
        allowComments : allowComments,
        description : req.body.description,
        hasPhoto : hasPhoto,
        file : fileName


    });

    newPost.save().then(savedPost=>{
        console.log(savedPost);

        req.flash('success_massage',`post ${savedPost.title} was created successfully`);

        res.redirect('/admin/posts');
    }).catch(error=> console.log(error));

});


router.get('/edit/:id',(req,res)=>{

    Post.findOne({_id : req.params.id}).then(post=>{
        Category.find({}).then(categories=>{
            res.render('admin/posts/edit',{post : post,  categories : categories});
        });
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


        post.user = req.user.id;
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.description = req.body.description;
        post.category = req.body.category;

        let hasPhoto = false;
        if (!isEmpty(req.files)) {
            let file = req.files.file;
            let fileName = Date.now() + '-' + file.name;
            post.file = fileName;
            hasPhoto = true;
            file.mv('./public/uploads/' + fileName,(err)=>{
                if (err) throw err;
            });
            // console.log('it is not empty');
        }

        post.hasPhoto = hasPhoto;




        post.save().then(updated=>{
            req.flash('update_massage',`post ${post.title} was updated successfully`);
            console.log(updated);
            res.redirect('/admin/posts/myPosts');
        });
    });

});


router.delete('/:id',(req,res)=> {

    Post.findOne({_id: req.params.id})
        .populate('comments')
        .then(post => {

        fs.unlink(uploadedDir + post.file, (err) => {
            if (!post.comments.length < 1) {
                post.comments.forEach(comment=>{
                   comment.remove();
                });
            }


            post.remove().then(postRemoved=>{
                req.flash('delete_massage',`post ${post.title} was deleted successfully`);
                res.redirect('/admin/posts/myPosts');
            });

        });

    });
});


module.exports = router;