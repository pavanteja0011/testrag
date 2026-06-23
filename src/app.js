const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/projects',      require('./routes/projects'));
app.use('/api/tasks',         require('./routes/tasks'));
app.use('/api/tasks/:taskId/comments', require('./routes/comments'));
app.use('/api/notifications', require('./routes/notifications'));

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT || 4000, () => console.log('TaskFlow API running'));
});

module.exports = app;
