const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');

exports.getStores = async (req, res) => {
  const { search } = req.query;
  const where = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } }
    ];
  }
  try {
    const stores = await Store.findAll({
      where,
      include: [{ model: Rating }]
    });

    const storesWithRating = stores.map(store => {
      const avgRating = store.Ratings.length > 0
        ? store.Ratings.reduce((acc, curr) => acc + curr.rating, 0) / store.Ratings.length
        : 0;
      const userRating = store.Ratings.find(r => r.userId === req.user.id)?.rating || 0;
      return {
        ...store.toJSON(),
        avgRating,
        userRating
      };
    });

    res.json(storesWithRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitRating = async (req, res) => {
  const { storeId, rating } = req.body;
  try {
    let ratingRecord = await Rating.findOne({
      where: { userId: req.user.id, storeId }
    });

    if (ratingRecord) {
      ratingRecord.rating = rating;
      await ratingRecord.save();
    } else {
      ratingRecord = await Rating.create({
        userId: req.user.id,
        storeId,
        rating
      });
    }
    res.json(ratingRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
