// Simple database connection function for JSON storage
module.exports = async function dbConnect() {
  // No connection needed for JSON file storage
  // This function exists for compatibility with existing code
  return Promise.resolve();
};
