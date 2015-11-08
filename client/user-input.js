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
    Meteor.call('makeBet', betAmount, target, balance, function (error, result) {

      if (error) {
        console.log(error);
        $errorSpace.text(error.message);
      } else {
        $errorSpace.text('');

        var betResult = result.data.bet;
        console.log(betResult);
        var betObject = {
          total: betResult.amount,
          win: betResult.win,
          winLossTotal: Math.ceil(Math.abs(betResult.profit))
        };

        if (space === 'run') {
          Session.set('latestRunBet', betObject);
        } else if (space === 'bet') {
          Session.set('latestBet', betObject);
        }

        Session.set('userBalance', Math.floor(result.data.user.balance));
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
    getLatestSingleBet: function () {
      Session.setDefault('latestBet', {
        total: 0,
        win: true,
        winLossTotal: 0
      });
      return Session.get('latestBet');
    }
  });

  Template.makeBet.events({
    'submit form': function (event) {
      event.preventDefault();

      var amount = $('[name=amount]').val();
      var target = $('[name=bet-target]').val();
      var balance = Session.get('userBalance');

      callMakeBet('bet', amount, target, balance);
    }
  });

  Template.startRun.helpers({
    getLatestRunBet: function () {
      Session.setDefault('latestRunBet', {
        total: 0,
        win: true,
        winLossTotal: 0
      });
      return Session.get('latestRunBet');
    }
  });

  var runTimer;

  Template.startRun.events({
    'submit form': function (event) {
      event.preventDefault();

      var bet = 1;
      var base = parseInt($('[name=base]').val());
      var target = $('[name=run-target]').val();
      var stopBalance = $('[name=stop-target]').val();
      var balance;

      var PRIMEDICE_RATE_LIMIT = 525; // live value
      // var PRIMEDICE_RATE_LIMIT = 2000; // slower for testing purposes

      Session.set('latestRunBet', {
        total: 0,
        win: true,
        winLossTotal: 0
      });
      bet = base;

      runTimer = setInterval(function () {
        balance = Session.get('userBalance');

        if (Session.get('latestRunBet').win) {
          bet = base;
        } else {

          if (balance === 0) {
            // lost it all
            alert('Balance is empty! Visit the Primedice faucet to top up.');
            clearInterval(runTimer);
            return;
          } else if (balance >= stopBalance) {
            // reached target
            alert('Balance has reached target!');
            clearInterval(runTimer);
            return;
          } else if (balance < 100) {
            // may as well bet it all and reload from faucet if empty
            bet = balance;
          } else if (balance < 2 * bet) {
            // not enough to continue technique but better than starting with faucet amount
            if (balance < base) {
              base = 1;
            }
            bet = base;
          } else {
            // doubling technique
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
