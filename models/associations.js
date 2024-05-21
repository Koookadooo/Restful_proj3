const { User } = require('./user');
const { Business } = require('./business');
const { Photo } = require('./photo');
const { Review } = require('./review');

// User and Business
User.hasMany(Business, { foreignKey: { allowNull: false, name: 'ownerId' } });
Business.belongsTo(User, { foreignKey: 'ownerId' });

// User and Photo
User.hasMany(Photo, { foreignKey: { allowNull: false, name: 'userId' } });
Photo.belongsTo(User, { foreignKey: 'userId' });

// User and Review
User.hasMany(Review, { foreignKey: { allowNull: false, name: 'userId' } });
Review.belongsTo(User, { foreignKey: 'userId' });

// Business and Photo
Business.hasMany(Photo, { foreignKey: { allowNull: false, name: 'businessId' } });
Photo.belongsTo(Business, { foreignKey: 'businessId' });

// Business and Review
Business.hasMany(Review, { foreignKey: { allowNull: false, name: 'businessId' } });
Review.belongsTo(Business, { foreignKey: 'businessId' });
