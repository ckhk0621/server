const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateNoticeInput(data){
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';

  if (Validator.isEmpty(data.title)){
    errors.title = 'title is required'
  }

  if (Validator.isEmpty(data.public)) {
    errors.public = 'Public is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};