const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentAdmissionSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true
  },
  admission_no: {
    type: Number,
    required: true,
    unique: true
  },
  student_name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  prgrmcrsmstr_course_id: {
    type: Number,
    required: true
  },
  plus_2_hall_tkt_no: {
    type: String,
    required: false
  },
  primary_phone_no: {
    type: Number,
    required: true
  },
  primary_email_id: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  admission_year: {
    type: Number,
    required: true
  },
  adm_status: {
    type: Number,
    default: 0
  },
  residential_status: {
    type: String,
    required: true
  },
  campus_code: {
    type: Number,
    required: true
  },
  log_timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,  // This will add createdAt and updatedAt fields
  collection: 'student_adm_regs' // Explicitly set the collection name
});

// Add any indexes that might be useful
StudentAdmissionSchema.index({ admission_no: 1 });
StudentAdmissionSchema.index({ admission_year: 1 });
StudentAdmissionSchema.index({ primary_email_id: 1 });

module.exports = (db) => {
  return db.model('StudentAdmission', StudentAdmissionSchema);
};



