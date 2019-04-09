const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateInoutInput(data) {
  let errors = {};

  data.staff = !isEmpty(data.staff) ? data.staff : '';
  data.inout = !isEmpty(data.inout) ? data.inout : '';

  if (Validator.isEmpty(data.staff)) {
    errors.staff = 'staff is required'
  }

  if (Validator.isEmpty(data.inout)) {
    errors.inout = 'Time is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};