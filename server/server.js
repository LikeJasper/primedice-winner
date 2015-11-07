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
    makeBet: function (amount, target) {
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
