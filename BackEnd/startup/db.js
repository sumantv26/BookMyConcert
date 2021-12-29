const mongoose = require('mongoose');
const config = require('config');
module.exports=()=>{
    mongoose.connect("mongodb://127.0.0.1/bookmyconcert")
    .then(()=>console.log(`Database is connected to ${config.get("db")}`))
    .catch(()=>console.log('could not connect to db'))
}