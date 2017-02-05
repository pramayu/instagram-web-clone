'use strict';

module.exports = function(sequelize, DataTypes){
  var Notification = sequelize.define('notifications', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true },
    notice_type: { type: DataTypes.STRING },
    read: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
  return Notification;
};
