const express = require('express');
const servicesRouter = require('./routes/services');
const clientsRouter = require('./routes/clients');
const appointmentsRouter = require('./routes/appointments');
const authRouter = require('./routes/auth').router;
const authenticateJWT = require('./routes/auth').authenticateJWT;
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:8080', // Замените на адрес вашего фронтенд-приложения
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Если вашим запросам требуются куки или заголовки авторизации
}));

app.use(bodyParser.json());

// Маршруты для работы с аутентификацией
app.use('/api/auth', authRouter);

// Маршруты для работы с услугами
app.use('/api/services', authenticateJWT, servicesRouter);

// Маршруты для работы с клиентами
app.use('/api/clients', authenticateJWT, clientsRouter);

// Маршруты для работы с записями на услуги
app.use('/api/appointments', authenticateJWT, appointmentsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
