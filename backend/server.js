const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const authRoutes = require('./src/routes/auth.routes');
const agendaRoutes = require('./src/routes/agenda.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // supaya file bisa diakses via URL

app.get('/', (req, res) => {
  res.json({ message: 'SATRIA BATAM API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/agenda', agendaRoutes);

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});