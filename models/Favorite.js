module.exports = function (sequelize, DataTypes) {
    var Favorite = sequelize.define("Favorite", {
        depart_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        arrived_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        walk_time: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    
    
    return Favorite
}