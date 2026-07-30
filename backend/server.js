const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const activityLogRoutes = require('./src/routes/activityLog.routes');
const authRoutes = require('./src/routes/auth.routes');
const agendaRoutes = require('./src/routes/agenda.routes');
const usersRoutes = require('./src/routes/users.routes');
const catatanRoutes = require('./src/routes/catatan.routes');
const naskahRoutes = require('./src/routes/naskah.routes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // supaya file bisa diakses via URL
app.use('/api/activity-logs', activityLogRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'SATRIA BATAM API is running' });
});
app.use('/api/catatan', catatanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/naskah', naskahRoutes);
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});