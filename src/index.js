import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { BrowserRouter } from 'react-router-dom';

import data1 from './data/digitalAnalytics_keywords.json';
import data2 from './data/digitalLibraries_keywords.json';
import data3 from './data/unsupervisedLearning_keywords.json';


const { fulltext: fulltext1, abstract: abstract1 } = data1;
const { fulltext: fulltext2, abstract: abstract2 } = data2;
const { fulltext: fulltext3, abstract: abstract3 } = data3;

//sort name alphabetic
fulltext1.sort((a, b) => {
  if (a.name > b.name) {
    return 1
  }
  if (a.name < b.name) {
    return -1
  }
  return 0

})

fulltext2.sort((a, b) => {
  if (a.name > b.name) {
    return 1
  }
  if (a.name < b.name) {
    return -1
  }
  return 0
})

fulltext3.sort((a, b) => {
  if (a.name > b.name) {
    return 1
  }
  if (a.name < b.name) {
    return -1
  }
  return 0
})

abstract1.sort((a, b) => {
  if (a.name > b.name) {
    return 1
  }
  if (a.name < b.name) {
    return -1
  }
  return 0
})
abstract2.sort((a, b) => {
  if (a.name > b.name) {
    return 1
  }
  if (a.name < b.name) {
    return -1
  }
  return 0
})

abstract3.sort((a, b) => {
  if (a.name > b.name) {
    return 1
  }
  if (a.name < b.name) {
    return -1
  }
  return 0
})






ReactDOM.render(<BrowserRouter><App width={1000} height={1000} 
  fulltext1={fulltext1} abstract1={abstract1}
  fulltext2={fulltext2} abstract2={abstract2}
  fulltext3={fulltext3} abstract3={abstract3} /></BrowserRouter>, 
  document.getElementById('root'));

