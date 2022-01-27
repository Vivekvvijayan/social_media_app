const mongodb = require('mongodb').MongoClient;

var  db;
const url = 'mongodb://localhost:27017/'

module.exports.connect = function(callback){
  mongodb.connect(url,function(err,database){
    if(err) return callback(err);

    db = database.db('contentwriters-blog');

    callback();

   
  });
}
module.exports.getDb = function(){

    return db;

}