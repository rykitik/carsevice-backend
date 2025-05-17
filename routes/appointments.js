const express = require('express');
const pool = require('../db');
const { authenticateJWT } = require('./auth.js')

const router = express.Router();

router.use(authenticateJWT);

// GET всех записей (admin)
router.get('/', async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const { rows } = await pool.query('SELECT * FROM appointments ORDER BY date, time');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Fetch appointments error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST — создать новую запись (для всех авторизованных пользователей)
router.post('/', async (req, res) => {
  const { client_id, service_id, date, time } = req.body;

  if (!client_id || !service_id || !date || !time) {
    return res
      .status(400).json({ message: 'Необходимо указать client_id, service_id, date и time' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO appointments (client_id, service_id, date, time)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [client_id, service_id, date, time]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create appointment error:', err);
    res.status(500).json({ message: 'Ошибка сервера при создании записи' });
  }
});

// DELETE записи по ID (admin)
router.delete('/:id', async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete appointment error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;