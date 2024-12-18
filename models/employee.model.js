import { DataTypes } from 'sequelize';
import {sequelize} from '../config/connection.config.js'
import bcrypt from 'bcryptjs';
import Department from  './department.model.js';

const Employee = sequelize.define('Employee', {
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
  dob: {
    type: DataTypes.DATE,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },     
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'Email is required' },
      isEmail: {
        msg: 'Email must be a valid email address'
      }
    }
  },
  salary: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active', // Default value
    allowNull: false, // Ensuring that status cannot be null
    validate: {
      isIn: [['active', 'inactive']], // Validation to ensure only 'active' or 'inactive' are set
    }
  }
});

// Add foreign key relationship to Department
Employee.belongsTo(Department, {
  foreignKey: 'department_id',
  targetKey: 'id',
  as: 'department', // Define the alias
});

export default Employee;
