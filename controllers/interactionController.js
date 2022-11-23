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
      if (!Object.hasOwn(data.idGroup, 'rxnormId')) return next('Invalid Drug');
      res.locals.id1 = data.idGroup.rxnormId[0];
      console.log('id1:', res.locals.id1)
      //if (!res.locals.id2) return;
      return;
    }) 
    .catch((err) => {
      console.log(err)
    })

  await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${drug2}&search=1`)
    .then(res => res.json())
    .then(data => {
      if (!Object.hasOwn(data.idGroup, 'rxnormId')) return next('Invalid Drug');
      res.locals.id2 = data.idGroup.rxnormId[0];
      console.log('id1:', res.locals.id2);
      return next();
    })
    .catch((err) => {
      console.log(err)
    })
    
};

interactionController.getDrugInteractionData = (req, res, next) => {
  const apiRequest = `https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=${res.locals.id1}&sources=DrugBank`;
  fetch(apiRequest)
    .then(res => res.json())
    .then(response => {
      console.log('interactionController', response)
      if (!Object.hasOwn(response, 'interactionTypeGroup')) return next({ message: 'Interactions not found!' });
      res.locals.interactions = response.interactionTypeGroup[0].interactionType[0].interactionPair;
      return next();
    })
};

interactionController.findDrugInteractions = (req, res, next) => {
  // iterate over interactions to find second drug in interaction pairs
  //res.locals.interactionMessage = `No interactions found between ${res.locals.drug1} and ${res.locals.drug2}.`;
  for (const interaction of res.locals.interactions) {
    const otherDrugId = interaction.interactionConcept[1].minConceptItem.rxcui;
    console.log(otherDrugId)
    if (otherDrugId === res.locals.id2) {
      console.log('id2', res.locals.id2)
      res.locals.interactionMessage = [interaction.severity, interaction.description];
      return next();
    }
  }
  if (!res.locals.interactionsMessage) return next('interactions not found');
  console.log('findInteractions', res.locals.interactionMessage)
  return next();
};

module.exports = interactionController;
