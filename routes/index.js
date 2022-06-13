const express = require('express');
const router = express.Router();
const User = require('../models').User;
const Course = require('../models').Course;
const { authenticateUsers } = require('../middleware/auth-user');
const { asyncHandler } = require('../middleware/async-handler');



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
    await User.create(req.body);
    res.status(201).location('/').end();
}))

// GET COURSES 200 return all courses including associated users
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt"
        ]
      },
      include: [
        {
          model: User,
          as: "Users",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password"
            ]
          },
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
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt"
        ]
      },
      include: [
        {
          model: User,
          as: "Users",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password"
            ]
          },
        }
      ]
    });
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).end();
    }
}))

// POST COURSES 201 create a new course
router.post('/courses', authenticateUsers, asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    res.status(201).location(`/courses/${course.id}`).end();
}))

// PUT COURSES ID 204 update specific course
router.put('/courses/:id', authenticateUsers, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);
    if (course) {
      if (user.id == course.userId) {
        const newCourse = req.body;
        if (newCourse) {
          await course.update(req.body);
          res.status(204).end();
        } else {
          res.status(400).end();
        }
        
      } else {
        res.status(403).end();
      }
    } else {
      res.status(404).end();
    }
}))

// DELETE COURSES ID 204 delete specific course
router.delete('/courses/:id', authenticateUsers, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  const course = await Course.findByPk(req.params.id);
  if (course) {
    if (user.id == course.userId) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(403).end();
    }
  } else {
    res.status(404).end();
  }
}))


module.exports = router;