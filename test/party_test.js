var expect = require('chai').expect;
var party = require('../party.js');

describe('party.js', function() {
  var events = party.events;
  var receiver;

  beforeEach(function() {
    receiver = receiver_spy();
    expect(receiver.was_called).to.be.false;
  });

  it('should allow host object to raise an event which calls another object', function() {
    var sender = {
      events: events({
        an_event: function() {
        }
      })
    };

    sender.events.an_event.wire_to(receiver).target;

    sender.events.raise.an_event();

    expect(receiver.was_called).to.be.true;
  });

  it('should pass through arguments to receiver', function() {
    var sender = {
      events: events({
        on_introduction: function(name, title) {}
      })
    };

    sender.events.on_introduction.wire_to(receiver).target;

    sender.events.on_introduction('bob', 'mr.');

    expect(receiver.called_with_arguments).to.eql(['bob', 'mr.']);
  });

  describe('function event receiver', function() {
    it('should allow function event receiver', function() {
      var party_events = events({
        an_event: function() { }
      });

      var receiver_was_called = false;

      party_events.an_event.wire_to(function() {
        receiver_was_called = true;
      });

      party_events.raise.an_event();

      expect(receiver_was_called).to.be.true;
    });
  });


  describe('event declaration', function() {
    it('should allow event declaration using cheaper? alternative syntax than dummy function', function() {
      var event = events.event;
      var sender = {
        events: events({
          some_event: event('a', 'b')
        })
      };
      sender.events.some_event.wire_to(receiver).target;

      sender.events.some_event();

      expect(receiver.was_called).to.be.true;
    });
  });

  describe('making lighter', function() {
    it('should allow definition of events property in sender initialisation', function() {
      var sender = {
        events: events({
          an_event: function() {
          }
        })
      };

      var receiver = receiver_spy();

      sender.events.an_event.wire_to(receiver).target;

      sender.events.raise.an_event();

      expect(receiver.was_called).to.be.true;
    });

    it('should allow raising of events by calling function directly on events object', function() {
      var sender = {
        events: party.events({
          an_event: function() {}
        })
      };
      var receiver = receiver_spy();

      sender.events.an_event.wire_to(receiver).target;

      sender.events.an_event();

      expect(receiver.was_called).to.be.true;
    });

  });

  function receiver_spy() {
    return {
      was_called: false,
      called_with_arguments: [],
      target: function() {
        this.called_with_arguments = Array.prototype.slice.call(arguments);
        this.was_called = true;
      },
      toString: function() {
        return 'receiver-spy';
      }
    }
  }
});