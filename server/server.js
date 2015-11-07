/*global
  Meteor, HTTP
*/

(function () {
  'use strict';

  Meteor.startup(function () {
    // code to run on server at startup
  });

  var PRIMEDICE_API_ROOT = 'https://api.primedice.com/api/';
  var ACCESS_TOKEN = Meteor.settings.access_token;
  var ACCESS_SUFFIX = '?access_token=' + ACCESS_TOKEN;

  Meteor.methods({
    getBalance: function () {
      return HTTP.get(PRIMEDICE_API_ROOT + 'users/1' + ACCESS_SUFFIX);
    },
    makeBet: function (amount, target, balance) {
      check(amount, String);
      check(target, String);
      check(balance, Number);

      amount = parseInt(amount); // cannot bet fractions of satoshis
      check(amount, Match.Integer); // errors if NaN

      target = Math.floor(Number(target) * 100) / 100; // target at most 2 d.p.

      if (amount > balance) {
        throw new Meteor.Error("bet-too-high",
          "Bet amount must be less than or equal to your balance.");
      }
      if (amount < 0) {
        throw new Meteor.Error("bet-too-low",
          "Bet amount must be positive.");
      }
      if (isNaN(target)) {
        throw new Meteor.Error("target-not-a-number",
          "Target value must be a number between 0 and 99.99.");
      }
      if (target >= 100) {
        throw new Meteor.Error("target-too-high",
          "Target value must be less than 100.");
      }
      if (target < 0) {
        throw new Meteor.Error("target-too-low",
          "Target value must be positive.");
      }

      return HTTP.post(PRIMEDICE_API_ROOT + 'bet' + ACCESS_SUFFIX, {
        params: {
          'amount': amount,
          'target': target,
          'condition': '<'
        }
      });
    }
  });

}());
