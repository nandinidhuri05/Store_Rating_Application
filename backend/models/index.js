const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// User - Store (Owner)
User.hasOne(Store, { foreignKey: 'ownerId', as: 'managedStore' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// User - Rating
User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

// Store - Rating
Store.hasMany(Rating, { foreignKey: 'storeId' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

module.exports = { User, Store, Rating };
