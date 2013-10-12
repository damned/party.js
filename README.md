party.js
========

function <--> event

If you split your js into objects, use DI, and raise events between objects, then exposing a property 'event' function that is set to an appropriate listener in wire-up is a simple way to go.

```js
var a = {
  do_something: function() {
    a.on_done_something()
  },
  on_done_something: function() {} // to be overridden
}

var b = {
  react: function() {
    console.log('b: blimey, a just did something')
  }
}

a.on_done_something = b.react; // wire up event
a.do_something();
```
should give:
```
b: blimey, a just did something
```

The above is nice and obvious in its behaviour in that the event is just a function call from the source object to the receiving object.

For a while now that's what i've done.  However the wireup is not so obvious when you first use it, and it has a few drawbacks.

party.js prefers to keep raising events as just function calls (well, method / object-property function calls) rather than 'named' events e.g.:

```
a.trigger('done_something');
b.on('done_something', function() {
  // whatever
});
```

Existing javascript event libraries use named events, presumably because that's how DOM events work.

With party.js sending (publishing) and receiving (subscribing to) events is just calling and defining functions - see tests for details

TODO summary of party.js api once more stable
