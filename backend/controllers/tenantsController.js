const Tenant = require('../models/Tenant');

// @desc    Upgrade tenant plan to 'pro'
// @route   POST /api/tenants/:slug/upgrade
// @access  Private/Admin
const upgradeTenantPlan = async (req, res) => {
    try {
        // Ensure the admin can only upgrade their own tenant's plan
        if(req.params.slug !== req.tenantSlug) {
            return res.status(403).json({ message: 'Forbidden: You can only upgrade your own tenant' });
        }
        
        const tenant = await Tenant.findOne({ slug: req.params.slug });

        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        tenant.plan = 'pro';
        await tenant.save();

        res.status(200).json({ message: `Tenant ${tenant.name} plan upgraded to Pro.` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during plan upgrade' });
    }
};

module.exports = { upgradeTenantPlan };