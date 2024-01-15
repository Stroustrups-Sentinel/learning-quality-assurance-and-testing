const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello?name=mc_samuel')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello mc_samuel');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({ "surname": "Colombo" })
        .end(function (err, res) {
          assert.equal(res.status, 200, "status should be 200");
          assert.equal(res.type, "application/json", "type should be 'application/json'");
          assert.equal(res.body.name, "Cristoforo", 'name is not "Cristoforo"');
          assert.equal(res.body.surname, "Colombo", 'surname should be "Colombo"');

          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({ "surname": "da Verrazzano" })
        .end(function (err, res) {
          assert.equal(res.status, 200, 'response should be 200');
          assert.equal(res.type, 'application/json', 'response should be "application/json"');
          assert.equal(res.body.name, 'Giovanni', 'name should be "Giovanni"');
          assert.equal(res.body.surname, 'da Verrazzano', 'surname should be "da Verrazzano"');

          done();
        });


    });
  });
});

const Browser = require('zombie');

Browser.localhost = 'http://localhost:3000'; //
Browser.site = 'https://96390t4x-3000.inc1.devtunnels.ms/'; //'http://localhost:3000';

suite('Functional Tests with Zombie.js', function () {
  this.timeout(5000);

  const browser = new Browser();

  suiteSetup(function(done) {
    return browser.visit('http://[0.0.0.0]:3000/', done);
  });


  suite('Headless browser', function () {
    test('should have a working "site" property', function () {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('Submit the surname "Colombo" in the HTML form', function (done) {

      browser.fill('surname', 'Colombo').then(() => {
        browser.pressButton('submit', () => {
          browser.assert.success();
          browser.assert.text('span#name', 'Cristoforo');
          browser.assert.text('span#surname', 'Colombo');
          browser.assert.elements('span#dates', 1);
          done();

        });
      });

    });
    // #6
    test('Submit the surname "Vespucci" in the HTML form', function (done) {
      browser.fill("surname","Vespucci").then(()=>{
        browser.pressButton('submit',()=>{
          browser.assert.success("status should be success");
          browser.assert.text('span#name','Amerigo');
          browser.assert.text('span#surname','Vespucci');
          browser.assert.elements('span#dates',1);
          done();
        });
      });

    });
  });
});
