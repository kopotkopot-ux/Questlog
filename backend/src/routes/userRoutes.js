/**
 * User profile routes
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { body } = require('express-validator');
const { paginationValidator } = require('../validators/adminValidator');

const updateProfileValidator = [
  body('username').trim().isLength({ min: 3, max: 50 }),
  body('email').trim().isEmail().normalizeEmail(),
];

router.use(authenticate);

router.put('/profile', updateProfileValidator, validate, userController.updateProfile);
router.get('/activity', paginationValidator, validate, userController.getActivityHistory);

module.exports = router;
