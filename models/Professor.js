const mongoose = require('mongoose');
const slugify = require('slugify');

const ProfessorSchema = new mongoose.Schema({
  slug: String,
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add Profer name']
  },
  courses: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Course'    
  }],
});


//adding slug field's value to db, made from name field
ProfessorSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
module.exports = mongoose.model('Professor', ProfessorSchema);

/*
weeks: {
    type: String,
    required: [true, 'Please add number of weeks']
  },  
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }  
*/