const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projects', {
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "사용자 식별번호"
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "프로젝트 식별번호"
    },
    formulas_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "formulas 식별번호"
    },
    packages_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "용기 식별번호"
    },
    project_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "프로젝트(제품)명"
    },
    phase: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "진행단계"
    },
    detail_phase: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "세부진행단계"
    },
    sample_number: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "샘플링횟수"
    },
    budget: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: "예산"
    },
    moq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "MOQ"
    },
    target_url: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "타겟제품 url"
    },
    feedback: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "샘플 피드백"
    },
    sample_comfirmed: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "샘플 확정 여부"
    },
    brand_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "브랜드명"
    },
    category1: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "카테고리"
    },
    category2: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "품목"
    },
    capacity: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "용량"
    },
    target_age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "대상연령"
    },
    target_gender: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "대상성별"
    },
    target_country: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "판매국가"
    },
    distribution_channel: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "유통채널"
    },
    overseas_certifications: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "해외 인증 및 허가진행 유무"
    },
    korea_certification: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "한국 기능성 인증 진행 여부"
    },
    sourcing_of_packaging: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "부자재 입고 유무"
    },
    efficacy: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "제품효과"
    },
    etc_efficacy: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "기타 제품효과"
    },
    ingredients: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "컨셉성분"
    },
    viscosity: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "제형"
    },
    applies: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "추가사항"
    },
    country: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "국가"
    },
    receiver_name: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "수취인명"
    },
    contact_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "연락처"
    },
    street: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "주소(Street)"
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "도시(City)"
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "주\/도(State)"
    },
    zip_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "우편번호(Zip)"
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "이메일"
    },
    image_paths: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "이미지 경로"
    },
    total_order_quantity: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "총 발주 수량"
    },
    recent_order_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "최근 발주 날짜"
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
    tableName: 'projects',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "users_id" },
          { name: "id" },
        ]
      },
    ]
  });
};
