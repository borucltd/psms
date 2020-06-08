module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        spotifyId: { type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false },
        accessToken: { type: DataTypes.STRING, allowNull: false },
        refreshToken: { type: DataTypes.STRING, allowNull: false }
    });

    User.associate = function (models) {
        // Associating User with Songs
        // A user can have many songs
        User.belongsToMany(models.Song, { through: "UserSongs" });
    };

    return User;
};