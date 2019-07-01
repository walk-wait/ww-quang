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

                            // // renders only two directions
                            // for (let i = 0; i < 2; i++){
                            //     let dir = link.data.directions[i]
                            //     let direction = dir.title.charAt(0)
                            //     let directionalStops = dir.stops.map(el => {
                            //         let info = stops.filter(x => x.tag === el)[0]
                            //         info.direction = direction
                            //         info.RouteId = routeId + 1
                            //         return info
                            //     })
                            //     directionalStops.forEach(stop => {
                            //         db.Stop.findOrCreate({
                            //             where: stop
                            //         })
                            //     });
                            // }

                            // render all direction including short turn and night bus
                            link.data.directions.forEach(dir => {
                                let direction = dir.title.charAt(0)
                                let directionalStops = dir.stops.map(el => {
                                    let info = stops.filter(x => x.tag === el)[0]
                                    info.direction = direction
                                    info.RouteId = routeId + 1
                                    return info
                                })
                                directionalStops.forEach(stop => {
                                    db.Stop.findOrCreate({
                                        where: stop
                                    })
                                });
                            });
                        })
                }) 
            })
        })
  },
};


