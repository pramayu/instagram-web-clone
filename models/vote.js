'use strict'

module.exports = function(sequelize, DataTypes){
  var Vote = sequelize.define('votes', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true }
  });
  return Vote;
};
