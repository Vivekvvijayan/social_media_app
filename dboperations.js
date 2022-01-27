const mongodb = require('./db');
var bcrypt = require('bcrypt');


module.exports={

        doSignup: function({ email,password }){

            return new Promise(function(resolve,reject){


                    try{

                        
                        mongodb.getDb().collection('signup').insertOne({email,password},function(err,result){
                    if(err) reject(err)
                   resolve(result)
                    
                })
            }catch(err){
                console.log(err);
            }
        })

            

        },

        checkUserExistance:function(email){
                
                return new Promise(function(resolve,reject){
    
                    try{
                        mongodb.getDb().collection('signup').findOne({email:email},function(err,result){
                            if(err) reject(err)
                            resolve(result)
                        })
                    }catch(err){
                        console.log(err);
                    }
                })
        },

        doSignin:function({ userEmail,userPassword }){

                return new Promise((resolve,reject)=>{

                    try{

                        mongodb.getDb().collection('signup').findOne({email:userEmail},function(err,result){
                            if(err) reject(err)
                            

                            if(result){
                                bcrypt.compare(userPassword,result.password,function(err,result){
                                    if(err) reject(err)
                                    resolve(result);
                                })
                            }
                            else{
                                resolve(false);
                            }

                        })
                    }catch(err){
                        console.log('Signin Error',err);
                    }

                })

        }



}