module.exports = function (sequelize, DataTypes) {
    var Song = sequelize.define("Song", {
        title: { type: DataTypes.STRING, allowNull: false },
        artistName: { type: DataTypes.STRING, allowNull: false },
        uri: { type: DataTypes.STRING, allowNull: false }
    });

    Song.associate = function (models) {
        // Associating Song with Users
        // A song can belong to many users
        Song.belongsToMany(models.User, { through: "UserSongs" });
    };

    return Song;
};
