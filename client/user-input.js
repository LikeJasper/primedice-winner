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
      Session.setDefault('betTotal', 0);
      return Session.get('betTotal');
    },
    getBetWin: function () {
      Session.setDefault('betWin', true);
      return Session.get('betWin');
    },
    getBetWinLossTotal: function () {
      Session.setDefault('betWinLossTotal', 0);
      return Session.get('betWinLossTotal');
    }
  });

  Template.makeBet.events({
    'click #make-bet': function (event) {
      var $errorSpace = $('#bet-area .error-text');

      var amount = $('[name=amount]').val();
      var target = $('[name=bet-target]').val();
      var balance = Session.get('userBalance');

      Meteor.call('makeBet', amount, target, balance, function (error, result) {
        if (error) {
          $errorSpace.text(error.message);
        } else {
          console.log(result);

          var bet = result.data.bet;
          Session.set('betTotal', bet.amount);
          Session.set('betWin', bet.win);
          Session.set('betWinLossTotal', Math.ceil(Math.abs(bet.profit)));
          Session.set('userBalance', Math.floor(result.data.user.balance));

          $errorSpace.text('');
        }
      });
    }
  });

  Template.startRun.helpers({
    getRunTotal: function () {
      Session.setDefault('runTotal', 0);
      return Session.get('runTotal');
    },
    getRunWin: function () {
      Session.setDefault('runWin', true);
      return Session.get('runWin');
    },
    getRunWinLossTotal: function () {
      Session.setDefault('runWinLossTotal', 0);
      return Session.get('runWinLossTotal');
    }
  });

  Template.startRun.events({
    'click #start-run': function (event) {
      var $errorSpace = $('#run-area .error-text');

      var base = $('[name=base]').val();
      var target = $('[name=run-target]').val();
      var balance = Session.get('userBalance');
      var bet;

      for (var i=1; i<10; i++) {
        bet = parseInt(base) * i;
        setTimeout(
          Meteor.call('makeBet', bet.toString(), target, balance),
          2000
        );
      }
    }
  });

}());
