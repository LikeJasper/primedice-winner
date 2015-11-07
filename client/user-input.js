Template.userInput.helpers({
  getBalance: function () {
    return Session.get('userBalance') || 0;
  }
});

Template.userInput.events({
  'click #get-balance': function (event) {
    event.preventDefault();
    var errorMsg = '';

    Meteor.call('getBalance', function (error, result) {
      if (error) {
        errorMsg = error.message;
      } else {
        console.log(result);
        Session.set('userBalance', Math.floor(result.data.user.profit));
      }
    });

    $('.error-text').text(errorMsg);
  }
});
