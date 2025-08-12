const express = require('express');
const router = express.Router();
const jwt = require('../auth/jwt.middleware');
const rbac = require('../../middlewares/rbac');
const ProjectController = require('./project.controller');
const { validate } = require('../../utils/validator');
const Joi = require('joi');


const createProjectSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().allow('').optional(),
  members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional()
});

const updateProjectSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  description: Joi.string().allow('').optional(),
  members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional()
});

router.use(jwt);


router.post('/', rbac(['admin', 'manager']), validate(createProjectSchema), ProjectController.createProject);


router.get('/:id', ProjectController.getProject);


router.put('/:id', rbac(['admin', 'manager']), validate(updateProjectSchema), ProjectController.updateProject);


router.delete('/:id', rbac(['admin']), ProjectController.deleteProject);


router.get('/', ProjectController.listProjects);

module.exports = router;
