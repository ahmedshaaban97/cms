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
//to parse our data from a form
const bodyParser = require('body-parser');

//setting promises
mongoose.promise = global.promise;
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


//use routes
app.use('/',main);
app.use('/admin',admin);
app.use('/admin/posts',posts);
//
//set view engine
app.engine('handlebars',exphbs({defaultLayout: 'home'}));
app.set('view engine','handlebars');



app.listen(port,err=>{
    if (err) return ree;
    console.log(`the port ${port} is online`);
});