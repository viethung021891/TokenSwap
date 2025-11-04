const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');
const swapController = require('../controllers/swapController');
const revertController = require('../controllers/revertController');
const userController = require('../controllers/userController');

// Route to get token list
router.get('/tokens/getTokenList', tokenController.getTokenList);
router.get('/tokens/getChainList', tokenController.getChainList);

// Route to swap token
// router.post('/swap', swapController.swapToken);

router.post('/swap', swapController.swapToken);

// Route to revert token
router.post('/revert', revertController.revertToken);

// Register Route
router.post('/register', userController.register);

// Login Route
router.post('/login', userController.login);

module.exports = router;
