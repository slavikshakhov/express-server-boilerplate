const express = require('express')
const router = express.Router();
const Course = require('../models/Course')
const Professor = require('../models/Professor');
//const professorRouter = require('./professors')
const { protect } = require('../middleware/auth');



//middleware for getting all els
const advancedResults = require('../middleware/advancedResults');

const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courses')
const { getProfessors } = require('../controllers/professors')
// Re-route into other resource routers if this route encountered
//router.use('/:courseId/professors', professorRouter);


//special route:  ... /courses/courseId/professors  (many to many)
router.route('/:courseId/professors').get(getProfessors)
//advancedResults(model, populate)
router.route('/').get(advancedResults(Course, 'professors'), protect, getCourses).post(addCourse)


router.route('/:courseId').get(getCourse).put(updateCourse).delete(deleteCourse)

module.exports = router
