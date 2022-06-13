const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models').User;
const Course = require('../models').Course;
const { authenticateUsers } = require('../middleware/auth-user');

// HELPER FUNCTION
function asyncHandler(cb){
    return async (req, res, next)=>{
      try {
        await cb(req,res, next);
      } catch(err){
        if (err.name === 'SequelizeValidationError'|| err.name === "SequelizeUniqueConstraintError") {
          const validationErrors = err.errors.map(err => err.message)
          res.status(400).json({validationErrors});
        } else {
          next(err);
        }
      }
    };
}

// GET USERS 200 return all data for current user
router.get('/users', authenticateUsers, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    })
}))

// POST USERS 201 create a new user
router.post('/users', asyncHandler(async (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    await User.create(user);
    res.sendStatus(201);
}))

// GET COURSES 200 return all courses including associated users
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: "Users"
        }
      ]
    });
    res.status(200).json(courses);
}))

// GET COURSES ID 200 return specific course
router.get('/courses/:id', asyncHandler(async (req, res) => {
    /* const course = await Course.findByPk(req.params.id); */
    const course = await Course.findAll({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: User,
          as: "Users"
        }
      ]
    });
    if (course) {
      res.status(200).json(course);
    } else {
      res.sendStatus(404);
    }
}))

// POST COURSES 201 create a new course
router.post('/courses', authenticateUsers, asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    res.status(201).end();
}))

// PUT COURSES ID 204 update specific course
router.put('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      await course.update(req.body);
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
}))

// DELETE COURSES ID 204 delete specific course
router.delete('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (course) {
    await course.destroy();
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
}))

module.exports = router;