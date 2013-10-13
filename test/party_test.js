var expect = require('chai').expect;
var party = require('../party.js');

describe('party.js', function() {
  it('should allow host object to raise an event which calls another object', function() {
    var events = party.events({
      an_event: function() {
      }
    });
    var sender = {};
    events.raised_from(sender);

    var receiver = {
      was_called: false,
      target: function() {
        this.was_called = true;
      }
    };

    sender.events.an_event.calls(receiver).target;

    sender.events.raise.an_event();

    expect(receiver.was_called).to.be.true;
  });
  describe('function event receiver', function() {
    it('should allow function event receiver', function() {
      var events = party.events({
        an_event: function() { }
      });
      events.raised_from({});
      var receiver_was_called = false;
      var receiver = function() {
        receiver_was_called = true;
      };
      events.an_event.calls(receiver);

      events.raise.an_event();

      expect(receiver_was_called).to.be.true;
    });
  });
  describe('making lighter', function() {
    it('should not need "raised_from"', function() {

    });
  });
})