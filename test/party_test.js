var expect = require('chai').expect;
var party = require('../party.js');

describe('party.js', function() {
  it('should allow host object to raise an event which calls another object', function() {
    var sender = {
      events: party.events({
        an_event: function() {
        }
      })
    };

    var receiver = receiver_spy();

    sender.events.an_event.calls(receiver).target;

    sender.events.raise.an_event();

    expect(receiver.was_called).to.be.true;
  });

  describe('function event receiver', function() {
    it('should allow function event receiver', function() {
      var events = party.events({
        an_event: function() {
        }
      });

      var receiver_was_called = false;

      events.an_event.calls(function() {
        receiver_was_called = true;
      });

      events.raise.an_event();

      expect(receiver_was_called).to.be.true;
    });
  });

  describe('making lighter', function() {
    it('should allow definition of events property in sender initialisation', function() {
      var sender = {
        events: party.events({
          an_event: function() {
          }
        })
      };

      var receiver = receiver_spy();

      sender.events.an_event.calls(receiver).target;

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

      sender.events.an_event.calls(receiver).target;

      sender.events.an_event();

      expect(receiver.was_called).to.be.true;
    });

  });


  function receiver_spy() {
    return {
      was_called: false,
      target: function() {
        this.was_called = true;
      },
      toString: function() {
        return 'receiver-spy';
      }
    }
  }
});