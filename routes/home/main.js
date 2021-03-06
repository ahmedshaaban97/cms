const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');
const Category = require('../../models/Category');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'home';
    next();
});




router.get('/',(req,res)=>{

    // finding all posts and sending them with render to the index view
    Post.find({}).then(posts=>{
        Category.find({}).then(categories=>{
            res.render('home/index', {posts : posts , categories : categories});
        });

    });

});


router.get('/about',(req,res)=>{
    res.render('home/about');
});


//login users requirment

router.get('/login',(req,res)=>{
    res.render('home/login');
});



passport.use(new LocalStrategy({usernameField : 'email'},(email,password,done)=>{
    console.log(password);

    User.findOne({email : email}).then(user=>{
        if (!user) return done(null , false , {message : 'no user found'});

        bcrypt.compare(password,user.password,(err,matched)=>{

            if (err) return err;
            if (matched){
                return done(null,user);
            } else {
                return done(null , false , {message : 'incorrect password'});
            }

        });
    });
}));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/admin',
        failureRedirect : '/login',
        failureFlash : true,
    })(req,res,next);
   // res.send('home/login');
});


router.get('/register',(req,res)=>{
    res.render('home/register');
});


router.post('/register',(req,res)=>{
    const newUser = new User({

        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : req.body.password,
    });
    if (req.body.password !== req.body.passwordConfirm) {
        req.flash('not_matched_passwords',"passwords don't match");
        res.render('home/register',{
            not_matched_passwords : req.flash('not_matched_passwords'),
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
        });
    }else {
        
        User.findOne({email : req.body.email}).then(user=>{
            if(!user){
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        newUser.password = hash;
                        newUser.save().then(savedUser=>{
                            req.flash('success_register','You are now registered,Please login');
                            res.redirect('/login');
                        });
                        console.log(hash);
                    });
                });
            }else {
                req.flash('already_user','The E-mail exists,please login');
                res.redirect('/login');
            }
        });






       // res.redirect('/');
    }
});


//logout
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/login')
});





router.get('/post/:id',(req,res)=>{
    Post.findOne({_id : req.params.id})
         .populate({path : 'comments', populate : {path : 'user', model : 'users'}})
        .populate('user')
        .then(post=>{
           // console.log(post);

        Category.find({}).then(categories=>{
            res.render('home/post', {post : post , categories: categories });
        });

    });


});

module.exports = router;
