const express = require('express');
const bcrypt  = require('bcrypt');
const pool    = require('../db');
const router  = express.Router();

// GET всех клиентов (admin)
router.get('/', async (req, res) => {
  if (req.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const { rows } = await pool.query('SELECT id,name,email,role FROM clients ORDER BY id');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Fetch clients error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Обновить клиента (admin)
router.put('/:id', async (req, res) => {
  if (req.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const { id } = req.params;
  const { name, email, password, role } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const hashed = password ? await bcrypt.hash(password, 10) : undefined;
    const params = hashed
      ? [name, email, hashed, role, id]
      : [name, email, role, id];
    const query = hashed
      ? 'UPDATE clients SET name=$1,email=$2,password=$3,role=$4 WHERE id=$5 RETURNING id,name,email,role'
      : 'UPDATE clients SET name=$1,email=$2,role=$3 WHERE id=$4 RETURNING id,name,email,role';

    const { rows } = await pool.query(query, params);
    if (!rows.length) return res.status(404).json({ message: 'Client not found' });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Update client error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;