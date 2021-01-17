const express = require('express');
const { getProfessors, getProfessor, addProfessor, updateProfessor, deleteProfessor, addProfessorToCourse } = require('../controllers/professors');
const { getCourses } = require('../controllers/courses');
//const courseRouter = require('./courses')
const Professor = require('../models/Professor');


//if this route is continuation of another route (here professors/professorId/...)
const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

// Re-route into other resource routers if this route encountered
//router.use('/:professorId/courses', courseRouter);


//special route:  ... /courses/courseId/professors  (many to many)
router.route('/:professorId/courses').get(getCourses)
router.route('/addProfessorToCourse').post(addProfessorToCourse)
//advancedResults(model, populate)
router.route('/').get(advancedResults(Professor, 'courses'), getProfessors).post(addProfessor)
router.route('/:professorId').get(getProfessor).put(updateProfessor).delete(deleteProfessor)

  



module.exports = router;
