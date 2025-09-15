const mongoose = require('mongoose');

const signupschema = new mongoose.Schema({
    username: String,
    email: {type: String, unique: true},
    password: String,
});

const User = mongoose.model('User', signupschema);

const dataschema =new mongoose.Schema({
    state:String,
    district:String,
    N:Number,
    P:Number,
    K:Number,
    ph:Number
})
const Data = mongoose.model("data" ,dataschema)

module.exports = {
    User,
    Data
}
