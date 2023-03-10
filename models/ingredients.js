const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ingredients', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "원료 식별번호"
    },
    material_name: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "원료명"
    },
    ingredient_name: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      comment: "성분명"
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "종류"
    },
    effects: {
      type: DataTypes.STRING(10000),
      allowNull: true,
      comment: "기능"
    },
    feature: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "특징"
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "생성일"
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "수정일"
    },
    delete_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "삭제일"
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
          { name: "id" },
        ]
      },
    ]
  });
};
