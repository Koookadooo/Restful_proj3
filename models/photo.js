const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')

const Photo = sequelize.define('photo', {
  id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  caption: { type: DataTypes.STRING, allowNull: true },
  businessId: { type: DataTypes.INTEGER, allowNull: false }
})


exports.Photo = Photo
exports.PhotoClientFields = [
  'userId',
  'caption',
  'businessId'
]
