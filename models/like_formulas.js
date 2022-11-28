const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('like_formulas', {
    users_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "사용자 식별번호",
      references: {
        model: 'users',
        key: 'id'
      }
    },
    formulas_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "formulas 식별번호",
      references: {
        model: 'formulas',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'like_formulas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "users_id" },
          { name: "formulas_id" },
        ]
      },
      {
        name: "like_formulas_FK",
        using: "BTREE",
        fields: [
          { name: "formulas_id" },
        ]
      },
    ]
  });
};
