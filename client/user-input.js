/*global
  Template
*/

(function () {
  'use strict';

  function callGetBalance () {

    Meteor.call('getBalance', function (error, result) {
      if (error) {
        $('#balance-area .error-text').text(error.message);
      } else {
        console.log(result);
        Session.set('userBalance', Math.floor(result.data.user.balance));
      }
    });

  }

  function callMakeBet (space, bet, target, balance) {

    Meteor.call('makeBet', bet.toString(), target, balance, function (error, result) {
      var $errorSpace = $('#run-area .error-text');

      if (error) {
        $errorSpace.text(error.message);
      } else {
        console.log(result);

        var bet = result.data.bet;
        Session.set('runTotal', bet.amount);
        Session.set('runWin', bet.win);
        Session.set('runWinLossTotal', Math.ceil(Math.abs(bet.profit)));
        Session.set('userBalance', Math.floor(result.data.user.balance));

        $errorSpace.text('');
      }

    });
  }

  Template.displayBalance.onRendered(callGetBalance);

  Template.displayBalance.helpers({
    getBalance: function () {
      Session.setDefault('userBalance', 0);
      return Session.get('userBalance');
    }
  });

  Template.displayBalance.events({
    // needed in case a bet is made on the primedice site
    'click #get-balance': callGetBalance
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
      var base = parseInt($('[name=base]').val());
      var target = $('[name=run-target]').val();
      var balance = Session.get('userBalance');
      var bet = 1;

      setInterval(function () {
        callMakeBet('run', bet, target, balance);
      }, 5000);
    }
  });

}());
