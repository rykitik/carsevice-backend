const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const clients = await pool.query('SELECT * FROM clients');
    res.json(clients.rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const newClient = await pool.query(
      'INSERT INTO clients (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [name, email, phone]
    );
    res.json(newClient.rows[0]);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
