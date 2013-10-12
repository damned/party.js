// events requirements
// 0  [vTICK] must: clearer than just function replacement
// 1  [vTICK] must: just a function call
// 2          must: be easy to use in tests
// 3          must: give good error messages on misuse
// 4  [vTICK] should: use function not string name of function
// 5          should: warn if event not listened to
// 6  [vTICK] should: set 'this' to be the receiving object (so event independent of source), change to api
//                  (to explicitly pass receiving obj so 'party' knows who to set 'this' to)
// 7          nice: specifies contract (i.e. what arguments passed)
// 8          nice: multiple listeners
// 9          nice: guard who (which obj) can raise events?
// 10         nice: remove raise object - just call directly on events
// 11         nice: include events object directly in api of host (remove 'raised_from')?
// 12         nice: allow a pure-function listener (not on an object)

var party = require('./party.js')

var host = function() {
  var api;
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

  api = {
    greet: function (person) {
      if (!person.is_drunk()) {
        let_in(person);
      }
      else {
        events.raise.on_ejection(person, person.name() + ' is drunk');
      }
    },
    toString: function() {
      return 'the host';
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
      console.log(name + ' hears: "' + message + '", this is: ' + this)
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
    console.log('guess what? ' + partygoer.name() + ' just arrived ' + ' (i am ' + this + ')')
  },
  gossip: function(partygoer, why) {
    console.log('oh, dear: ' + partygoer.name() + ' was not let in because: ' + why + ' (i am ' + this + ')')
  },
  toString: function() {
    return 'the grapevine';
  }
}

// new world
dan.events.on_arrival.calls(grapevine).spread_arrival;
dan.events.on_ejection.calls(grapevine).gossip;

grapevine.spread_arrival({ name: function() { return 'calling directly from top level'; }})

dan.greet(bob);
dan.greet(sue);
dan.greet(rita);
