const express = require('express');
const router = express.Router();
const naskahController = require('../controllers/naskah.controller');
const verifyToken = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.use(verifyToken);

router.get('/stats', naskahController.getStats);
router.get('/untuk-saya', naskahController.getSuratUntukSaya);
router.get('/', naskahController.getAllSurat);
router.get('/:id', naskahController.getSuratById);
router.post('/', upload.single('fileUtama'), naskahController.createSurat);
router.post('/:id/disposisi', naskahController.createDisposisi);
router.post('/disposisi/:disposisiId/delegasi', naskahController.createDelegasi);
router.post('/disposisi/:disposisiId/tindak-lanjut', upload.array('buktiFiles', 5), naskahController.createTindakLanjut);
router.put('/tindak-lanjut/:id/verifikasi', naskahController.verifikasiTindakLanjut);

module.exports = router;