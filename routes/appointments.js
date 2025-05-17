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
    const { date, time, client_id, service_id, status = 'pending' } = req.body;
    const result = await pool.query(
      'INSERT INTO appointments (date, time, client_id, service_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [date, time, client_id, service_id, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка создания записи:', err);
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