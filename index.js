const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { router: authRouter, authenticateJWT } = require('./routes/auth');
const servicesRouter     = require('./routes/services');
const clientsRouter      = require('./routes/clients');
const appointmentsRouter = require('./routes/appointments');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());

// Аутентификация
app.use('/api/auth', authRouter);

// Защищённые ресурсы (JWT)
app.use('/api/services',     authenticateJWT, servicesRouter);
app.use('/api/clients',      authenticateJWT, clientsRouter);
app.use('/api/appointments', authenticateJWT, appointmentsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});