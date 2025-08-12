const mongoose = require('mongoose');
const config = require('./index');

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

module.exports = mongoose;
