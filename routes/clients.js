const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');

// Маршруты для работы с клиентами
router.get('/clients', clientsController.getAllClients);
router.post('/clients', clientsController.createClient);

module.exports = router;
