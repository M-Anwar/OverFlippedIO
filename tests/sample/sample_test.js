var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var positionSystem = require("../../src/positionSystem")

describe('Position System', function() {
  it('positionSystem(parm) should return 10 just for fun', function() {
    positionSystem("Hello World")
    expect(positionSystem("Hello World")).to.equal(10);
  });

  it('positionSystem(parm) should return 0 just for fun', function() {
    positionSystem("Hello World")
    expect(positionSystem("Hello World")).to.equal(10);
  });

});

