const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('formulas', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "formulas 식별번호"
    },
    product_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "제품명"
    },
    award: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "A.I 디테일"
    },
    top_or_new: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "BW A.I"
    },
    category1: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "카테고리"
    },
    category2: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "품목명"
    },
    efficacy: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      comment: "제품효과"
    },
    ingredients: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      comment: "성분"
    },
    viscosity: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "제형"
    },
    applies: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "사용감"
    },
    color: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "색상"
    },
    fragrance: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "향"
    },
    others: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "기타사항"
    },
    tip: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "팁"
    },
    image_paths: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "이미지경로 배열"
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
    tableName: 'formulas',
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
