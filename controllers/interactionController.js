const { findCacheDir } = require('webpack-dev-server');
//const models = require('../models/starWarsModels');
const request = require('request')
const axios = require("axios");
const { search } = require('../server/server');
const interactionController = {};

interactionController.getDrugIdFromName = (req, res, next) => {
  req.body = ['ibuprofen', 'vancomycin'];

  const drug1 = req.body[0];
  const drug2 = req.body[1];
  res.locals.drug1 = drug1;
  res.locals.drug2 = drug2;

  axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${drug1}&search=1`)
     .then(response => {
      if (!Object.hasOwn(response.data.idGroup, 'rxnormId')) return next({ message: 'Drug not found!' });
      res.locals.id1 = response.data.idGroup.rxnormId[0];
    })

  axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${drug2}&search=1`)
     .then(response => {
      if (!Object.hasOwn(response.data.idGroup, 'rxnormId')) return next({ message: 'Drug not found!' });
      res.locals.id2 = response.data.idGroup.rxnormId[0];
      return next();
    })
};

interactionController.getDrugInteractionData = (req, res, next) => {
  const apiRequest = `https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=${res.locals.id1}&sources=DrugBank`;
  axios.get(apiRequest)
  .then(response => {
    if (!Object.hasOwn(response.data, 'interactionTypeGroup')) return next({ message: 'Interactions not found!' });
    res.locals.interactions = response.data.interactionTypeGroup[0].interactionType[0].interactionPair;
    return next();
 })
};

interactionController.findDrugInteractions = (req, res, next) => {
  // iterate over interactions to find second drug in interaction pairs
  //res.locals.interactionMessage = `No interactions found between ${res.locals.drug1} and ${res.locals.drug2}.`;
  for (const interaction of res.locals.interactions) {
    const otherDrugId = interaction.interactionConcept[1].minConceptItem.rxcui;
    if (otherDrugId === res.locals.id2) {
      res.locals.interactionMessage = `[Interaction] Severity: ${interaction.severity} Description: ${interaction.description}`;
      console.log(res.locals.interactionMessage)
    }
  }
  return next();
};

module.exports = interactionController;
