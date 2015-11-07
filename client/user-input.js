Template.userInput.helpers({
  getBalance: function () {
    return Session.get('userBalance') || 0;
  }
});

Template.userInput.events({
  'submit form': function (event) {
    event.preventDefault();

    var username = $('[name=username]').val();
    var $errorBox = $('.error-text');

    if (username) {

      if (username !== Session.get('username')) {
        Session.set('username', username);
      }

      var userBalance = Session.get('userBalance');
      var newBalance = typeof(userBalance) === "number" ? userBalance + 1 : 0;
      Session.set('userBalance', newBalance);

      $errorBox.text('');

    } else {
      $errorBox.text("You need to put in a username");
    }
  }
});
