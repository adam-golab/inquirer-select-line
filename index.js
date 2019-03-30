'use strict';

const Base = require('inquirer/lib/prompts/base');
const observe = require('inquirer/lib/utils/events');
const Paginator = require('inquirer/lib/utils/paginator');
const util = require('util');
const chalk = require('chalk');
const figures = require('figures');
const cliCursor = require('cli-cursor');

/**
 * Function for rendering list choices
 * @param  {Array} choices array with choices
 * @param  {Number} pointer Position of the pointer
 * @return {String}         Rendered content
 */
function listRender(choices, pointer) {
  let output = '';

  choices.forEach(function(choice, i) {
    if (choice.type === 'separator') {
      output += '  ' + choice + '\n';
      return;
    }

    const isSelected = (i === pointer);
    let line = (isSelected ? figures.pointer + ' ' : '  ') + choice;
    if (isSelected) {
      line = chalk.cyan(line);
    }
    output += line + ' \n';
  });

  return output.replace(/\n$/, '');
}

/**
 * Constructor
 * @return {this} Prompt object
 */
function Prompt(...args) {
  Base.apply(this, args);
  this.opt = {
    ...args[0],
    suffix: '',
    prefix: chalk.green('?')
  },
  this.previousAnswers = args[2];
  this.selected = 0;
  this.paginator = new Paginator();
  this.firstRender = true;
  if (typeof this.opt.placeholder === 'function') {
    this.getPlaceholder = this.opt.placeholder;
  } else if (typeof this.opt.placeholder === 'string') {
    this.getPlaceholder = () => this.opt.placeholder;
  } else {
    this.getPlaceholder = () => 'INSERT HERE';
  }

  const events = observe(args[1]);
  const keyDowns = events.keypress.filter(function(e) {
    return e.key.name === 'down';
  }).share();
  const keyUps = events.keypress.filter(function(e) {
    return e.key.name === 'up';
  }).share();
  keyDowns.takeUntil(events.line).forEach(this.onDownKey.bind(this));
  keyUps.takeUntil(events.line).forEach(this.onUpKey.bind(this));
  events.line.forEach(this.onSubmit.bind(this));
  return this;
}
util.inherits( Prompt, Base );

/**
 * get choices based on passed array or function
 * @return {Array} choices to display
 */
Prompt.prototype.getChoices = function() {
  if (typeof this.opt.choices === 'function') {
    return this.opt.choices(this.selected, this.previousAnswers);
  }
  return this.opt.choices;
};

/**
 * handle pressed down key
 */
Prompt.prototype.onDownKey = function() {
  const len = this.getChoices().length;
  this.selected = (this.selected < len) ? this.selected + 1 : 0;
  this.render();
};

/**
 * handle pressed up key
 */
Prompt.prototype.onUpKey = function() {
  const len = this.getChoices().length;
  this.selected = (this.selected > 0) ? this.selected - 1 : len;
  this.render();
};

/**
 * handle pressed enter key
 */
Prompt.prototype.onSubmit = function() {
  this.status = 'answered';

  // Rerender prompt
  this.render();

  this.screen.done();
  cliCursor.show();
  this.done(this.selected);
};

/**
 * Start the Inquiry session
 * @param  {Function} cb Callback when prompt is done
 * @return {this} Prompt object
 */
Prompt.prototype._run = function( cb ) {
  this.done = cb;
  cliCursor.hide();
  this.render();
  return this;
};

/**
 * render prompt to screen
 */
Prompt.prototype.render = function() {
  let message = this.getQuestion();

  if ( this.firstRender ) {
    message += chalk.dim('(Use arrow keys)');
  }

  const choices = [
    ...this.getChoices().slice(0, this.selected),
    this.getPlaceholder(this.selected),
    ...this.getChoices().slice(this.selected),
  ];

  const choicesStr = listRender(choices, this.selected);
  message += '\n' + this.paginator.paginate(choicesStr, this.selected, this.opt.pageSize);

  this.firstRender = false;

  this.screen.render(message);
};

module.exports = Prompt;
