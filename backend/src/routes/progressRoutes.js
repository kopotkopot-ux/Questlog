/**
 * Progress tracking routes - FR-018 through FR-020
 */
const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authenticate = require('../middleware/authenticate');
const userOnly = require('../middleware/userOnly');

router.use(authenticate, userOnly);
router.get('/', progressController.getProgress);

module.exports = router;
