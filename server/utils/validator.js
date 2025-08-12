const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().allow(''),
  project: Joi.string().required(),
  priority: Joi.number().integer().min(1).max(5),
  dueDate: Joi.date().optional(),
});

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
  };
}

module.exports = { validate, createTaskSchema };
