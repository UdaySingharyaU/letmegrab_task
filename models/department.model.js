import { DataTypes } from 'sequelize';
import {sequelize} from '../config/connection.config.js'


const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: {
        // Regular expression to ensure the value is only a string (alphabetic characters)
        args: /^[a-zA-Z\s]+$/,
        msg: 'Name should only contain letters and spaces.' // Custom error message
      },
      notEmpty: {
        msg: 'Name cannot be empty' // Custom error message if name is empty
      }
    }
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  }
});

export default Department;
