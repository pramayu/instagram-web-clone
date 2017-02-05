'use strict';

module.exports = function(sequelize, DataTypes){
  var Relationship = sequelize.define('relationships', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true },
    status: { type: DataTypes.STRING }
  });
  return Relationship;
};
