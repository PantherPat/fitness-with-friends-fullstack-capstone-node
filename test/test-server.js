const {
    app,
    runServer,
    closeServer
} = require('../server');

var chai = require('chai');

var chaiHttp = require('chai-http');

const User = require('../models/user');
const Recipe = require('../models/recipe');
const Favorite = require('../models/favorite');

var should = chai.should();

chai.use(chaiHttp);


describe('favorite-search-node-capstone', function () {
    it('should add a favorite on POST', function () {
        chai.request(app)
            .post('/favorite/create')
            .send({
                label: "chicken parmesan",
                url: "www.google.com",
                loggedInUserName: "Johnny@gmail.com"
            })
            .then(function (err, res) {
                res.should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            })
            .catch(err => console.log({
                err
            }));
    });
    it('Should add recipe to favorites', function () {
        chai.request(app)
            .post('/favorite/create')
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));
    });
    it('Should Delete a recipe', function () {

        chai.request(app)
            .delete('/recipe/:id')
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));

    });
    it('Should Get All Users recipes', function () {

        chai.request(app)
            .get('/favorite/get/:loggedInUserName') //<-------????? Get request to '/entry-date/:user'
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));
    });

});
