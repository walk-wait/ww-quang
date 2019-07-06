require("dotenv").config();
const db = require("../models");
const axios = require("axios");

var routeNormal = [
    "14688",
    "14838",
    "14674",
    "14672",
    "14670",
    "14668",
    "14666",
    "14382",
    "14383",
    "14384",
    "14385",
    "14386",
    "14387",
    "14388",
    "14389",
    "14390",
    "14391",
    "8868",
    "8869",
    "15685",
    "8875",
    "8876",
    "8976",
    "10450",
    "1494",
    "2189",
    "14295_ar"
];
var routeShort = [
    "14688",
    "14838",
    "14674",
    "14672",
    "14670",
    "14668",
    "14666",
    "475",
    "14382",
    "14383",
    "14384",
    "14385",
    "14386",
    "14387",
    "14388",
    "14389",
    "14390",
    "14391"
];

function insertStop(routeNormal, routeShort) {
    var allStops = [];
    for (var i = 0; i < routeNormal.length; i++) {
        var found = false;
        for (var j = 0; j < routeShort.length; j++) {
            if (routeNormal[i] == routeShort[j]) {
                found = true;
            }
        }
        if (found == false) {
            allStops.push(routeNormal[i]);
        }
    } 
    return allStops;
}


// my thought: 
// first step: find the route that in the short route but not
// in the regular route (complete)


// mark the indexes and index - 1


// insert