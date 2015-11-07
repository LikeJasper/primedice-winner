/*global
  Template
*/

(function () {
  'use strict';

  Template.displayBalance.helpers({
    getBalance: function () {
      return Session.get('userBalance') || 0;
    }
  });

  Template.displayBalance.events({
    'click #get-balance': function (event) {
      var errorMsg = '';

      Meteor.call('getBalance', function (error, result) {
        if (error) {
          errorMsg = error.message;
        } else {
          console.log(result);
          Session.set('userBalance', Math.floor(result.data.user.balance));
        }
      });

      $('#balance-area .error-text').text(errorMsg);
    }
  });

  Template.makeBet.helpers({
    getBetTotal: function () {
      return Session.get('betTotal') || 0;
    },
    getWin: function () {
      Session.setDefault('win', true);
      return Session.get('win');
    },
    getWinLossTotal: function () {
      return Session.get('winLossTotal') || 0;
    }
  });

  Template.makeBet.events({
    'click #make-bet': function (event) {
      var errorMsg = '';

      Meteor.call('makeBet', function (error, result) {
        if (error) {
          errorMsg = error.message;
        } else {
          console.log(result);

          var bet = result.data.bet;
          Session.set('betTotal', bet.amount);
          Session.set('win', bet.win);
          Session.set('winLossTotal', Math.ceil(Math.abs(bet.profit)));
          Session.set('userBalance', Math.floor(result.data.user.balance));
        }
      });

      $('#bet-area .error-text').text(errorMsg);
    }
  });

}());
