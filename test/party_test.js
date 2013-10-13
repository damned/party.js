var expect = require('chai').expect;
var party = require('../party.js');

describe('party.js', function() {
  it('should allow host object to raise an event which calls another object', function() {
    var events = party.events({
      an_event: function () {}
    });
    var sender = {
      raise_an_event: function () {
        events.raise.an_event();
      }
    }
    events.raised_from(sender);

    var receiver = {
      was_called: false,
      target: function () {
        this.was_called = true;
      }
    };

    sender.events.an_event.calls(receiver).target;

    sender.raise_an_event();

    expect(receiver.was_called).to.be.true;
  })
})