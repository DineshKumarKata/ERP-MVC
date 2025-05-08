const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
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
  },
  program: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
},{timestamps:{type:Date,default:new Date().toISOString()}});

module.exports = mongoose.model('students', studentSchema, 'students');