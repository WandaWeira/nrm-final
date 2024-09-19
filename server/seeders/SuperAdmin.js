const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    return queryInterface.bulkInsert('Users', [{
      firstName: 'Gidi',
      lastName: 'Sadara',
      email: 'scarletweira@gmail.com',
      password: hashedPassword,
      ninNumber: 'SA123456789',
      phoneNumber: '+256773599715',
      role: 'SuperAdmin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', { email: 'scarletweira@gmail.com' }, {});
  }
};

// npx sequelize-cli db:seed:all
// npx sequelize-cli db:seed --seed SuperAdmin.js
