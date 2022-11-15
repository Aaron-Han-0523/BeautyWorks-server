const { Op } = require('sequelize');

module.exports.Service = class {
    constructor(model) {
        this.model = model
    }

    create = async (obj) => {
        return await this.model
            .create(obj)
            .then((result) => {
                console.log("create success");
                // console.log(result);
                return result;
            })
            .catch((err) => {
                console.log("create fail");
                throw err;
            })
    }

    update = async (obj, condition) => {
        if (!condition || Object.keys(condition).length == 0) {
            throw new Error("Missing where attribute in the options parameter");
        }
        return await this.model
            .update(Object.assign({
                update_date: new Date()
            }, obj), {
                where: condition
            })
            .then((result) => {
                console.log("updated row count :", result);

                if (result != 1) throw new Error("Use to update only one date!");
                else if (result == 0) console.log("Nothing to update data.");
                return result;
            })
            .catch((err) => {
                throw err;
            })
    }

    allRead = async (condition = {}, limit, skip) => {
        return await this.model
            .findAndCountAll({
                raw: true,
                where: condition,
                order: [
                    ['id', 'DESC']
                ],
                offset: skip,
                limit: limit
            })
            .then((result) => {
                console.log("find data Total :", result.count);
                return result;
            })
            .catch((err) => {
                throw err;
            })
    }

    readOne = async (condition) => {
        return await this.model
            .findOne({
                raw: true,
                where: condition
            })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                throw err;
            })
    }

    delete = async (condition) => {
        return await this.model
            .destroy({
                where: condition
            })
            .then((result) => {
                console.log("deleteed row count :", result);

                if (result != 1) throw new Error("Use to delete only one date!");
                else if (result == 0) console.log("Nothing to delete data.");
                return result;
            })
            .catch((err) => {
                throw err;
            })
    }

    hide = async (condition) => {
        return await this.model
            .update({
                delete_date: new Date()
            }, {
                where: condition
            })
            .then((result) => {
                console.log("hide row count :", result);

                if (result != 1) throw new Error("Use to hide only one date!");
                else if (result == 0) console.log("Nothing to hide data.");
                return result;
            })
            .catch((err) => {
                throw err;
            })
    }

    show = async (condition) => {
        return await this.model
            .update({
                delete_date: null
            }, {
                where: condition
            })
            .then((result) => {
                console.log("show row count :", result);

                if (result != 1) throw new Error("Use to show only one date!");
                else if (result == 0) console.log("Nothing to show data.");
                return result;
            })
            .catch((err) => {
                throw err;
            })
    }

    getPrevID = async (id) => {
        return await this.model
            .findOne({
                raw: true,
                where: {
                    id: { [Op.lt]: id }
                },
                limit: 1,
                attributes: ['id']
            })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                throw err;
            })
    }

    getNextID = async (id) => {
        return await this.model
            .findOne({
                raw: true,
                where: {
                    id: { [Op.gt]: id }
                },
                limit: 1,
                attributes: ['id']
            })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                throw err;
            })
    }

    maxId = async (condition) => {
        return await this.model
            .max('id', {
                where: condition
            })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                throw err;
            })
    }
}