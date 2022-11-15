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
            , user_type: 1<<5
            , country: 'KR'
            , company_name: 'BeautyWorks'
            , first_name: 'administrator'
            , last_name: "관리자"
            , mobile_contact: "000-0000-0000"
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
