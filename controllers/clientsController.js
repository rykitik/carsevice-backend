const pool = require('../services/db');

// Получить всех клиентов
exports.getAllClients = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Создать нового клиента
exports.createClient = async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  try {
    const result = await pool.query('INSERT INTO clients (first_name, last_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, email, phone]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
