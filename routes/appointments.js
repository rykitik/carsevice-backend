const express = require('express');
const pool = require('../db');
const { authenticateJWT } = require('./auth.js')

const router = express.Router();

router.use(authenticateJWT);

// Получение всех записей
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM appointments ORDER BY date, time');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Ошибка получения записей:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создание новой записи
router.post('/', async (req, res) => {
  try {
    const {
      location, date, time,
      car_brand, car_model,
      client_name, phone,
      bonus_confirmed,
      status = 'pending'
    } = req.body;

    const result = await pool.query(
      `INSERT INTO appointments
       (location, date, time, car_brand, car_model, client_name, phone, bonus_confirmed, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [location, date, time, car_brand, car_model, client_name, phone, bonus_confirmed, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка создания записи:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение доступного времени
router.get('/available-times', async (req, res) => {
  try {
    const { date, location } = req.query;

    const allTimes = [
      '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '12:00', '12:30',
      '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30'
    ];

    const result = await pool.query(
      `SELECT time FROM appointments WHERE date = $1 AND location = $2`,
      [date, location]
    );

    const bookedTimes = result.rows.map(row => row.time);
    const available = allTimes.filter(time => !bookedTimes.includes(time));

    res.json({ available });
  } catch (err) {
    console.error('Ошибка получения времени:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление записи
router.put('/:id', async (req, res) => {
  try {
    const { date, time, client_id, service_id, status } = req.body;
    await pool.query(
      'UPDATE appointments SET date=$1, time=$2, client_id=$3, service_id=$4, status=$5 WHERE id=$6',
      [date, time, client_id, service_id, status, req.params.id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('Ошибка обновления записи:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удаление записи
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