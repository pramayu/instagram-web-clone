'use strict';

module.exports = function(sequelize, DataTypes){
  var Comment = sequelize.define('comments', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true },
    body: { type: DataTypes.STRING, allowNull: false }
  });
  return Comment;
};
