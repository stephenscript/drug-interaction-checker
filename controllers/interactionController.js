const { findCacheDir } = require('webpack-dev-server');
//const models = require('../models/starWarsModels');
const request = require('request')
const axios = require("axios");
const fetch = require('node-fetch');
const { response } = require('express');
//const { search } = require('../server/server');
const interactionController = {};

interactionController.getDrugIdFromName = async (req, res, next) => {
  //req.body = ['ibuprofen', 'vancomycin'];
  console.log("interactionController:", req.headers)
  // const drug1 = req.body[0];
  // const drug2 = req.body[1];
  const { drug1, drug2 } = req.headers;
  console.log(drug1, drug2) 
  res.locals.drug1 = drug1;
  res.locals.drug2 = drug2;

  await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${drug1}&search=1`)
    .then(res => res.json())
    .then(data => {
      if (!Object.hasOwn(data.idGroup, 'rxnormId')) return next({ message: 'First drug name invalid!' });
      res.locals.id1 = data.idGroup.rxnormId[0];
      console.log('id1:', res.locals.id1)
      return;
    }) 

  await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${drug2}&search=1`)
    .then(res => res.json())
    .then(data => {
      if (!Object.hasOwn(data.idGroup, 'rxnormId')) return next({ message: 'Second drug name invalid!' });
      res.locals.id2 = data.idGroup.rxnormId[0];
      console.log('id1:', res.locals.id2);
      return next();
    })
    
};

interactionController.getDrugInteractionData = async (req, res, next) => {
  console.log('getDrugInteraction');
  const apiRequest = `https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=${res.locals.id1}&sources=DrugBank`;
  await fetch(apiRequest)
    .then(res => res.json())
    .then(response => {
      console.log('interactionController', response)
      if (!Object.hasOwn(response, 'interactionTypeGroup')) return next({ message: 'Interactions not found!' });
      res.locals.interactions = response.interactionTypeGroup[0].interactionType[0].interactionPair;
      return next();
    })
};

interactionController.findDrugInteractions = (req, res, next) => {
  console.log('findDrugInteraction');
  // iterate over interactions to find second drug in interaction pairs
  for (const interaction of res.locals.interactions) {
    const otherDrugId = interaction.interactionConcept[1].minConceptItem.rxcui;
    console.log(otherDrugId)
    if (otherDrugId === res.locals.id2) {
      res.locals.interactionMessage = [interaction.severity, interaction.description];
      return next();
    }
  }
  if (!res.locals.interactionsMessage) return next('interactions not found');
  console.log('findInteractions', res.locals.interactionMessage)
  return next();
};

module.exports = interactionController;
