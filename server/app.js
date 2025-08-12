const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');
const db = require('./config/db');
const redisClient = require('./config/redis');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');


const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const projectRoutes = require('./modules/projects/project.routes');
const taskRoutes = require('./modules/tasks/task.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);

app.use(errorHandler);

module.exports = app;
