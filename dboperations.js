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
                                bcrypt.compare(userPassword,result.password,function(err,bcryptOutput){
                                    if(err) reject(err)
                                    if(bcryptOutput){
                                    resolve(result);
                                    }
                                    else{
                                        reject('Invalid password')
                                    }
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

        },

        createProfile:function(profileDetails){

            return new Promise((resolve,reject)=>{

                try{

                    mongodb.getDb().collection('profiles').insertOne(profileDetails,function(err,result){
                        if(err) reject(err)
                        resolve(result)
                    })
                }catch(err){
                    console.log(err);
                }

            })



        },

        getUserProfile:function(userEmail){

            return new Promise((resolve,reject)=>{

                try{

                    mongodb.getDb().collection('profiles').findOne({email:userEmail},function(err,result){
                        if(err) reject(err)
                        resolve(result)
                    })
                }catch(err){
                    console.log(err);
                }

            })



        },

        checkProfileExistance:function(userEmail){


            return new Promise((resolve,reject)=>{

                try{

                    mongodb.getDb().collection('profiles').findOne({email:userEmail},function(err,result){
                        if(err) reject(err)
                        resolve(result)
                    })
                }catch(err){
                    console.log(err);
                }

            })
        },
        uploadPost:function(postDetails){

            return new Promise((resolve,reject)=>{

                try{

                    mongodb.getDb().collection('posts').insertOne(postDetails,function(err,result){
                        if(err) reject(err)
                        resolve(result)
                    })
                }catch(err){
                    console.log(err);
                }

            })

        },
        getAllPosts:function(){
                
                return new Promise((resolve,reject)=>{
    
                    try{
    
                        mongodb.getDb().collection('posts').find().sort({_id:-1}).toArray(function(err,result){
                            if(err) reject(err)
                            resolve(result)
                        })
                    }catch(err){
                        console.log(err);
                    }
    
                })
                
    
        },
        fetchProfile:function(userEmail){
                    
                    return new Promise((resolve,reject)=>{
        
                        try{
        
                            mongodb.getDb().collection('profiles').findOne({email:userEmail},function(err,result){
                                if(err) reject(err)
                                resolve(result)
                            })
                        }catch(err){
                            console.log(err);
                        }
        
                    })
                    
        
        },

        updateUserProfile:function(userEmail,profileDetails){

            return new Promise((resolve,reject)=>{

                try{



                    mongodb.getDb().collection('profiles').updateOne({email:userEmail},{$set:{username:profileDetails.new_user_name,profile_image:profileDetails.new_profile_picture}},function(err,result){

                        mongodb.getDb().collection('posts').updateMany({email:userEmail},{$set:{user_name:profileDetails.new_user_name,accound_profile_image
                            :profileDetails.new_profile_picture}},function(err,result){


                            
                            if(err) reject(err)
                            
                            resolve(result)
                        })
                    })
                    }catch(err){
                        console.log(err);
                    }

                    
                    
            })

        },

        deleteUser:function(userEmail){

            return new Promise((resolve,reject)=>{

                try{

                    mongodb.getDb().collection('signup').deleteOne({email:userEmail},function(err,result){
                        if(err) reject(err)
                        resolve(result)
                    })
                }catch(err){
                    console.log(err);
                }

            })

                        
        }



}