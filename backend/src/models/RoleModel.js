const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rolesSchema = new Schema({
    roleName: {
        type: String,
        required: false,
    },
    permissions: {
        type: Array,
        required: false,
    },
    updatedAt: {
        type: Date,
        required: false
    },
  },{timestamps:{type:Date,default:new Date().toISOString()}});
  
  module.exports = mongoose.model('roles', rolesSchema, 'roles');
  