const Order = require('../models/Order');
const Vehicle = require('../models/Vehicle');
const Joi = require('joi');

const orderSchema = Joi.object({
  dealerId: Joi.string().required(),
  customerName: Joi.string().required(),
  vehicleSku: Joi.string().required(),
  qty: Joi.number().min(1).required(),
  totalPrice: Joi.number().min(0).required(),
  status: Joi.string().valid('Pending', 'Processing', 'Delivered', 'Cancelled')
});

// ➕ CREATE
exports.create = async (req, res, next) => {
  try {
    const payload = await orderSchema.validateAsync(req.body);
    const vehicle = await Vehicle.findOne({ sku: payload.vehicleSku });
    if (!vehicle) return res.status(400).json({ error: 'Vehicle not found' });
    if (vehicle.stock < payload.qty) return res.status(400).json({ error: 'Not enough stock' });

    vehicle.stock -= payload.qty;
    await vehicle.save();

    const o = new Order(payload);
    await o.save();
    res.status(201).json(o);
  } catch (err) {
    next(err);
  }
};

// 📋 LIST
exports.list = async (req, res, next) => {
  try {
    const { status, dealerId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (dealerId) filter.dealerId = dealerId;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Order.find(filter).skip(skip).limit(limit),
      Order.countDocuments(filter)
    ]);
    res.json({ total, page, data: items });
  } catch (err) {
    next(err);
  }
};

// 🔍 GET
exports.get = async (req, res, next) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ error: 'Order not found' });
    res.json(o);
  } catch (err) {
    next(err);
  }
};

// ✏️ UPDATE
exports.update = async (req, res, next) => {
  try {
    const payload = await orderSchema.validateAsync(req.body);
    const o = await Order.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!o) return res.status(404).json({ error: 'Order not found' });
    res.json(o);
  } catch (err) {
    next(err);
  }
};

// ❌ DELETE
exports.remove = async (req, res, next) => {
  try {
    const o = await Order.findByIdAndDelete(req.params.id);
    if (!o) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
