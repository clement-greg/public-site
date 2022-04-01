var express = require('express'),
  fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Greg Clement Home Page', data: {
      css: []
    }
  });
});

router.post('/receive', function (req, res, next) {
  //console.log('***************** HERE *************************');
  var body = JSON.stringify(req.body);
  filePath = __dirname + '/public/games/assets/levels/level1.json';
  filePath = filePath.replace('\\routes', '');
  console.log(filePath);
  // req.on('data', function (data) {
  //   body += data;
  // });
  //console.log(body);
  try {
    fs.writeFile(filePath, body, function () {
      res.end();
      console.log('file written');
      next();
    });
  } catch (e) {
    console.log('error:');
    console.log(e);
  }
  // req.on('end', function () {

  // });
});

module.exports = router;
