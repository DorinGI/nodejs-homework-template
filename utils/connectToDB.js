const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const db_url = process.env.DB_URL;
//console.log('Database URL:', db_url);

async function connectToDB() {
  try {
    await mongoose.connect(db_url);
    console.log('Database connection successful');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = connectToDB;
