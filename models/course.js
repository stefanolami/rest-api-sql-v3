'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A title is required',
        },
        notEmpty: {
          msg: 'Please provide a value for title'
        },
      }
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A dascription is required',
        },
        notEmpty: {
          msg: 'Please provide a value for description'
        },
      }
    },
    estimatedTime: {
      type: Sequelize.STRING,
    },
    materialsNeeded: {
      type: Sequelize.STRING,
    },
  }, { sequelize });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
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
      }
    });
  };

  return Course;
};