const express = require('express');
const interactionController = require('../controllers/interactionController');
const router = express.Router();

router.get('/',
  interactionController.getDrugIdFromName,
  interactionController.getDrugInteractionData,
  interactionController.findDrugInteractions,
  (req, res) => {
    res.status(200).json(res.locals.interactionMessage)
  }
);

module.exports = router;
