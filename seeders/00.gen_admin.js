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

        let super_admin = {
            email: "superadmin"
            , password: password
            , user_type: 200
            , country: 'KR'
            , company_name: 'BeautyWorks'
            , first_name: 'Administrator'
            , last_name: "관리자"
            , mobile_contact: "000-0000-0000"
        }
        let admin = {
            email: "admin"
            , password: password
            , user_type: 100
            , country: 'KR'
            , company_name: 'BeautyWorks'
            , first_name: 'Administrator'
            , last_name: "관리자"
            , mobile_contact: "000-0000-0000"
        }

        await queryInterface.bulkInsert('users', [super_admin, admin], {});
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
