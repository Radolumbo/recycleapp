var express = require('express');
var router = express.Router();
var parse = require('csv-parse/lib/sync');
var fs = require('fs')

/* GET home page. */
router.get('/', function(req, res, next) { 
	fs.readFile("./data/Public_Recycling_Bins.csv", 'utf8', function(err,data) {
	var records = parse(data, {columns: true});
	row = records[0];
		res.render('index', { title: 'Recycle App', data:records
		});
	});
    
});

module.exports = router;
