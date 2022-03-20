var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('games', { title: 'test page' });
});

router.get('/menu', function (req, res, next) {
    res.render('games-menu', { layout: false });
});

router.get('/tic-tac-toe', function (req, res, next) {
    res.render('tic-tac-toe', { layout: false });
});

router.get('/skeet', function (req, res, next) {
    res.render('skeet', { layout: false });
});

router.get('/asteroids', function (req, res, next) {
    res.render('asteroids', { layout: false });
});

router.get('/moon-landing', function (req, res, next) {
    res.render('moon-landing', { layout: false });
});

router.get('/pac-man', function (req, res, next) {
    res.render('pac-man', { layout: false });
});

module.exports = router;