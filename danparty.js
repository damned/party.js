// events requirements
// 0 - must: clearer than just function replacement vTICK
// 1 - must: just a function call vTICK
// 2 - must: be easy to use in tests
// 3 - should: use function not string name of function vTICK
// 4 - should: warn if event not listened to
// 5 - should: keep same 'this' behaviour as direct call (if possible?)
// 6 - nice: specifies contract (i.e. what arguments passed)
// 7 - nice: multiple listeners
// 8 - nice: guard who (which obj) can raise events?
// 9 - nice: remove raise object - just call directly on events
// 10 - nice: include events object directly in api of host (remove 'raised_from')?

var party = require('./party.js')

var host = function() {
  var api = {};
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

    //old world
    api.on_arrival(person);

    //new world
//    events.raise.on_arrival(person);
    tell(person, 'welcome, ' + person.name());
  }

  api = {
    greet: function (person) {
      if (!person.is_drunk()) {
        let_in(person);
      }
      else {
        //new world
//        events.raise.on_ejection(person, person.name() + ' is drunk');

        //new world
        api.on_ejection(person, person.name() + ' is drunk');
      }
    },
    toString: function() {
      return 'the host';
    }

    //old world
    ,
    on_arrival: function(){},
    on_ejection: function(){}
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
//dan.events.on_arrival = grapevine.spread_arrival;
//dan.events.on_ejection = grapevine.gossip;

// old world
dan.on_arrival = grapevine.spread_arrival;
dan.on_ejection = grapevine.gossip;

grapevine.spread_arrival({ name: function() { return 'calling directly from top level'; }})

dan.greet(bob);
dan.greet(sue);
dan.greet(rita);
