module.exports = function (sequelize, DataTypes) {
    var Stop = sequelize.define("Stop", {
        tag: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        stopTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        direction: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    Stop.associate = function(models){
      Stop.belongsTo(models.Route)  
    }

    return Stop
}

