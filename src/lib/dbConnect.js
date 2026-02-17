const Task = require('../models/Task');

module.exports = async function dbConnect() {
  try {
    // Use the sequelize instance attached to the model
    const sequelize = Task.sequelize;
    await sequelize.authenticate();
    await sequelize.sync();
    return sequelize;
  } catch (err) {
    console.error('dbConnect error:', err);
    throw err;
  }
};
