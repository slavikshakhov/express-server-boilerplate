const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Professor = require('../models/Professor');

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {  
  if(req.params.professorId){
    const professor = await Professor.findById(req.params.professorId).populate('courses', '-professors -_id -__v')
    
    return res.status(200).json({
      success: true,     
      data: professor.courses,
      professorId: req.params.professorId    
    });
  } else {
    res.status(200).json(res.advancedResults);
  }  
});



// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const {courseId} = req.params
  const course = await Course.findById(courseId)

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${courseId}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  
  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const {courseId} = req.params
  let course = await Course.findById(courseId);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${courseId}`),
      404
    );
  }

 

  course = await Course.findByIdAndUpdate(courseId, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const {courseId} = req.params
  const course = await Course.findById(courseId);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${courseId}`),
      404
    );
  }
  

  await course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

/*
if w/o asyn-awayt handler (see middleware/async.js):

catch(err) {
  next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
}
*/