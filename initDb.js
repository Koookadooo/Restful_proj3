/*
 * This file contains a simple script to populate the database with initial
 * data from the files in the data/ directory.
 */

const sequelize = require('./lib/sequelize')
const bcrypt = require('bcrypt')
const { Business, BusinessClientFields } = require('./models/business')
const { Photo, PhotoClientFields } = require('./models/photo')
const { Review, ReviewClientFields } = require('./models/review')
const { User, UserClientFields } = require('./models/user')
require('./models/associations')

const businessData = require('./data/businesses.json')
const photoData = require('./data/photos.json')
const reviewData = require('./data/reviews.json')
const userData = require('./data/users.json')

async function hashPasswords(userData) {
  for (const user of userData) {
    const salt = await bcrypt.genSalt(8);
    user.password = await bcrypt.hash(user.password, salt);
  }
}

sequelize.sync({ force: true }).then(async function () {
  try {
    // Preprocess the user data to hash passwords
    await hashPasswords(userData);

    await User.bulkCreate(userData, { fields: UserClientFields });
    await Business.bulkCreate(businessData, { fields: BusinessClientFields });
    await Photo.bulkCreate(photoData, { fields: PhotoClientFields });
    await Review.bulkCreate(reviewData, { fields: ReviewClientFields });

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database: ", error);
  }
});
