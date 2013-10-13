var party = require('../party.js');

var host = function() {
  var api = {};
  party.events({
      on_arrival: function (person) {},
      on_ejection: function (person, reason) {}
    }, { log: 'console'}
  ).wire_from(api);

  function tell(person, message) {
    person.on_told(message)
  }

  function let_in(person) {
    api.on_arrival(person);
    tell(person, 'welcome, ' + person.name());
  }

  api.greet = function (person) {
    if (!person.is_drunk()) {
      let_in(person);
    }
    else {
      api.on_ejection(person, person.name() + ' is drunk');
    }
  };
  api.toString = function() { return 'the host'; };
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
  gossip: function(person, reason) {
    console.log('oh, dear: ' + person.name() + ' was not let in because: ' + reason + ' (i am ' + this + ')')
  },
  toString: function() {
    return 'the grapevine';
  }
};

// new world
dan.on_arrival.wire_to(grapevine).spread_arrival;
dan.on_ejection.wire_to(grapevine).gossip;

grapevine.spread_arrival({
  name: function() {
    return 'calling directly from top level';
  }
});

dan.greet(bob);
dan.greet(sue);
dan.greet(rita);
