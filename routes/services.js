const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

// Маршруты для работы с услугами
router.get('/services', servicesController.getAllServices);
router.post('/services', servicesController.createService);

module.exports = router;
