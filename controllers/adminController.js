require("dotenv").config();
const db = require("../models");
const axios = require("axios");

// Defining methods for the appController
module.exports = {
    createAllRoutes: (req, res) => {
        axios.get("http://restbus.info/api/agencies/ttc/routes")
            .then(ttc => {
                let routesData = ttc.data.map(el => {
                    route = el.id
                    routeTitle = el.title.split("-")[1]
                    return {
                        route: route,
                        routeTitle: routeTitle,
                        link: el._links.self.href
                    }
                })
                routesData.forEach((route, routeId) => {
                    db.Route.findOrCreate({
                        where: {
                            route: route.route,
                            routeTitle: route.routeTitle
                        }
                    })
                        .then(routeRes => {
                            axios.get(route.link)
                                .then(link => {
                                    let stops = link.data.stops.map(el => {
                                        return {
                                            tag: el.id,
                                            stopTitle: el.title,
                                            latitude: el.lat,
                                            longitude: el.lon
                                        }
                                    })

                            // render all directions
                            link.data.directions.forEach(dir => {
                                let direction = dir.title.charAt(0)
                                let directionalStops = dir.stops.map(el => {
                                    let info = stops.filter(x => x.tag === el)[0]
                                    info.direction = direction
                                    info.RouteId = routeRes[0].id
                                    return info
                                })
                                directionalStops.forEach(stop => {
                                    db.Stop.findOrCreate({
                                        where: stop
                                    })
                                });
                            });

                                    // Solution for multiple route in same direction
                                    // need COMMENT for UNIT TESTING!!

                                    // check if directions array length is <= 2

                                    // if true
                                    // run the code above
                                    // if not run code below
                                    // find the value of the direction of position 0
                                    // then find the position within the array of the opposite direction
                                    // say the directions array length = 3
                                    // and the opposite direction index is 1 
                                    // then we know index 0 is of one direction (west) - only 1 array for this direction
                                    // and 1-2 is of the opposite direction (east) - 2 array for this direction
                                    // count number within each direction and assign to variable
                                    // for all postions - return the stops array and number them 0 - 4
                                    // array0 = directions[0].stops
                                    // array1 = directions[1].stops
                                    // array2 = directions[2].stops
                                    // var arr1 = [0, 1, 2];
                                    // var arr2 = [3, 5, 7];
                                    // var newArray = arr1.concat(arr2);
                                    // concat parse string make sense to me in our BUS EXAMPLE

                                    // forloop based on (what are we counting?) count & array length
                                    // merge the arrays
                                    // in this case array 1 is main array
                                    // check values x in array 2
                                    // if x not found in array 1
                                    // find value y (the value one index before x) and check if in array 1 and return index
                                    // insert value at index + 1
                                    // until no more arrays to compare
                                })
                        })
                })
            })
    },
};


