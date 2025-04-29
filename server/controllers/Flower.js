const models = require('../models');
const Flower = models.Flower;

const gardenPage = async (req, res) => {
  return res.render('app');
};

const plantFlower = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Flower name is required' });
  }

  const flowerData = {
    name: req.body.name,
    progress: 0,
    owner: req.session.account._id,
  };

  try {
    const newFlower = new Flower(flowerData);
    await newFlower.save();
    return res.status(201).json(Flower.toAPI(newFlower));
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Flower with this name already exists' });
    }
    return res.status(500).json({ error: 'An error occurred while planting flower' });
  }
};

const getFlowers = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Flower.find(query).select('name progress isBloomed _id').lean().exec();

    const apiFlowers = docs.map(doc => Flower.toAPI(doc));

    return res.json({ flowers: apiFlowers });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving flowers!' });
  }
};

const waterFlower = async (req, res) => {
  try {
    const flower = await Flower.findOne({
      _id: req.params.id,
      owner: req.session.account._id,
    }).exec();

    if (!flower) {
      return res.status(404).json({ error: 'Flower not found' });
    }

    if (flower.progress >= 5) {
      return res.status(400).json({ error: 'This flower is fully grown!' });
    }

    flower.progress += 1;
    if (flower.progress === 5) {
      flower.isBloomed = true;
    }

    await flower.save();
    return res.json(Flower.toAPI(flower));
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error watering flower!' });
  }
};

module.exports = {
  gardenPage,
  plantFlower,
  getFlowers,
  waterFlower,
};
