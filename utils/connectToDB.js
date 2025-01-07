const mongoose = require('mongoose');

async function connectToDB() {
  try {
    await mongoose.connect(
      'mongodb+srv://dorinelghimis:T9jUlMU7b90fkw3C@cluster0.zelci.mongodb.net/db-contacts'
    );
    console.log('Database connection successful');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = connectToDB;
