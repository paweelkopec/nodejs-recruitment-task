var app = require('../src/server.js'),
    request = require('supertest');
const mongoose = require("mongoose");
//auth
const {authFactory, AuthError} = require("../src/auth");
const {
    JWT_SECRET,
} = process.env;
const auth = authFactory(JWT_SECRET);
//user
const user = {username: 'premium-jim', password: 'GBLtTyq3E_UNjFnpo9m6'};
//login
describe('POST /login', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/auth')
            .send(user)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});
// create movie
describe('POST /movies', function () {
    this.timeout(6000);
    //new move
    const newMove = {title: "Inception"};
    it('responds with json', function (done) {
        const token = auth(user.username, user.password);
        request(app)
            .post('/movies')
            .send(newMove)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});
//list movies
describe('GET /movies', function () {
    it('responds with json', function (done) {
        const token = auth(user.username, user.password);
        request(app)
            .get('/movies')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                done();
                mongoose.connection.close();
                app.server.close();
            });
    });
});