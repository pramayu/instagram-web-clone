'use strict';
module.exports = function(sequelize, DataTypes){
  var User = sequelize.define('users', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true},
    email: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true},
    fullname: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    website: { type: DataTypes.STRING },
    bio: { type: DataTypes.TEXT },
    phone: { type: DataTypes.STRING },
    avatar: { type: DataTypes.STRING },
    gender: {type: DataTypes.STRING}
  });
  return User;
};
