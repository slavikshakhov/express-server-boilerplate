const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Professor = require('../models/Professor');
const Course = require('../models/Course');

// @desc      Get Professors
// @route     GET /api/v1/Professors
// @route     GET /api/v1/courses/:courseId/Professors
// @access    Public
exports.getProfessors = asyncHandler(async (req, res, next) => {
 
  if(req.params.courseId){
    const course = await Course.findById(req.params.courseId).populate('professors', '-courses -_id -__v')
    //const professors = await Professor.find({courses: req.params.courseId})
    
    return res.status(200).json({        
      data: course.professors
    });
  } else {
    res.status(200).json(res.advancedResults);
  }  
});



// @desc      Get single Professor
// @route     GET /api/v1/Professors/:id
// @access    Public
exports.getProfessor = asyncHandler(async (req, res, next) => {
  const Professor = await Professor.findById(req.params.id).populate({
    path: 'course',
    select: 'name description'
  });

  if (!Professor) {
    return next(
      new ErrorResponse(`No Professor with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: Professor
  });
});



// @desc      Create new Professor
// @route     POST / api/professors
// @access    Private

exports.addProfessor = asyncHandler(async (req, res, next) => {  

  const professor = await Professor.create(req.body);

  res.status(200).json({
    success: true,
    data: professor
  });
});


// @desc      Add Professor to existing course
// @route     POST /api/addProfessorToCourse
// @access    Private
exports.addProfessorToCourse = asyncHandler(async (req, res, next) => {
  const {courseId, professorId} = req.body
 
  const course = await Course.findById(courseId);
  const professor = await Professor.findById(professorId)

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.courseId}`),
      404
    );
  }  
  professor.courses.push(course)
  course.professors.push(professor)
  await professor.save()
  await course.save()
  
  
  res.status(200).json({
    success: true    
  });
});


// @desc      Update Professor
// @route     PUT /api/professors/:id
// @access    Private
exports.updateProfessor = asyncHandler(async (req, res, next) => {
  const {professorId} = req.params
  let professor = await Professor.findById(professorId); 

  if (!professor) {
    return next(
      new ErrorResponse(`No Professor with the id of ${professorId}`),
      404
    );
  }


  professor = await Professor.findByIdAndUpdate(professorId, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: professor
  });
});

// @desc      Delete Professor
// @route     DELETE /api/professors/:id
// @access    Private
exports.deleteProfessor = asyncHandler(async (req, res, next) => {
  const {professorId} = req.params
  const professor = await Professor.findById(professorId);

  if (!professor) {
    return next(
      new ErrorResponse(`No Professor with the id of ${professorId}`),
      404
    );
  }  

  /* ????? remove this professor from associated courses (courses -- course --professors[])
  const courses = await Course.find()  
  courses.map(async (course) => {
    await course.update(
            { "professors": professorId },
            { "$pull": { "professors": professorId} }
        )
  })
  

//await campSchema.Campaign.remove({ "_id": { "$in": product.campaign } })
*/
 
  await professor.remove();

  res.status(200).json({
    success: true,
    data: {}
  });  
});
