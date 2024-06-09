const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const appointments = await pool.query('SELECT * FROM appointments');
    res.json(appointments.rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const { service_id, client_id, appointment_date } = req.body;

  try {
    const newAppointment = await pool.query(
      'INSERT INTO appointments (service_id, client_id, appointment_date) VALUES ($1, $2, $3) RETURNING *',
      [service_id, client_id, appointment_date]
    );
    res.json(newAppointment.rows[0]);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
