const express = require('express');
const pool    = require('../db');
const router  = express.Router();

// Получить все услуги
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM services ORDER BY id');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Fetch services error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Создать (admin)
router.post('/', async (req, res) => {
  if (req.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const { name, price, description } = req.body;
  if (!name || price == null || !description) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO services (name, price, description) VALUES ($1,$2,$3) RETURNING *',
      [name, price, description]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create service error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Обновить (admin)
router.put('/:id', async (req, res) => {
  if (req.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const { id } = req.params;
  const { name, price, description } = req.body;
  if (!name || price == null || !description) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  try {
    const { rows } = await pool.query(
      'UPDATE services SET name=$1,price=$2,description=$3 WHERE id=$4 RETURNING *',
      [name, price, description, id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Update service error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Удалить (admin)
router.delete('/:id', async (req, res) => {
  if (req.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM services WHERE id=$1 RETURNING *', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete service error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;