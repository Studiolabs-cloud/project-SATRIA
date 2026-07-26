const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agenda.controller');
const verifyToken = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.use(verifyToken); // semua route agenda wajib login dulu

router.get('/', agendaController.getAllAgenda);
router.get('/hari-ini', agendaController.getAgendaHariIni);
router.get('/stats', agendaController.getStats);
router.get('/:id', agendaController.getAgendaById);
router.post('/', upload.single('fileUndangan'), agendaController.createAgenda);
router.put('/:id', upload.single('fileUndangan'), agendaController.updateAgenda);
router.delete('/:id', agendaController.deleteAgenda);

module.exports = router;