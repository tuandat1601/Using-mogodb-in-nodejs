const express = require('express');
const db = require('../data/database');
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;
const router = express.Router();
router.get('/', async (req, res) => {
	res.render('books')
})
router.get('/All-book', async (req, res) => {
	const books = await db.getDb().collection('posts').find({}, { title: 1, summary: 1, 'author.name': 1 }).toArray();
	res.render('all-book', { books: books })
})
router.get('/Create-book', async (req, res) => {
	const authors = await db.getDb().collection('authors').find().toArray();
	res.render('create-book', { authors: authors })
})
router.post('/books', async (req, res) => {
	const authorId = new ObjectId(req.body.author);

	const author = await db.getDb().collection('authors').findOne({ _id: authorId })
	console.log(author)
	const newBook = {
		title: req.body.title,
		summary: req.body.summary,
		body: req.body.content,
		date: req.body.datetime,
		author: {
			id: authorId,
			name: author.name,
			email: author.email
		}
	}
	console.log(newBook)
	const result = await db.getDb().collection('posts').insertOne(newBook);
	res.redirect('/')
})
router.get('/All-book/:id', async (req, res) => {
	const bookId = req.params.id;
	const book = await db.getDb().collection('posts')
	.findOne({ _id:new ObjectId(bookId) }, { summary: 0 });
	if (!book) {
		return res.status(404).render('404')
	}
	else {
		res.render('book-detail', { book: book })
	}

})
router.get('/All-book/:id/edit',async (req,res)=>{
	const bookId = req.params.id;
	const authors = await db.getDb().collection('authors').find().toArray();
	const book = await db.getDb()
	.collection('posts')
	.findOne({_id:new ObjectId(bookId)});
	if(!book&&!authors){
		return res.status(404).render('404')
	}
	res.render('update-book', { book: book, authors:authors })
	
	
})
router.post('/All-book/:id/edit',async (req,res)=>{
	const bookId = req.params.id;
	const result = await db.getDb().collection('posts').updateOne({_id:new ObjectId(bookId)},{
		$set:{
			title:req.body.title,
			summary:req.body.summary,
			body:req.body.content,
			date:req.body.datetime,
		}
	})
	res.redirect('/')
})
router.post('/All-book/:id/delete',async (req,res)=>{
	const bookId = req.params.id;
	const book = await db.getDb().collection('posts').deleteOne({_id:new ObjectId(bookId)});
	res.redirect('/All-book')
})
module.exports = router