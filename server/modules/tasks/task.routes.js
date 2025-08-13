const express = require('express');
const router = express.Router();
const taskController = require('./task.controller');
const jwt = require('../auth/jwt.middleware');
const rbac = require('../../middlewares/rbac');

router.use(jwt);

router.post('/', rbac(['admin','manager','member']), taskController.createTask);
router.get('/all', taskController.listAllTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', rbac(['admin','manager','member']), taskController.updateTask);
router.delete('/:id', rbac(['admin','manager']), taskController.deleteTask);
router.get('/', rbac(['admin','manager','member']), taskController.listTasks);
router.post('/:id/assign', rbac(['admin','manager']), taskController.assignTask);

module.exports = router;
