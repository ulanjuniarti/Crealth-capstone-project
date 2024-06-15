const express = require('express');
const { diagnose } = require('../controllers/diagnosisController');

const router = express.Router();

router.post('/diagnose', diagnose);

module.exports = router;
