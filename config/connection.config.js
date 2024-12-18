import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('employeedb', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
});

const configConnection = {
    connect: async () => {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (err) {
            console.error('Unable to connect to the database:', err);
        }
    },
};

export { sequelize, configConnection };
