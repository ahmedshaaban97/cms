const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
//load routes
const main = require('./routes/home/main');
const admin = require('./routes/admin/admin');
//
const port = 4500;


app.use(express.static(path.join(__dirname,'public')));
//use routes
app.use('/',main);
app.use('/admin',admin);
//
//set view engine
app.engine('handlebars',exphbs({defaultLayout: 'home'}));
app.set('view engine','handlebars');






app.listen(port,err=>{
    if (err) return ree;
    console.log(`the port ${port} is online`);
});