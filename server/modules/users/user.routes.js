const express = require('express');
const router = express.Router();
const jwt = require('../auth/jwt.middleware');
const rbac = require('../../middlewares/rbac');
const UserController = require('./user.controller');
const { validate } = require('../../utils/validator');
const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid('admin','manager','member','viewer').optional(),
  skills: Joi.array().items(Joi.string()).optional()
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  role: Joi.string().valid('admin','manager','member','viewer').optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  availability: Joi.number().integer().min(0).optional()
});


router.post('/', jwt, rbac(['admin','manager']), validate(createUserSchema), UserController.createUser);


router.get('/:id', jwt, UserController.getUser);


router.put('/:id', jwt, UserController.updateUser);


router.delete('/:id', jwt, rbac(['admin']), UserController.deleteUser);


router.get('/', jwt, rbac(['admin','manager']), UserController.listUsers);

module.exports = router;
