const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')

const Business = sequelize.define('business', {
  id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING(2), allowNull: false },
  zip: { type: DataTypes.STRING(5), allowNull: false },
  phone: { type: DataTypes.STRING(12), allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  subcategory: { type: DataTypes.STRING, allowNull: false },
  website: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true }
})

exports.Business = Business

/*
 * Export an array containing the names of fields the client is allowed to set
 * on businesses.
 */
exports.BusinessClientFields = [
  'ownerId',
  'name',
  'address',
  'city',
  'state',
  'zip',
  'phone',
  'category',
  'subcategory',
  'website',
  'email'
]
