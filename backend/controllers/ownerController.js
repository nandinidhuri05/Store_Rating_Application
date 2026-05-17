const { Store, Rating, User } = require('../models');

exports.getStoreStats = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { ownerId: req.user.id },
      include: [{
        model: Rating,
        include: [{ model: User, attributes: ['name', 'email'] }]
      }]
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found for this owner' });
    }

    const avgRating = store.Ratings.length > 0
      ? store.Ratings.reduce((acc, curr) => acc + curr.rating, 0) / store.Ratings.length
      : 0;

    res.json({
      storeName: store.name,
      avgRating,
      ratings: store.Ratings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
