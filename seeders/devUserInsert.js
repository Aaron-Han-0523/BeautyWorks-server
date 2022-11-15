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
            .hashing('dev')
            .then(result => {
                // console.log(result);
                return result;
            })
            .catch(err => console.error(err));

        // console.log(password.length)

        let dev =
        {
            email: "user-dev@email.com"
            , password: password
            , user_type: 0
            , country: 'KR'
            , brand_name: 'devbrandName'
            , first_name: 'devfirstName'
            , last_name: "devlastName"
            , mobile_contact: "123-1234-1234"
            , company_name: "devcompanyName"
            , team: "devTeam"
            , position: "devPosition"
        }


        await queryInterface.bulkInsert('users', [dev], {});
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
