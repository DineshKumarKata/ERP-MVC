const mongoose = require("../dao/MongooseConfig").mongoose;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/, 
    },
    profilePic: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        ref: 'FormModel'
    },
    password: {
        type: String,
        required: true
    },
    lastLoginAt: {
        type: Date,
        required: false
    },
    lastModifiedAt: {
        type: Date,
        required: false
    },
    roleId:{
        type:ObjectId,
        required:true
    },
},{timestamps:{type:Date,default:new Date().toISOString()}});

module.exports = mongoose.model('users', UserSchema, 'users');