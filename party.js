exports.events = function(events_spec) {
  var source;
  var event_names = [];
  var receivers = {};
  var receiver_methods = {};

  function point_event_to_receiver(event_name, receiver, method_name, method) {
    console.log('hooking up event: ' + event_name + ' to listener: ' + receiver + '.' + method_name);
    receivers[event_name] = receiver;
    receiver_methods[event_name] = method;
  }

  function add_receiver_proxy_method(receiver_proxy, receiver_propname, event_name, receiver, property) {
    Object.defineProperty(receiver_proxy, receiver_propname, {
      get: function () {
        point_event_to_receiver(event_name, receiver, receiver_propname, property);
      }
    });
  }

  var event = function(event_name) {
    return {
      calls: function(receiver) {
        var receiver_proxy = {};
        for (var receiver_propname in receiver) {
          var property = receiver[receiver_propname];
          console.log('receiver property: ' + receiver_propname);
          if ((typeof(property) === 'function') && (receiver_propname != 'toString')) {
            add_receiver_proxy_method(receiver_proxy, receiver_propname, event_name, receiver, property);
          }
        }
        return receiver_proxy;
      }
    }
  }


  function add_event(event_name) {
    api.raise[event_name] = function() {
      console.log('raising event: ' + event_name);
      receiver_methods[event_name].apply(receivers[event_name], arguments);
    }
    api[event_name] = event(event_name);
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

