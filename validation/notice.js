const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateNoticeInput(data){
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.content = !isEmpty(data.content) ? data.content : '';

  if (Validator.isEmpty(data.title)){
    errors.title = 'title is required'
  }

  if (Validator.isEmpty(data.content)) {
    errors.content = 'Content is required'
  }

  if (Validator.isEmpty(data.public)) {
    errors.public = 'Public is required'
  }
  
  // if(!Validator.isLength(data.text, { min: 10, max: 300})){
  //   errors.text = 'Text must be between 10 and 300 characters';
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};