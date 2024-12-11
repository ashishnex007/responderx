const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Transaction = require('../schemas/transactionSchema');
const Resource = require('../schemas/ResourceSchema');

// Create transaction
router.post('/', async (req, res) => {
  const { name, email, amount, transactionId } = req.body;
  try {
    const newTransaction = new Transaction({ name, email, amount, transactionId });
    await newTransaction.save();
    console.log('Transaction created');
    res.status(201).send('Transaction created');
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
});

// get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new resource donation
router.post('/donate-resource', async (req, res) => {
  const { fullName, email, phone, resourceType, quantity, condition, donationTimeframe, location, compliance } = req.body;

  try {
      const newResource = new Resource({
          fullName,
          email,
          phone,
          resourceType,
          quantity,
          condition,
          donationTimeframe,
          location,
          compliance
      });

      await newResource.save();
      console.log('Resource donation created successfully');
      res.status(201).send('Resource donation created successfully');
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
});

// Get all resource donations
router.get('/resources', async (req, res) => {
  try {
      const resources = await Resource.find();
      res.status(200).json(resources);
  } catch (error) {
      res.status(500).send(error.message);
  }
});

module.exports = router;