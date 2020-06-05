module.exports = function (sequelize, DataTypes) {
    var UserSong = sequelize.define("UserSong", {
        SongId: { type: DataTypes.INTEGER, allowNull: false },
        UserId: { type: DataTypes.INTEGER, allowNull: false },
    });

    UserSong.removeAttribute('id');

    return UserSong;
};