const { User, Store, Rating } = require('../models');
const jwt = require('jsonwebtoken');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ 
        model: Store, 
        as: 'managedStore',
        include: [{ model: Rating }]
      }]
    });
    
    const usersWithStoreStats = users.map(user => {
      const userData = user.toJSON();
      if (userData.managedStore && userData.managedStore.Ratings) {
        const ratings = userData.managedStore.Ratings;
        const avgRating = ratings.length > 0 
          ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length 
          : 0;
        userData.managedStore.avgRating = avgRating;
      }
      return userData;
    });

    res.json(usersWithStoreStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    const user = await User.create({ name, email, password, address, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [{ model: Rating }]
    });
    
    const storesWithRating = stores.map(store => {
      const avgRating = store.Ratings.length > 0 
        ? store.Ratings.reduce((acc, curr) => acc + curr.rating, 0) / store.Ratings.length 
        : 0;
      return {
        ...store.toJSON(),
        avgRating
      };
    });
    
    res.json(storesWithRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addStore = async (req, res) => {
  const { name, email, address, ownerEmail, image } = req.body;
  try {
    let ownerId = null;
    if (ownerEmail) {
      const owner = await User.findOne({ where: { email: ownerEmail, role: 'owner' } });
      if (owner) ownerId = owner.id;
    }
    const store = await Store.create({ name, email, address, ownerId, image });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.impersonateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
