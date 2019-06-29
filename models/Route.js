module.exports = function (sequelize, DataTypes) {
    var Route = sequelize.define("Route", {
        route: {
            type: DataTypes.STRING,
            allowNull: false
        },
        routeTitle: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    Route.associate = function(models) {
        Route.hasMany(models.Stop);
    };

    return Route
}