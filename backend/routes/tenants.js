const express = require('express');
const router = express.Router();
const { upgradeTenantPlan } = require('../controllers/tenantsController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');

router.route('/:slug/upgrade').post(protect, isAdmin, upgradeTenantPlan);

module.exports = router;