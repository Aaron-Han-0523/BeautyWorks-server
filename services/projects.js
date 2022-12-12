const { Service } = require('../utils/template');
const models = require('../models');
const { Op, QueryTypes } = require('sequelize')
const codezip = require('../codezip')

const service = new Service(models.projects);


service.readOne = async (condition) => {
    return await service.model
        .findOne({
            raw: true,
            where: condition,
            include: [{
                model: models.documents,
                as: "documents",
                where: condition,
            }],
        })
        .then(async (result) => {
            // 컨셉 성분 리스트 toString
            if (result.ingredients) {
                let ingredients_list = result.ingredients.split(',');
                let ingredients_name_list = await models.ingredients.findAll({
                    raw: true,
                    attributes: ['ingredient_name'],
                    where: {
                        id: ingredients_list
                    }
                }).then(rows => {
                    let ls = [];
                    rows.forEach((item, index) => ls.push(item.ingredient_name))
                    return ls;
                })
                // console.log(ingredients_name_list);
                result.concept_ingredients = ingredients_name_list.join(', ')
            }

            // 타겟 연령
            result.target_age_list = [];
            for (let i = 0; i < codezip.target.age; i++) {
                if (result.target_age & 1 << i) result.target_age_list.push(i);
            }

            // 타겟 성별
            result.target_gender_list = [];
            for (let i = 0; i < codezip.target.gender; i++) {
                if (result.target_gender & 1 << i) result.target_gender_list.push(i);
            }

            // 사용감
            result.applies_list = [];
            const n_applies = codezip.effects.use.boolean.length + codezip.effects.use.other;
            for (let i = 0; i < n_applies; i++) {
                if (result.applies & 1 << i) result.applies_list.push(true);
                else result.applies_list.push(false);
            }

            return result;
        })
        .catch((err) => {
            throw err;
        })
}

service.allRead = async (condition = {}, limit = 10, skip = 0) => {
    let query = `
    select formulas.product_name as "formula.product_name", documents.title as "documents.title", projects.*
    from projects
    left join formulas
        on formulas.id=projects.formulas_id
    left join documents
        on documents.id = projects.id and documents.users_id = projects.users_id`
    let where = `
    where projects.users_id=${condition.users_id}`
    if (condition.delete_date === null) {
        where += ` and projects.delete_date is null `;
    }
    if (condition.phase != null) {
        if (condition.phase instanceof Array) {
            where += ` and projects.phase between ${condition.phase[0]} and ${condition.phase[1]} `;
        } else {
            where += ` and projects.phase=${condition.phase} `;
        }
    }
    let option = `
    order by projects.id desc
    limit ${skip}, ${limit};
    `
    const data = models.sequelize.query(query + where + option, {
        type: QueryTypes.SELECT
    }).then(function (results, metadata) {
        // 쿼리 실행 성공
        // console.log("results")
        // console.log(results)

        return results;
    }).catch(function (err) {
        // 쿼리 실행 에러 
        console.error(err);
        throw err;
    });

    query = `select count(*) as count from projects`;
    const count = models.sequelize.query(query + where, {
        type: QueryTypes.SELECT
    }).then(function (results, metadata) {
        // 쿼리 실행 성공
        console.log("results")
        // console.log(results)

        return results[0];
    }).catch(function (err) {
        // 쿼리 실행 에러 
        console.error(err);
        throw err;
    });


    return Promise.all([count, data])
        .then(([count, data]) => {
            return {
                count: count.count,
                rows: data
            }
        })

    // return await service.model
    //     .findAndCountAll({
    //         raw: true,
    //         include: [{
    //             model: models.formulas,
    //             as: "formula",
    //             attributes:
    //                 ["product_name"]
    //         }],
    //         where: condition,
    //         order: [
    //             ['id', 'DESC']
    //         ],
    //         offset: skip,
    //         limit: limit
    //     })
    //     .then(async (result) => {
    //         console.log("find data Total :", result.count);
    //         return result;
    //     })
    //     .catch((err) => {
    //         throw err;
    //     })
}

module.exports = service;