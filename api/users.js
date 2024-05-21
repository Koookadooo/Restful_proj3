const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { Business } = require('../models/business');
const { Review } = require('../models/review'); 
const { Photo } = require('../models/photo'); 
const { checkAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, password, admin } = req.body;

    // Check if the email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ error: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the request is from an admin
    if (admin) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send({ error: 'Missing authorization header' });
      }
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.admin) {
          return res.status(403).send({ error: 'Admin access required' });
        }
      } catch (err) {
        return res.status(401).send({ error: 'Invalid token' });
      }
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      admin: admin || false
    });

    res.status(201).send({ id: user.id });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({ error: 'Invalid email or password' });
  }

  console.log('user id:', user.id);
  console.log('user admin:', user.admin);

  const token = jwt.sign({ id: user.id, admin: user.admin }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.send({ token });
});

router.get('/:userId', checkAuth, async (req, res, next) => {
  if (req.user.id !== parseInt(req.params.userId) && !req.user.admin) {
    return res.status(403).send({ error: 'Unauthorized access' });
  }
  const user = await User.findByPk(req.params.userId, { attributes: { exclude: ['password'] } });
  if (user) {
    res.send(user);
  } else {
    next();
  }
});

/*
 * Route to list all of a user's businesses.
 */
router.get('/:userId/businesses', checkAuth, async function (req, res) {
  const userId = req.params.userId
  const userBusinesses = await Business.findAll({ where: { ownerId: userId }})
  res.status(200).json({
    businesses: userBusinesses
  })
})

/*
 * Route to list all of a user's reviews.
 */
router.get('/:userId/reviews', checkAuth, async function (req, res) {
  const userId = req.params.userId
  const userReviews = await Review.findAll({ where: { userId: userId }})
  res.status(200).json({
    reviews: userReviews
  })
})

/*
 * Route to list all of a user's photos.
 */
router.get('/:userId/photos', checkAuth, async function (req, res) {
  const userId = req.params.userId
  const userPhotos = await Photo.findAll({ where: { userId: userId }})
  res.status(200).json({
    photos: userPhotos
  })
})

module.exports = router
