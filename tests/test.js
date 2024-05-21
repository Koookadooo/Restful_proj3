require('dotenv').config();
const axios = require('axios');

const apiUrl = 'http://localhost:8000';

const newUser = {
  name: 'New User',
  email: 'newguy@user.io',
  password: 'password',
};

const testUser = {
  id: 2,
  name: 'Tori Lockwood',
  email: 'tori@robnetts.com',
  password: 'hunter2',
};

const adminUser = {
  id: 1,
  name: 'Nick Arzner',
  email: 'nick@block15.com',
  password: 'hunter2',
  admin: true,
};

const newAdminUser = {
  name: 'New Admin',
  email: 'newadmin@example.com',
  password: 'adminpass',
  admin: true,
};

async function createUser(user) {
  try {
    const response = await axios.post(`${apiUrl}/users`, user);
    console.log('User created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.response.data);
  }
}

async function createAdminUser(user, token) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.post(`${apiUrl}/users`, user, { headers });
    console.log('Admin user created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating admin user:', error.response.data);
  }
}

async function loginUser(user) {
  try {
    const response = await axios.post(`${apiUrl}/users/login`, {
      email: user.email,
      password: user.password,
    });
    console.log('User ${user.id} logged in:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Error logging in user:', error.response.data);
  }
}

async function performUserActions(token, userId) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // GET user data
    const userData = await axios.get(`${apiUrl}/users/${userId}`, { headers });
    console.log(`Fetched data for user ${userId}:`, userData.data);

    // GET user's businesses
    const userBusinesses = await axios.get(`${apiUrl}/users/${userId}/businesses`, { headers });
    console.log(`Fetched businesses for user ${userId}:`, userBusinesses.data);

    // GET user's photos
    const userPhotos = await axios.get(`${apiUrl}/users/${userId}/photos`, { headers });
    console.log(`Fetched photos for user ${userId}:`, userPhotos.data);

    // GET user's reviews
    const userReviews = await axios.get(`${apiUrl}/users/${userId}/reviews`, { headers });
    console.log(`Fetched reviews for user ${userId}:`, userReviews.data);
  } catch (error) {
    console.error('Error performing actions:', error.response.data);
  }
}

async function performActions(token, userId) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // POST new business
    const newBusiness = {
      ownerId: userId,
      name: 'New Business',
      address: '123 Main St',
      city: 'Sample City',
      state: 'SC',
      zip: '12345',
      phone: '123-456-7890',
      category: 'Category',
      subcategory: 'Subcategory',
    };
    const createdBusiness = await axios.post(`${apiUrl}/businesses`, newBusiness, { headers });
    console.log(`Created a new business for user ${userId}:`, createdBusiness.data);

    // POST new photo
    const newPhoto = {
      userId: userId,
      caption: 'Sample Photo',
      businessId: createdBusiness.data.id,
    };
    const createdPhoto = await axios.post(`${apiUrl}/photos`, newPhoto, { headers });
    console.log(`Created a new photo for user ${userId}:`, createdPhoto.data);

    // POST new review
    const newReview = {
      userId: userId,
      dollars: 2,
      stars: 5,
      review: 'Excellent!',
      businessId: createdBusiness.data.id,
    };
    const createdReview = await axios.post(`${apiUrl}/reviews`, newReview, { headers });
    console.log(`Created a new review for user ${userId}:`, createdReview.data);

    // PATCH update business
    const updatedBusiness = { name: 'Updated Business' };
    const updatedBusinessResponse = await axios.patch(`${apiUrl}/businesses/${createdBusiness.data.id}`, updatedBusiness, { headers });
    console.log(`Updated a business for user ${userId}:`, updatedBusinessResponse.data);

    // PATCH update photo
    const updatedPhoto = { caption: 'Updated Photo' };
    const updatedPhotoResponse = await axios.patch(`${apiUrl}/photos/${createdPhoto.data.id}`, updatedPhoto, { headers });
    console.log(`Updated a photo for user ${userId}:`, updatedPhotoResponse.data);

    // PATCH update review
    const updatedReview = { review: 'Updated Review' };
    const updatedReviewResponse = await axios.patch(`${apiUrl}/reviews/${createdReview.data.id}`, updatedReview, { headers });
    console.log(`Updated a review for user ${userId}:`, updatedReviewResponse.data);

    // DELETE photo
    const deletedPhoto = await axios.delete(`${apiUrl}/photos/${createdPhoto.data.id}`, { headers });
    console.log(`Deleted a photo for user ${userId}:`, deletedPhoto.data);

    // DELETE review
    const deletedReview = await axios.delete(`${apiUrl}/reviews/${createdReview.data.id}`, { headers });
    console.log(`Deleted a review for user ${userId}:`, deletedReview.data);

    // DELETE business
    const deletedBusiness = await axios.delete(`${apiUrl}/businesses/${createdBusiness.data.id}`, { headers });
    console.log(`Deleted a business for user ${userId}:`, deletedBusiness.data);

  } catch (error) {
    console.error('Error performing actions:', error.response.data);
  }
}

async function runTests() {
  // Create and login new user
  console.log('creating new user');
  await createUser(newUser);
  console.log('logging in new user');
  await loginUser(newUser);

  // Login with test user and perform actions
  console.log('logging in test user');
  const testUserToken = await loginUser(testUser);
  console.log('performing actions as test user with own userId');
  await performUserActions(testUserToken, 2);
  await performActions(testUserToken, 2);

  // Login with admin user
  console.log('logging in admin user');
  const adminUserToken = await loginUser(adminUser);

  // Create new admin user using admin privileges
  console.log('creating new admin user');
  await createAdminUser(newAdminUser, adminUserToken);

  // Login with new admin user and perform actions
  console.log('logging in new admin user');
  const newAdminUserToken = await loginUser(newAdminUser);
  console.log('performing actions as new admin user with different userId')
  await performUserActions(newAdminUserToken, 4); // Use userId 4 to access other user data
}

runTests();
