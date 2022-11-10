const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ingredients', {
    ingredients_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "원료 식별번호"
    },
    materialName: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "원료명"
    },
    ingredientName: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "성분명"
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "종류"
    },
    effects: {
      type: DataTypes.STRING(12000),
      allowNull: true,
      comment: "기능"
    }
  }, {
    sequelize,
    tableName: 'ingredients',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ingredients_id" },
        ]
      },
    ]
  });
};
