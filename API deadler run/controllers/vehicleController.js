const Vehicle = require('../models/Vehicle');
const Joi = require('joi');

const vehicleSchema = Joi.object({
  sku: Joi.string().required(),
  model: Joi.string().required(),
  version: Joi.string().allow(''),
  color: Joi.string().allow(''),
  price: Joi.number().min(0).required(),
  specs: Joi.any(),
  stock: Joi.number().min(0)
});

// ➕ CREATE
exports.create = async (req, res, next) => {
  try {
    const payload = await vehicleSchema.validateAsync(req.body);
    const v = new Vehicle(payload);
    await v.save();
    res.status(201).json(v);
  } catch (err) {
    next(err);
  }
};

// 📋 READ (List)
exports.list = async (req, res, next) => {
  try {
    const { q, model, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (q) filter.$or = [{ sku: new RegExp(q, 'i') }, { model: new RegExp(q, 'i') }];
    if (model) filter.model = model;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Vehicle.find(filter).skip(skip).limit(limit),
      Vehicle.countDocuments(filter)
    ]);
    res.json({ total, page, data: items });
  } catch (err) {
    next(err);
  }
};

// 🔍 READ (Single)
exports.get = async (req, res, next) => {
  try {
    const v = await Vehicle.findById(req.params.id);
    if (!v) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(v);
  } catch (err) {
    next(err);
  }
};

// ✏️ UPDATE
exports.update = async (req, res, next) => {
  try {
    const payload = await vehicleSchema.validateAsync(req.body);
    const v = await Vehicle.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!v) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(v);
  } catch (err) {
    next(err);
  }
};

// ❌ DELETE
exports.remove = async (req, res, next) => {
  try {
    const v = await Vehicle.findByIdAndDelete(req.params.id);
    if (!v) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
