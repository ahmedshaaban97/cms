const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
//load routes
const main = require('./routes/home/main');
const admin = require('./routes/admin/admin');
const posts = require('./routes/admin/posts');
//require our database odm
const mongoose = require('mongoose');
//setting promises
mongoose.promise = global.promise;
//to parse our data from a form
const bodyParser = require('body-parser');
//setting the methodoverride to be able to use put,patch,etc in the url
const methodOverride = require('method-override');
//setting up our port
const port = 4500;

//connecting to database
mongoose.connect('mongodb://localhost:27017/cms',{ useNewUrlParser: true }).then((db)=>{
    console.log('database connected');
}).catch(error=> console.log(error));




// this alow us to read all the style files stored in the public directory
app.use(express.static(path.join(__dirname,'public')));

//body parser
//always put it before the routes or it will not work
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//using the method override in the middleware
app.use(methodOverride('_method'));


//use routes
app.use('/',main);
app.use('/admin',admin);
app.use('/admin/posts',posts);
//

const {select} = require('./helpers/handlebars-helpers');

//set view engine
app.engine('handlebars',exphbs({defaultLayout: 'home' , helpers : {select : select}}));
app.set('view engine','handlebars');



app.listen(port,err=>{
    if (err) return ree;
    console.log(`the port ${port} is online`);
});