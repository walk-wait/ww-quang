require("dotenv").config();
const db = require("../models");
const axios = require("axios");
const binomialProbability = require("binomial-probability");

// Defining methods for the appController
module.exports = {
  findNearBy: async (req, res) => {
    let buses = await axios.get(`http://restbus.info/api/locations/${req.params.lat},${req.params.lon}/predictions`)
    res.json(buses.data)
  },
  findStops: (req, res) => {
    let route = req.params.route
    let direction = req.params.direction
    let stopId = req.params.id
    
    db.Stop.findAll({
      // include: [db.Route],
      where: {
        "$Route.route$": route,
        direction: direction
      },
      include:[db.Route]
    })
      .then(stops => {
        let stopList = stops.map(el => {
          let stop = {}
          stop.id = el.dataValues.tag
          stop.title = route + direction + " - " + el.Route.dataValues.routeTitle + " / " + el.dataValues.stopTitle
          console.log(stop.title)

          return stop
        })

        let index = stopList.findIndex( el => el.id == stopId)
        console.log(index, stopId)
        let nextStops = stopList.slice(index + 1)
        res.json(nextStops)
      })
  },
  search: async (req, res) => {
    let route = req.params.route
    let origin = req.params.origin
    let destination = req.params.destination
  // For bus time
    let busData = await busTime(route, origin, destination)

  // For latitude, longtitude data
    // let originCoord = await findLatlon(origin)  
    // let destinationCoord = await findLatlon(destination)

  // For walk time
    // Need to remove hardcoded coordinates after database is implemented
    let walkData = await walkTime(originCoord = "43.68734,-79.3974499", destinationCoord = "43.6832099,-79.41767")

    let walkOrWait = {
      bus: busData,
      walk: walkData
    }
    
    res.json(walkOrWait)
  },

};

const busTime = async (route, origin, destination) => {
  //probably need to wrap this in try catch block
  let busTimes = await axios.get(`http://restbus.info/api/agencies/ttc/tuples/${route}:${origin},${route}:${destination}/predictions`)
  let atOriginTime = Math.round(busTimes.data[0].values[0].minutes + busTimes.data[0].values[0].seconds/60)
  let nexBusVehicleId = busTimes.data[0].values[0].vehicle.id
  //Need to figure out what to do for end of line destnations and what to output when ttc stops running
  let destinationBusValues = busTimes.data[1].values
  let index = destinationBusValues.findIndex(bus => bus.vehicle.id === nexBusVehicleId) 
  let atDestinationTime
  
  if (index !== -1){
    atDestinationTime = Math.round(busTimes.data[1].values[index].minutes + busTimes.data[1].values[index].seconds/60)
  }

  //Returns times in minutes
  let busTimeData = {
    nextBus: atOriginTime,
    eta: atDestinationTime
  }

  return busTimeData  
}

const findLatlon = async (stopId) => {
  //queries database to return the latitude and longtitude of that bus stop
}
const walkTime = async (originCoord, destinationCoord) => {
  // Will have to probably wrap this in async try catch block. need to ask how
  let googleData = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoord}&destinations=${destinationCoord}&mode=walking&key=${process.env.API_KEY}`)
  let walkTime = parseInt(googleData.data.rows[0].elements[0].duration.text)

  return walkTime
}


//Add Algorithm here
// walkTime = walk time from google API
// nextBus = time until the bus arrives at starting point
// eta = time the bus will arrive at destination. 

var walkWaitDecisionWeekDayAm = eta*binomialProbability(10, 7, 0.9)+eta;
walkWaitDecisionWeekDayAm;

var walkWaitDecisionWeekDayPM = eta*binomialProbability(10, 6, 0.9)+eta;
walkWaitDecisionWeekDayPM;

var walkWaitDecisionWeekDayEve = eta*binomialProbability(10, 8, 0.9)+eta;
walkWaitDecisionWeekDayEve;

var walkWaitDecisionOther = eta*binomialProbability(10, math.random(), 0.5)+eta;
walkWaitDecisionOther;


// function binomialProbability(n, k) {
//   var n = 2;
//   var k = 1;
//   if ((typeof n !== 'number') || (typeof k !== 'number')) 
// return false; 
//  var coeff = 1;
//  for (var x = n-k+1; x <= n; x++) coeff *= x;
//  for (x = 1; x <= k; x++) coeff /= x;
//  return coeff;
// }
// console.log(coeff);

