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

const thirdQuestion = {
  type: 'selectLine',
  message: 'How should it looks like?',
  name: 'result',
  choices: answers => index => {
    switch (index) {
      case 0:
        return ['second line', 'third line'];
      case 1:
        return ['first line', 'third line'];
      case 2:
        return ['first line', 'second line'];
      default:
        return ['first line', 'second line'];
    }
  },
  placeholder: 'NEW ITEM',
};

inquirer.prompt([
  firstQuestion,
  secondQuestion,
  thirdQuestion,
]).then(function(answers) {
  console.log('Where add line?', answers.line); // eslint-disable-line no-console
  console.log('After which line?', answers.after); // eslint-disable-line no-console
  console.log('How looks?', answers.result); // eslint-disable-line no-console
});
