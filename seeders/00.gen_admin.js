'use strict';

require('dotenv').config();
const encryption = require('../utils/encryption');

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */

        let password = await encryption
            .hashing('admin')
            .then(result => {
                // console.log(result);
                return result;
            })
            .catch(err => console.error(err));

        // console.log(password.length)

        let admin = {
            email: "admin"
            , password: password
            , userType: 123
            , country: 'KR'
            , brandName: 'BeautyWorks'
            , firstName: 'administrator'
            , lastname: "관리자"
            , mobileContacts: "000-0000-0000"
            , registerDate: new Date()
        }

        await queryInterface.bulkInsert('users', [admin], {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('users', null, {});

    }
};
