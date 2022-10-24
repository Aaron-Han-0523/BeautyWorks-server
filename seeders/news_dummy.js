'use strict';

require('dotenv').config();

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
        let data = []
        for (let i = 0; i < 300; i++) {
            let obj = {
                users_id: 1
                , title: "공지 제목" + i
                , contents: "공지 내용" + i
            }
            data.push(obj);
        }


        await queryInterface.bulkInsert('news', data, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('news', null, {});

    }
};
