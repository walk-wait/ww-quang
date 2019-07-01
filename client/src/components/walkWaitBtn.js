
//Manual binomial function for probability
function binomial(n, k) {
    if ((typeof n !== 'number') || (typeof k !== 'number')) 
 return false; 
   var coeff = 1;
   for (var x = n-k+1; x <= n; x++) coeff *= x;
   for (x = 1; x <= k; x++) coeff /= x;
   return coeff;
}

console.log(binomial(8,3));
console.log(binomial(10,2));

//Time Day Logic Tables for maginal math probability 
const a = {
  'mon': { 
   0: { trials: 3, sucess: 1}, //8am-9am
   1: { trials: 2, sucess: 1}, //12pm-1pm
   2: { trials: 3, sucess: 2}, //4pm-5pm
   4: { trials: 1, sucess: 0} //all other hours
   },
  'tues': {
    0: { trials: 3, sucess: 1}, //8am-9pm
    1: { trials: 2, sucess: 1}, //12pm-1pm
    2: { trials: 3, sucess: 2}, //4pm-5pm
    4: { trials: 1, sucess: 0} //all other hours
  },
  'wed': {
    0: { trials: 3, sucess: 1}, //8am-9pm
    1: { trials: 2, sucess: 1}, //12pm-1pm
    2: { trials: 3, sucess: 2}, //4pm-5pm
    4: { trials: 1, sucess: 0} //all other hours
  },
  'thurs': {
    0: { trials: 3, sucess: 1}, //8am-9pm
    1: { trials: 2, sucess: 1}, //12pm-1pm
    2: { trials: 3, sucess: 2}, //4pm-5pm
    4: { trials: 1, sucess: 0} //all other hours
  },
  'fri': {
    0: { trials: 3, sucess: 1}, //8am-9pm
    1: { trials: 2, sucess: 1}, //12pm-1pm
    2: { trials: 3, sucess: 2}, //4pm-5pm
    4: { trials: 1, sucess: 0} //all other hours
  },
  'weekend': {
    0: { trials: 3, sucess: 1}, //8am-9pm
    1: { trials: 2, sucess: 1}, //12pm-1pm
    2: { trials: 3, sucess: 2}, //4pm-5pm
    4: { trials: 1, sucess: 0} //all other hours
  }
 }
//Call list for table
 const time = '5:00'; //called from the API
 const day = 'mon'; //called from the API
 const x = a[day][time].trials //NewDate() built in function to JS or use moment.js 
 const y = a[day][time].success

 binomial(x, y)

//Business logic for algorithm not using tables yet. 
Math.random();
var s = Math.floor(Math.random()*9)+1;

var walkWaitTtc = eta * binomialProbability(10, s, 0.5) + eta;

console.log(s + " at " + walkWaitTtc);

 //Conditions array if/else for walk or wait determination
 let conditionsArray = [
  walkTime < 20, 
  eta >= walkTime,
  bunch = false,
]

if (conditionsArray.indexOf(false) === -1) {
  renderWalkButton
}

//React to change state using conditions array
 componentDidMount() {
  if(this.state.walk) {
    console.log(this.state.modalStatus);
    this.setState({ modalStatus: true}, () => {
         console.log(this.state.modalStatus);
    });
  }  else {
      console.log(this.state.modalStatus);
  }
  }

 //Binomial Runkit NPM Instructions
//  const binomialProbability = require('binomial-probability')

 // What is the probability of x successes in n trials?
//  binomialProbability(trials, successes, probability_of_success)
 
 // What is the probability of x or fewer successes in n trials?
//  binomialProbability.cumulative(trials, successes, probability_of_success)

//  var binomialProbability = require("binomial-probability");
