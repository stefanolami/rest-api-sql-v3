'use strict';
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required',
        },
        notEmpty: {
          msg: 'Please provide a value for first name'
        },
      }
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required',
        },
        notEmpty: {
          msg: 'Please provide a value for last name'
        },
      }
    },
    emailAddress: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        msg: 'This email has already been used'
      },
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address'
        },
        notNull: {
          msg: 'An email is required',
        },
        notEmpty: {
          msg: 'Please provide a value for email'
        },
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      set(val) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('password', hashedPassword);
        },
      validate: {
        notNull: {
          msg: 'A password is required',
        },
        notEmpty: {
          msg: 'Please provide a value for password'
        },
      }
    }
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'Users',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A userId is required',
          },
          notEmpty: {
            msg: 'Please provide a value for userId'
          },
      }
    }});
  };

  return User;
};