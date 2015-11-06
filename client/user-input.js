var balance = 0;

Template.userInput.helpers({
  getBalance: function () {
    return balance;
  }
});

Template.userInput.events({
  'submit form': function (event) {
    event.preventDefault();

    var username = $('[name=username]').val();
    var $userBalance = $('#user-balance');
    var $errorBox = $('.error-text');

    if (username) {
      $userBalance.text(username);
      $errorBox.text('');
    } else {
      $errorBox.text("You need to put in a username");
    }
  }
});
