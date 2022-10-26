const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('like_community', {
    community_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "커뮤니티 식별번호"
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "사용자 식별번호"
    }
  }, {
    sequelize,
    tableName: 'like_community',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "community_id" },
          { name: "users_id" },
        ]
      },
    ]
  });
};
