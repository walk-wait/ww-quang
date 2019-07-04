require("dotenv").config();
const db = require("../models");
const axios = require("axios");
// const binomialProbability = require("binomial-probability");

// Defining methods for the appController
module.exports = {
  findNearBy: async (req, res) => {
    let buses = await axios.get(`http://restbus.info/api/locations/${req.params.lat},${req.params.lon}/predictions`)
    console.log(req.params.lat,req.params.lon)
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

  // For walk time
    let walkData = await walkTime(originCoord, destinationCoord)

    
    let walkOrWait = {
      bus: busData,
      walk: walkData
    }
    
    // add binomial + other logic fn
  



    res.json(walkOrWait)
  },

};

const busTime = async (route, origin, destination, terminal, previous) => {
console.log(route, origin, destination)

  let busTimes

  // Get bus time either at dstination or one stop before (previous) depending on it it is a terminal stop
  if (terminal === "true") {
    busTimes = await axios.get(`http://restbus.info/api/agencies/ttc/tuples/${route}:${origin},${route}:${previous}/predictions`)
  } else {
    busTimes = await axios.get(`http://restbus.info/api/agencies/ttc/tuples/${route}:${origin},${route}:${destination}/predictions`)
  }

  //Set variables
  let atOriginTime
  let nextVehicleId
  let index
  let destinationBusValues
  let atDestinationTime
  let bunch = false

  // If/Else statement depending on how many data point returns
  if (busTimes.data.length === 2) {
    atOriginTime = Math.round(busTimes.data[1].values[0].minutes)
    nextVehicleId = busTimes.data[1].values[0].vehicle.id
  
    if (terminal && origin === previous) {
      // this is the case if the origin is one stop before the terminal stop and the destination is the terminal
      atDestinationTime = atOriginTime
    } else {
      // this is all other case weather if destination is terminal or not
      destinationBusValues = busTimes.data[0].values
      index = destinationBusValues.findIndex(bus => bus.vehicle.id === nextVehicleId) 
      if (index === -1){
        // If for any reason why I cannot find the first bus to arrive at origin within destination data
        let lastBusTime = Math.round(busTimes.data[0].values[busTimes.data[0].values.length - 1].minutes)

        let secondLastBusTime
        if (busTimes.data[1].values.length >= 2) {
          // If there are two or more bus arriving at destination
          secondLastBusTime = Math.round(busTimes.data[0].values[busTimes.data[1].values.length - 2].minutes)
        } else {
          // If there is only one bus arriving at destination
          secondLastBusTime = 0
        }

        atDestinationTime = atOriginTime + lastBusTime + (lastBusTime - secondLastBusTime)
        
        // Bus probably bunched if there are 4 or more buses scheduled to arrive at destination and none of which is the next bus to start at origin
        if (busTimes.data[1].values.length >= 4) {
          bunch = true
        }

      } else {
        // Normal case where next bus to arrive at original is also found within destination data
        atDestinationTime = Math.round(busTimes.data[0].values[index].minutes)
      }
    }
    
    // Add two minutes for destination at terminal stuff to padd the eta to destination
    if (terminal === "true"){
      atDestinationTime += 2
    }
    
  } else if (busTimes.data.length === 1) {
    console.log('this got triggered')
    // this is the case when there is a bus prediction for either at origin or destination but not both
    //if origin only
    if (busTimes.data[0].stop.id === origin) {
      // check if bus arrive at previous
      let previousStop = await axios.get(`http://restbus.info/api/agencies/ttc/routes/${route}/stops/${previous}/predictions`)
      console.log(previousStop)
      if(previousStop.data.length > 0) {
        destinationBusValues = previousStop.data[0].values
        index = destinationBusValues.findIndex(bus => bus.vehicle.id === nextVehicleId)
        
        if(index > -1){
          // if yes it is previous time + 2
          atDestinationTime = Math.round(previousStop.data[0].values[index].minutes) + 2
        } else {
          atDestinationTime = 999999
        }

      } else {
          atDestinationTime = 999999
      }

    } else {
      //if destination only
        // no more bus to arrive at origin
      atDestinationTime = 999999
    }
     
  } else {
    // this is the case when there are no bus predicted for origin or destination
    // set large number so time for bus should be much longer than any walk time
    atOriginTime = 999999
    atDestinationTime = 999999
  }
  
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
