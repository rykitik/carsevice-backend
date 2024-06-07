// backend/controllers/servicesController.js

const pool = require('../services/db');

// Получить все услуги
exports.getAllServices = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Создать новую услугу
exports.createService = async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const result = await pool.query('INSERT INTO services (name, description, price) VALUES ($1, $2, $3) RETURNING *', [name, description, price]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
