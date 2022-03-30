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

router.get('/bubbles', function (req, res, next) {
    res.render('bubbles', { layout: false });
});

router.get('/connect-4', function (req, res, next) {
    res.render('connect-4', { layout: false });
});

router.get('/pong', function (req, res, next) {
    res.render('pong', { layout: false });
});

router.get('/rock-paper-scissors', function (req, res, next) {
    res.render('rock-paper-scissors', { layout: false, title: 'Rock Paper Scissors' });
});

router.get('/gamemenu', function(req, res,next){
    res.redirect('/games/menu', {title: 'Games Menu'});
});

router.get('/elevate-man', function(req, res, next) {
    res.render('elevate-man', {layout: false, title: 'Elevate Man'});
})

router.get('/GameMenu', function(req, res,next){
    res.redirect('/games/menu');
});

module.exports = router;