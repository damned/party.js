// events requirements
// 0 - must: clearer than just function replacement vTICK
// 1 - must: just a function call vTICK
// 2 - must: be easy to use in tests
// 3 - should: use function not string name of function vTICK
// 4 - should: warn if event not listened to
// 5 - nice: specifies contract (i.e. what arguments passed)
// 6 - nice: multiple listeners
// 7 - nice: guard who (which obj) can raise events?
// 8 - nice: remove raise object - just call directly on events
// 9 - nice: include events object directly in api of host

var party = require('./lib/events.js')

var host = function() {
  var partygoers = [];
  var events = party.events({
    on_arrival: function (person) {},
    on_ejection: function (person, reason) {}
  });

  function tell(person, message) {
    person.on_told(message)
  }

  function let_in(person) {
    partygoers.push(person);
    events.raise.on_arrival(person);
    tell(person, 'welcome, ' + person.name());
  }

  var api = {
    greet: function (person) {
      if (!person.is_drunk()) {
        let_in(person);
      }
      else {
        events.raise.on_ejection(person, person.name() + ' is drunk');
      }
    },
    toString: function() {
      return 'host object';
    }
  };
  events.raised_from(api);
  return  api;
}

var person = function(name, drunk) {
  return {
    name: function() {
      return name;
    },
    is_drunk: function() {
      return (drunk !== undefined)
    },
    on_told: function(message) {
      console.log(name + ' hears: "' + message + '"')
    },
    toString: function() {
      return 'person - (' + name + ')';
    }
  };
}

var bob = person('bob'),
    sue = person('sue'),
    rita = person('rita', 'drunk');

var dan = host();

var grapevine = {
  spread_arrival: function(partygoer) {
    console.log('guess what? ' + partygoer.name() + ' just arrived')
  },
  gossip: function(partygoer, why) {
    console.log('oh, dear: ' + partygoer.name() + ' was not let in because: ' + why)
  }
}

dan.events.on_arrival = grapevine.spread_arrival;
dan.events.on_ejection = grapevine.gossip;


dan.greet(bob);
dan.greet(sue);
dan.greet(rita);
