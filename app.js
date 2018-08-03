const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
//load routes
const main = require('./routes/home/main');
const admin = require('./routes/admin/admin');
const posts = require('./routes/admin/posts');
const category = require('./routes/category/cPages');
//require our database odm
const mongoose = require('mongoose');
//setting promises
mongoose.promise = global.promise;
//to parse our data from a form
const bodyParser = require('body-parser');
//setting the methodoverride to be able to use put,patch,etc in the url
const methodOverride = require('method-override');
//to upload images to website we use this module
const upload = require('express-fileupload');
//requiring our session module
const session = require('express-session');
const flash = require('connect-flash');
//setting up our port
const port = 4500;

//connecting to database
mongoose.connect('mongodb://localhost:27017/cms',{ useNewUrlParser: true }).then((db)=>{
    console.log('database connected');
}).catch(error=> console.log(error));




// this allow us to read all the style files stored in the public directory
app.use(express.static(path.join(__dirname,'public')));


const {select,generateDate} = require('./helpers/handlebars-helpers');

//set view engine
app.engine('handlebars',exphbs({defaultLayout: 'home' , helpers : {select : select , generateDate : generateDate}}));
app.set('view engine','handlebars');

//using the uploasd module
app.use(upload());

//body parser
//always put it before the routes or it will not work
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//using the method override in the middleware
app.use(methodOverride('_method'));

//using our session
app.use(session({
    secret: 'admin',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
}));

app.use(flash());

//local variable using middlewear to display a massage when we create a new post
app.use((req,res,next)=>{
    res.locals.success_massage = req.flash('success_massage');
    res.locals.delete_massage = req.flash('delete_massage');
    res.locals.update_massage = req.flash('update_massage');
    next();
});


//use routes
app.use('/',main);
app.use('/admin',admin);
app.use('/admin/posts',posts);
//





app.listen(port,err=>{
    if (err) return err;
    console.log(`the port ${port} is online`);
});