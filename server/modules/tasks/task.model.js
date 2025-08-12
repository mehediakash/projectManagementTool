const mongoose = require('mongoose');

const dependencySchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  type: { type: String, enum: ['blocks','blocked_by','related'], default: 'related' }
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, index: 'text' },
  description: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  priority: { type: Number, default: 3 }, // 1 highest - 5 lowest
  status: { type: String, enum: ['todo','in_progress','done','blocked'], default: 'todo' },
  dueDate: Date,
  estimatedHours: Number,
  dependencies: [dependencySchema],
  meta: {}
}, { timestamps: true });

taskSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Task', taskSchema);
