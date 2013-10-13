var party = exports || party || ({});

party.events = function(events_spec, opts) {
  var options = opts || {};

  function pick_log() {
    function noop() { }
    if (options.log == 'console') {
      return (console === undefined) ? noop : console.log;
    }
    return options.log || noop;
  }

  var log = pick_log();
  var source;
  var event_names = [];
  var recv_objs = {};
  var recv_fns = {};

  function create_events() {
    for(var function_spec in events_spec) {
      event_names.push(function_spec.toString());
    }
    events_spec['__source_of'] = function(name) {
      return this[name].toString();
    };
    event_names.forEach(function(event_name) {
      log('event: ' + event_name + ' has source w/ parameters: ' + events_spec.__source_of(event_name));
      log('about to define ' + event_name + ' on: ' + events_api.raise);
      events_api.raise[event_name] = raise_event_fn(event_name);
      events_api[event_name] = event(event_name);
    });
    for(var event_prop in events_api) {
      log('(events api / events) has property: ' + event_prop)
    }
    for(var event_raiser in events_api.raise) {
      log('(events api / events).raise has property: ' + event_raiser)
    }
  }

  function raise_event_fn(event_name, callback) {
    return function() {
      log('raising event: ' + event_name);
      recv_fns[event_name] && recv_fns[event_name].apply(recv_objs[event_name], arguments);
      callback && callback();
    };
  }

  function add_receiver_proxy_method(receiver_proxy, recv_propname, event_name, recv_obj, property) {
    Object.defineProperty(receiver_proxy, recv_propname, {
      get: function() {
        point_event_to_receiver(event_name, recv_obj, recv_propname, property);
      }
    });
  }

  var event = function(event_name) {
    var event_raiser = raise_event_fn(event_name, function() {
      event_raiser.raised += 1;
    });
    event_raiser.raised = 0;
    event_raiser.wire_to = function(recv_obj) {
      var receiver_type = typeof(recv_obj);
      if (receiver_type === 'function') {
        point_event_to_receiver(event_name, undefined, recv_obj.toString(), recv_obj);
        return {};
      }
      else {
        var receiver_proxy = {};
        for(var propname in recv_obj) {
          var property = recv_obj[propname];
          log('receiver property: ' + propname);
          if ((typeof(property) === 'function') && (propname != 'toString')) {
            add_receiver_proxy_method(receiver_proxy, propname, event_name, recv_obj, property);
          }
        }
        return receiver_proxy;
      }
    };
    return event_raiser;
  };

  function point_event_to_receiver(event_name, receiver_obj, fn_name, fn) {
    log('hooking up event: ' + event_name + ' to listener: ' + receiver_obj + '.' + fn_name);
    recv_objs[event_name] = receiver_obj;
    recv_fns[event_name] = fn;
  }

  var events_api = {
    raise: {
      toString: function() {
        return 'party.events.raise object'
      }
    },
    toString: function() {
      return 'party.events object'
    },
    wire_from: function(source) {
      event_names.forEach(function(event_name) {
        log('about to define ' + event_name + ' on: ' + source);
        source[event_name] = event(event_name);
      });
      return events_api;
    }
  };
  create_events();
  return events_api;
};

party.events.event = function() {
  var this_event = function() { };
  var event_fn_definition = 'function(' + Array.prototype.slice.call(arguments, 1).join(', ') + ') { }';
  this_event.toString =  function() {
     return event_fn_definition;
  };
  return this_event;
};

