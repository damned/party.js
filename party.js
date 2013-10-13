exports.events = function(events_spec, opts) {
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
      add_event(event_name);
    });
    for(var event in events_api) {
      log('(events api / events) has property: ' + event)
    }
    for(var event_raiser in events_api.raise) {
      log('(events api / events).raise has property: ' + event_raiser)
    }
  }

  function add_event(event_name) {
    events_api.raise[event_name] = function() {
      log('raising event: ' + event_name);
      recv_fns[event_name].apply(recv_objs[event_name], arguments);
    };
    events_api[event_name] = event(event_name);
  }

  function add_receiver_proxy_method(receiver_proxy, recv_propname, event_name, recv_obj, property) {
    Object.defineProperty(receiver_proxy, recv_propname, {
      get: function() {
        point_event_to_receiver(event_name, recv_obj, recv_propname, property);
      }
    });
  }

  var event = function(event_name) {
    return {
      calls: function(recv_obj) {
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
      }
    }
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
    }
  };
  create_events();
  return events_api;
};

