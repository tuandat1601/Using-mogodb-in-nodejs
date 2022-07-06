const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
let database;

async function connect(){
	const client = await MongoClient.connect(url);
	database = client.db('books')
}
function getDb(){
	if(!database){
		throw{message:'Database connection not established!'};
	}
	return database;
}
module.exports ={
	connectToDatabase:connect,
	getDb:getDb
}

