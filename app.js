const express = require('express');
const app = express();
const path = require('path');
const bookRouter = require('./routes/book')
const db = require('./data/database')
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(bookRouter)

db.connectToDatabase().then(function(){
	
	app.listen(3000);
})