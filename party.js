exports.events = function(events_spec) {
  var source;
  var event_names = [];
  var listeners = {};

  function add_event(event_name) {
    api.raise[event_name] = function() {
      console.log('raising event: ' + event_name);
      listeners[event_name].apply(this, arguments);
    }
    Object.defineProperty(api, event_name, {
      set: function(listener) {
        console.log('hooking up event: ' + event_name + ' to listener: ' + listener);
        if (typeof(listener) !== 'function') {
          throw 'hang on a minute -  that listener is not a function: ' + listener;
        }
        listeners[event_name] = listener;
      }
    });
  }

  var api = {};
  api.raised_from = function(new_source) {
    source = new_source;
    source['events'] = api;
    for (var function_spec in events_spec) {
      event_names.push(function_spec.toString());
    }
    events_spec['__source_of'] = function(name) {
      return (typeof(this[name]) == 'function') ? this[name].toString() : 'oops, not a function: ' + name;
    }

    event_names.forEach(function(event_name) {
      console.log('event: ' + event_name + ' has parameters: ' + events_spec.__source_of(event_name));
      console.log('about to define ' + event_name + ' on: ' + api.raise);
      add_event(event_name);
    });
    for (var event in api) {
      console.log('(events api / events) has property: ' + event)
    }
    for (var event in api.raise) {
      console.log('(events api / events).raise has property: ' + event)
    }
  };
  api.raise = {
    toString: function() {
      return 'party.events.raise object'
    }
  };
  api.toString = function() {
    return 'party.events object'
  };
  return api;
}

