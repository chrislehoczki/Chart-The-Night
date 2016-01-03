'use strict';

//THIS TO INTERACT WITH USERS DB

var Users = require('../models/users.js');

function BarHandler () {

	this.addBar = function (req, res) {
		
		//CREATE NEW BAR OBJECT
		var newBar = {
			date: new Date(),
			bar: req.params.bar
			};
		
		//QUERY
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }

				
				//IF NOT IN USER COLLECTION - ADD IT, ELSE RETURN COMMENT	
				if (!checkBarsToday(result.bars, newBar)) {
					
						Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $push: { bars: newBar } }, { "new": true})
			.exec(function (err, result) {
					if (err) { throw err; }
					
					res.json(result.bars);
					
					});//END OF QUERY2 
				
				}//end of if
				
				else {
					res.json("You've already added this bar!")
				}
		});//END OF QUERY1
		
	
	};//END OF ADDBAR
	
	this.deleteBar = function(req, res) {
		
		var barToDelete = req.params.bar;
		Users
			.findOne({ 'github.id': req.user.github.id })
			.exec(function (err, result) {
				if (err) { throw err; }
				
				//ARRAY FOR ALL BARS FOR USER
				var allBars = result.bars;
				
				//ARRAY FOR PREVIOUS BARS
				var prevBars = [];
				//ARRAY FOR TODAYS BARS
				var currentBars = [];
				//ARRAY FOR NEW BARS TO PUSH
				var newBars = [];
				
				//GET ALL OF TODAYS BARS ON CURRENT BARS ARRAY
				allBars.map(function(eachBar) {
					var date = eachBar.date;
					
				 	//IF BAR IS TODAY PUSH TO CURRENT BARS
				 	if (date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate() ) {
					currentBars.push(eachBar)
				 	} 
				 	//ELSE PUSH BAR ONTO PREVIOUS BARS
				 	else {
				 		prevBars.push(eachBar)
				 	}//END OF IF
					
				})//END OF MAP
				
				
				//IF A BAR ON IS NOT ON CURRENT BARS ARRAY - PUSH IT ON TO NEW BARS
				currentBars.map(function(bar) {
					if (bar.bar !== barToDelete) {
					newBars.push(bar) //ADD TO 
				}//end of if

				})//end of map
				
				
				//CONCAT OLD BARS AND NEW BARS
				allBars = prevBars.concat(newBars);

				//REPLACE WITH NEW BARS FROM DB
					Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, {$set: {bars: allBars}}, { "new": true})
			.exec(function (err, result) {
					if (err) { throw err; }
	
				res.json(result.bars)
			});
			
			});
	};
			
	this.getBars = function(req, res) {
		Users
			.findOne({ 'github.id': req.user.github.id })
			.exec(function (err, result) {
				if (err) { throw err; }

				//array to hold bars on this date
				var currentBars = [];
				
				//ADDS ALL TODAYS BARS ONTO ARRAY
				 result.bars.map(function(bar) {
				 	var date = bar.date;
				 	//CHECK THAT BARS ARE ON TODAY
				 	if (date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate() ) {
				 	
				 		currentBars.push(bar.bar)
				 	
				 	}
				 })//END OF MAP
				
				
				//SEND BACK CURRENT BARS
				res.json(currentBars);
			});
	};
			
		

}



function checkBarsToday(bars, barToCheck) {
	
	//CREATE NEW VARS
				
				var	barNames = [];
				barToCheck = barToCheck.bar;
				//PUSH BAR NAMES ON TO ARRAY FOR CURRENT DATE
				bars.map(function(bar) {
					var date = bar.date;
					
				 	//CHECK THAT BARS ARE ON TODAY
				 	if (date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate() ) {
					barNames.push(bar.bar)
					
				 	}; //END OF IF
					
				})//END OF MAP
				
					//IF BAR NAME NOT IN ARRAY FOR CURRENT DATE - ADD
				if (barNames.indexOf(barToCheck) < 0) {
				console.log("false")
				return false; }
				else {
					console.log("true")
					return true;
				}
	
}

module.exports = BarHandler;	
	
	/* OLD CODE
	
	function checkBarsToday(bars, barToCheck) {
	
	//CREATE NEW VARS
				
				var	barNames = [];
				barToCheck = barToCheck.bar;
				//PUSH BAR NAMES ON TO ARRAY FOR CURRENT DATE
				bars.map(function(bar) {
					var date = bar.date;
					
				 	//CHECK THAT BARS ARE ON TODAY
				 	if (date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate() ) {
					barNames.push(bar.bar)
					
				 	}; //END OF IF
					
				})//END OF MAP
				
					//IF BAR NAME NOT IN ARRAY FOR CURRENT DATE - ADD
				if (barNames.indexOf(barToCheck) < 0) {
				console.log("false")
				return false; }
				else {
					console.log("true")
					return true;
				}
	
}*/