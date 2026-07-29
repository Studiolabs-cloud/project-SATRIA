const express = require('express');
const router = express.Router();
const catatanController = require('../controllers/catatan.controller');
const verifyToken = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.use(verifyToken);

router.get('/', catatanController.getAllKegiatan);
router.get('/stats', catatanController.getStats);
router.get('/:id', catatanController.getKegiatanById);
router.post('/:id/notulen', upload.single('file'), catatanController.simpanNotulen);
router.put('/:id/notulen/minta-edit', catatanController.mintaEditNotulen);
router.post('/:id/rencana-lanjutan', catatanController.simpanRencanaLanjutan);

module.exports = router;