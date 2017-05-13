'use strict';

const inquirer = require('inquirer');
inquirer.registerPrompt('selectLine', require('../index'));

const firstQuestion = {
  type: 'selectLine',
  message: 'Where add line?',
  name: 'line',
  choices: ['first', 'second', 'third', 'fourth'],
};

const secondQuestion = {
  type: 'selectLine',
  message: 'After which line?',
  name: 'after',
  choices: ['line 1', 'line 2', 'last line'],
  placeholder: index => index === 0 ? 'At first line' : `After: '${secondQuestion.choices[index - 1]}'`,
};

inquirer.prompt([
  firstQuestion,
  secondQuestion,
]).then(function(answers) {
  console.log('Where add line?', answers.line); // eslint-disable-line no-console
  console.log('After which line?', answers.after); // eslint-disable-line no-console
});
