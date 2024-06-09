const pool = require('../db');

// Получить все записи на услуги
exports.getAllAppointments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointments');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Создать новую запись на услугу
exports.createAppointment = async (req, res) => {
  const { client_id, service_id, appointment_date } = req.body;
  try {
    const result = await pool.query('INSERT INTO appointments (client_id, service_id, appointment_date) VALUES ($1, $2, $3) RETURNING *', [client_id, service_id, appointment_date]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
