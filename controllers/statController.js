const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../schemas/UserSchema');
const Resource = require('../schemas/ResourceSchema');
const Transaction = require("../schemas/transactionSchema");
const Report = require('../schemas/reportSchema');

router.get('/', async (req, res) => {
    try {
        const volunteersCount = await User.countDocuments({ name: { $ne: null } });
        const reportsCount = await Report.countDocuments();
        const donationsTotal = await Transaction.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const resourcesCount = await Resource.countDocuments();

        const donations = donationsTotal.length > 0 ? donationsTotal[0].total : 0;

        res.json({
            volunteers: volunteersCount,
            reports: reportsCount,
            donations: donations,
            resources: resourcesCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;