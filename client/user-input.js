/*global
  Template
*/

(function () {
  'use strict';

  Template.displayBalance.helpers({
    getBalance: function () {
      Session.setDefault('userBalance', 0);
      return Session.get('userBalance');
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
      var $errorSpace = $('#bet-area .error-text');

      var amount = $('[name=amount]').val();
      var target = $('[name=target]').val();
      var balance = Session.get('userBalance');

      Meteor.call('makeBet', amount, target, balance, function (error, result) {
        if (error) {
          $errorSpace.text(error.message);
        } else {
          console.log(result);

          var bet = result.data.bet;
          Session.set('betTotal', bet.amount);
          Session.set('win', bet.win);
          Session.set('winLossTotal', Math.ceil(Math.abs(bet.profit)));
          Session.set('userBalance', Math.floor(result.data.user.balance));

          $errorSpace.text('');
        }
      });
    }
  });

}());
