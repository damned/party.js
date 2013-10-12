// events requirements
// 0 - must: clearer than just function replacement
// 1 - must: just a function call
// 2 - should: use function not string name of function
// 3 - nice: specifies contract (i.e. what arguments passed)
// 4 - nice: multiple listeners

var host = function() {
  var partygoers = [];

  function tell(person, message) {
    person.on_told(message)
  }

  function let_in(person) {
    partygoers.push(person);
    api.on_arrival(person);
    tell(person, 'welcome, ' + person.name());
  }

  var api = {

    greet: function (person) {
      if (!person.is_drunk()) {
        let_in(person);
      }
      else {
        api.on_ejection(person, person.name() + ' is drunk');
      }
    },
    on_arrival: function () { // outgoing-event TBD

    },
    on_ejection: function () { // outgoing-event TBD

    }
  };
  return  api;
}

var person = function(name, drunk) {
  return {
    name: function() { return name; },
    is_drunk: function() { return (drunk !== undefined) },
    on_told: function(message) { console.log(name + ' hears: "' + message + '"')}
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

dan.on_arrival = grapevine.spread_arrival;
dan.on_ejection = grapevine.gossip;


dan.greet(bob);
dan.greet(sue);
dan.greet(rita);
