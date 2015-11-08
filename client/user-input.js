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

  function callMakeBet (space, betAmount, target, balance) {
    var $errorSpace = $('#' + space + '-area .error-text');
    var betResult;

    Meteor.call('makeBet', betAmount, target, balance, function (error, result) {

      if (error) {
        console.log(error);
        $errorSpace.text(error.message);
      } else {
        console.log(result);
        $errorSpace.text('');

        betResult = result.data.bet;
        Session.set(space + 'Total', betResult.amount);
        Session.set(space + 'Win', betResult.win);
        Session.set(space + 'WinLossTotal', Math.ceil(Math.abs(betResult.profit)));
        Session.set('userBalance', Math.floor(result.data.user.balance));
      }

    });
    return betResult;
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

  Template.startRun.events({
    'click #start-run': function () {
      var base = parseInt($('[name=base]').val());
      var target = $('[name=run-target]').val();
      var balance = Session.get('userBalance');
      var bet = 1;
      var betResult;

      runTimer = setInterval(function () {
        betResult = callMakeBet('run', bet.toString(), target, balance);
      }, 525); // primedice api is rate limited
    },
    'click #stop-run': function () {
      clearInterval(runTimer);
    }
  });

}());
