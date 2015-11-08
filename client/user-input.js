/*global
  Template
*/

(function () {
  'use strict';

  function callGetBalance () {

    Meteor.call('getBalance', function (error, result) {
      if (error) {
        console.log(error);
        $('#balance-area .error-text').text(error.message);
      } else {
        console.log(result);
        Session.set('userBalance', Math.floor(result.data.user.balance));
      }
    });

  }

  function callMakeBet (space, betAmount, target, balance, callback) {
    var $errorSpace = $('#' + space + '-area .error-text');
    Meteor.call('makeBet', betAmount, target, balance, function (error, result) {

      if (error) {
        console.log(error);
        $errorSpace.text(error.message);
      } else {
        console.log(result);
        $errorSpace.text('');

        var betResult = result.data.bet;
        console.log(betResult);
        Session.set(space + 'Total', betResult.amount);
        Session.set(space + 'Win', betResult.win);
        Session.set(space + 'WinLossTotal', Math.ceil(Math.abs(betResult.profit)));
        Session.set('userBalance', Math.floor(result.data.user.balance));

        latestBet = betResult;
      }

    });

    if (callback) {
      callback();
    }
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
      var amount = $('[name=amount]').val();
      var target = $('[name=bet-target]').val();
      var balance = Session.get('userBalance');

      callMakeBet('bet', amount, target, balance);
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

  var runTimer;
  var PRIMEDICE_RATE_LIMIT = 525; // live value
  // var PRIMEDICE_RATE_LIMIT = 2000; // slower for testing purposes
  var bet = 1;
  var latestBet = {};

  Template.startRun.events({
    'click #start-run': function () {
      var base = parseInt($('[name=base]').val());
      var target = $('[name=run-target]').val();
      var balance;

      latestBet = {};
      bet = base;

      runTimer = setInterval(function () {
        balance = Session.get('userBalance');

        if (latestBet.win) {
          bet = base;
        } else {

          if (balance === 0) {
            alert('Balance is empty! Visit the Primedice faucet to top up.');
            clearInterval(runTimer);
          } else if (balance < 2 * bet) {
            if (balance < base) {
              base = 1;
            }
            bet = base;
          } else {
            bet *= 2;
          }
        }

        callMakeBet('run', bet.toString(), target, balance);

      }, PRIMEDICE_RATE_LIMIT);
    },
    'click #stop-run': function () {
      clearInterval(runTimer);
    }
  });

}());
