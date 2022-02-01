const mongodb = require('mongodb').MongoClient;

var  db;
// const url = 'mongodb://localhost:27017/'
const url = 'mongodb+srv://vivekvvijayan:t5hTtDeA5QB1wdBv@cluster0.jy9fb.mongodb.net/social_app?retryWrites=true&w=majority'



module.exports.connect = function(callback){
  mongodb.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true } ,function(err,database){
    if(err) return callback(err);

    // db = database.db('contentwriters-blog');
    db = database.db('contentwriters-blog');
    
    callback(null);

   
  });
}
module.exports.getDb = function(){

    return db;

}