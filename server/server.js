Meteor.startup(function () {
  // code to run on server at startup
});

Meteor.methods({
  getBalance: function (username) {
    var responseObj = HTTP.call('GET', 'https://api.primedice.com/api/users/' + username);
    return responseObj;
  }
});
