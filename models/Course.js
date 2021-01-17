const mongoose = require('mongoose');
const slugify = require('slugify');

const CourseSchema = new mongoose.Schema({
  slug: String,
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  length: {
    type: Number,
    //required: [true, 'Please provide number of hours']
  },
  averageHoursAllCourses: Number,
  professors: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Professor'    
  }],
});


// Static method to get avg of course tuitions
// statics relates to this model
CourseSchema.statics.getAverageLength = async function() {
  const obj = await this.aggregate([    
    {
      $group: {
        _id: '$hours',
        averageHoursAllCourses: { $avg: '$length' }
      }
    }
  ]);
}
  

// Call getAverageLength after save
CourseSchema.post('save', function() {
  this.constructor.getAverageLength();  
});

// Call getAverageLength before remove
CourseSchema.pre('remove', function() {
  this.constructor.getAverageLength();
});

//adding slug field's value to db, made from name field
CourseSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
module.exports = mongoose.model('Course', CourseSchema);

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