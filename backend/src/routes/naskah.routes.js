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

module.exports = router;