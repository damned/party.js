var party = require('./party.js');

var host = function() {
  var api;
  var partygoers = [];
  var events = party.events({
    on_arrival: function (person) {},
    on_ejection: function (person, reason) {}
  }, { log: 'console'});

  function tell(person, message) {
    person.on_told(message)
  }

  function let_in(person) {
    partygoers.push(person);

    events.raise.on_arrival(person);
    tell(person, 'welcome, ' + person.name());
  }

  api = {
    greet: function (person) {
      if (!person.is_drunk()) {
        let_in(person);
      }
      else {
        events.raise.on_ejection(person, person.name() + ' is drunk');
      }
    },
    events: events,
    toString: function() {
      return 'the host';
    }
  };
  return  api;
};

var person = function(name, drunk) {
  return {
    name: function() {
      return name;
    },
    is_drunk: function() {
      return (drunk !== undefined)
    },
    on_told: function(message) {
      console.log(name + ' hears: "' + message + '", this is: ' + this)
    },
    toString: function() {
      return 'person - (' + name + ')';
    }
  };
};

var bob = person('bob'),
    sue = person('sue'),
    rita = person('rita', 'drunk');

var dan = host();

var grapevine = {
  spread_arrival: function(partygoer) {
    console.log('guess what? ' + partygoer.name() + ' just arrived ' + ' (i am ' + this + ')')
  },
  gossip: function(partygoer, why) {
    console.log('oh, dear: ' + partygoer.name() + ' was not let in because: ' + why + ' (i am ' + this + ')')
  },
  toString: function() {
    return 'the grapevine';
  }
};

// new world
dan.events.on_arrival.wire_to(grapevine).spread_arrival;
dan.events.on_ejection.wire_to(grapevine).gossip;

grapevine.spread_arrival({
  name: function() {
    return 'calling directly from top level';
  }
});

dan.greet(bob);
dan.greet(sue);
dan.greet(rita);
