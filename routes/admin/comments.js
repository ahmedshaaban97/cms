const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');


router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();
});


router.get('/',(req,res)=>{
    Comment.find({}).populate('user').then(comments=>{

        res.render('admin/comments',{comments : comments});
    });

});



router.post('/:id',(req,res)=>{
    Post.findOne({_id : req.params.id}).then(post=>{
        const newComment = new Comment({
            user : req.user.id,
            body : req.body.body
        });
        post.comments.push(newComment);
        post.save().then(savedPost=>{
            newComment.save().then(savedComment=>{
                res.redirect(`/post/${post.id}`);
            });
        });
    });



});

router.delete('/:id',(req,res)=>{
    Comment.findOne({_id : req.params.id}).then(comment=>{
        comment.remove();
        res.redirect('/admin/comments');
    });
});











module.exports = router;