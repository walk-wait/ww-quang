require("dotenv").config();
const db = require("../models");
const axios = require("axios");
// const binomialProbability = require("binomial-probability");

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

          return stop
        })

        let index = stopList.findIndex( el => el.id == stopId)
        let nextStops = stopList.slice(index + 1)
        res.json(nextStops)
      })
  },
  search: async (req, res) => {
    let route = req.params.route
    let origin = req.params.origin
    let destination = req.params.destination
    let terminal = req.params.terminal
    let previous = req.params.previous

  // For bus time
    let busData = await busTime(route, origin, destination, terminal, previous)

  // For latitude, longtitude data
    let originCoord = await findLatlon(origin)  
    let destinationCoord = await findLatlon(destination)
    console.log(originCoord, destinationCoord)

  // For walk time
    let walkData = await walkTime(originCoord, destinationCoord)

    let walkOrWait = {
      bus: busData,
      walk: walkData
    }
    
    res.json(walkOrWait)
  },

};

const busTime = async (route, origin, destination, terminal, previous) => {
  let busTimes

  // Get bus time either at dstination or one stop before (previous) depending on it it is a terminal stop
  if (terminal === "true") {
    busTimes = await axios.get(`http://restbus.info/api/agencies/ttc/tuples/${route}:${origin},${route}:${previous}/predictions`)
  } else {
    busTimes = await axios.get(`http://restbus.info/api/agencies/ttc/tuples/${route}:${origin},${route}:${destination}/predictions`)
  }

  let atOriginTime = Math.round(busTimes.data[0].values[0].minutes + busTimes.data[0].values[0].seconds/60)
  let nexBusVehicleId = busTimes.data[0].values[0].vehicle.id
  let destinationBusValues
  let atDestinationTime
  let bunch = false

  if (origin === previous) {
    atDestinationTime = atOriginTime
  } else {
    destinationBusValues = busTimes.data[1].values
    let index = destinationBusValues.findIndex(bus => bus.vehicle.id === nexBusVehicleId) 
    console.log(bunch)
    if (index === -1){
      // let lastBusAtDestination = await axios.get(`http://restbus.info/api/agencies/ttc/routes/${route}/stops/${destination}/predictions`)
      // let lastBusData = lastBusAtDestination.data[0].values[lastBusAtDestination.data[0].values.length -1]
      // let lastBusTime = Math.round(lastBusData.minutes + lastBusData.seconds/60)
      // atDestinationTime = atOriginTime + lastBusTime
      atDestinationTime = atOriginTime
      bunch = true
    } else {
      atDestinationTime = Math.round(busTimes.data[1].values[index].minutes + busTimes.data[1].values[index].seconds/60)
    }
  }
  
  if (terminal === "true"){
    atDestinationTime += 2
  }
  
  console.log(bunch)
  //Returns times in minutes
  let busTimeData = {
    nextBus: atOriginTime,
    eta: atDestinationTime,
    bunch: bunch
  }

  return busTimeData  
}

const findLatlon = async (stopId) => {
  let dbResult = await db.Stop.findOne({
    where: {
      tag: stopId
    }
  })

  let coord = dbResult.dataValues.latitude + "," + dbResult.dataValues.longitude

  return coord
}

const walkTime = async (originCoord, destinationCoord) => {
  // Will have to probably wrap this in async try catch block. need to ask how
  let googleData = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoord}&destinations=${destinationCoord}&mode=walking&key=${process.env.API_KEY}`)
  let walkTimeData = googleData.data.rows[0].elements[0].duration.text.split(" ")

  let walkTime
  if(["hour", "hours", "hrs"].indexOf(walkTimeData[1]) > -1){
    walkTime = parseInt(walkTimeData[0])* 60 + parseInt(walkTimeData[2])
  } else {
    walkTime = parseInt(walkTimeData[0])
  }

  return walkTime
}

//Add Algorithm here?
// walkTime = walk time from google API
// nextBus = time until the bus arrives at starting point
// eta = time the bus will arrive at destination. 

// Math.random();
// var s = Math.floor(Math.random()*9)+1;

// var walkWaitTtc = eta * binomialProbability(10, s, 0.5) + eta;

// console.log(s + " at " + walkWaitTtc);

// var walkWaitDecisionWeekDayAm = eta*binomialProbability(10, 7, 0.9)+eta;
// walkWaitDecisionWeekDayAm;

// var walkWaitDecisionWeekDayPM = eta*binomialProbability(10, 6, 0.9)+eta;
// walkWaitDecisionWeekDayPM;

// var walkWaitDecisionWeekDayEve = eta*binomialProbability(10, 8, 0.9)+eta;
// walkWaitDecisionWeekDayEve;

// var s = math.random()*10;

// var walkWaitDecisionOther = eta*binomialProbability(10, s, 0.5)+eta;

// walkWaitDecisionOther;


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

