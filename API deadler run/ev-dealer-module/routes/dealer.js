const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const vehicleCtrl = require('../controllers/vehicleController');
const orderCtrl = require('../controllers/orderController');
const contractCtrl = require('../controllers/contractController');

// VEHICLES
router.post('/vehicles', auth(['DealerManager','Admin']), vehicleCtrl.create);
router.get('/vehicles', auth(['DealerStaff','DealerManager','Admin']), vehicleCtrl.list);
router.get('/vehicles/:id', auth(['DealerStaff','DealerManager','Admin']), vehicleCtrl.get);
router.put('/vehicles/:id', auth(['DealerManager','Admin']), vehicleCtrl.update);
router.delete('/vehicles/:id', auth(['DealerManager','Admin']), vehicleCtrl.remove);

// ORDERS
router.post('/orders', auth(['DealerStaff','DealerManager']), orderCtrl.create);
router.get('/orders', auth(['DealerStaff','DealerManager','Admin']), orderCtrl.list);
router.get('/orders/:id', auth(['DealerStaff','DealerManager','Admin']), orderCtrl.get);
router.put('/orders/:id', auth(['DealerManager','Admin']), orderCtrl.update);
router.delete('/orders/:id', auth(['DealerManager','Admin']), orderCtrl.remove);

// CONTRACTS
router.post('/contracts', auth(['DealerManager','Admin']), contractCtrl.create);
router.get('/contracts', auth(['DealerManager','Admin']), contractCtrl.list);
router.get('/contracts/:id', auth(['DealerManager','Admin']), contractCtrl.get);
router.put('/contracts/:id', auth(['DealerManager','Admin']), contractCtrl.update);
router.delete('/contracts/:id', auth(['DealerManager','Admin']), contractCtrl.remove);

module.exports = router;
