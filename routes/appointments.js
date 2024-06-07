const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');

// Маршруты для работы с записями на услуги
router.get('/appointments', appointmentsController.getAllAppointments);
router.post('/appointments', appointmentsController.createAppointment);

module.exports = router;
