if(process.env.NODE_ENV !== "production"){
    require('dotenv').config(); 
} ///environment variable that is either in dev or production mode

const express = require('express') 
const path = require('path') 
const ejsMate = require('ejs-mate'); ///allows basic boilerplate
const methodOverride = require('method-override') ///allows http verbs other than POST/GET in forms 
const catchAsync = require('./utils/catchAsync.js')
const ExpressError = require('./utils/ExpressError')
const app = express(); ///starts express app 

//app.engine('ejs', ejsMate); ///allows basic boilerplate
app.set('view engine', 'ejs');  ///sets view engine to ejs 
app.set('views', path.join(__dirname, 'views')) ///so we can run app.js from outside of yelpcamp folder 

app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.urlencoded({extended:true})) ///allows us to get req.params 
app.use(methodOverride('_method')) ///allows requests other than get/post thru forms 


app.get('/', (req,res) =>{
    res.render('design')
})
app.all('*', (req,res,next) => { ///runs for all unrecognized urls 
    res.render('design')
})

///this runs if catchAsync catches error and calls next() OR if next(new ExpressError) gets called OR if validation error 
app.use((err,req,res,next) => { 
    const {status = 500} = err; ///gets status and message from ExpressError passed as err, else set defaults
    if(!err.message) err.message = 'Something went wrong!' ///if no error message, set default 
    res.status(status).render('error',{err})
    ///sets response status property to status passed in and renders error template 
})

///listen on heroku specified port or 3000 in dev environment 
const port = process.env.PORT || 3000;
app.listen(port, () =>{ 
    console.log(`Serving on port ${port}`)
})
