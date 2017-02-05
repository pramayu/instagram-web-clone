'use strict';

module.exports = function(sequelize, DataTypes){
  var Post = sequelize.define('posts', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true },
    location: { type: DataTypes.STRING },
    caption: { type: DataTypes.STRING },
    thumb_img: { type: DataTypes.STRING, allowNull: false },
    original_img: { type: DataTypes.STRING, allowNull: false }
  });
  return Post;
};
