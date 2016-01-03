
'use strict';

//THIS TO INTERACT WITH BARS DB

//ADD SCHEMAS AND COLLECTIONS
var Bars = require('../models/bars.js')
var Bar = require('../models/bars');
var Users = require('../models/users.js');

//OBJECT FOR INTERACTION METHODS
function PublicBarHandler() {



	this.addPublicBar = function (req, res) {
	
		Bars.findOne({ 'name': req.params.bar }, function (err, result) {
				if (err) {
					return err;
				}
				
				var counter = 1;
				
				if (result) {
				//CHECK DATES AND RETURN 0 COUNTER IF NO ENTRIES FOR TODAYS DATE
				counter = 0;
				result.date.map(function(date) {
					
					if (date[0].getFullYear() === new Date().getFullYear() && date[0].getMonth() === new Date().getMonth() && date[0].getDate() === new Date().getDate())
				{
					counter += 1;
				}
				});
				console.log("COUNTER AFTER CHECKING FOR BAR: " + counter)
				}
				
				
				//IF THERE IS NO BAR IN THE DB
				if (!result) {
				    
				    var newBar = new Bar();

					newBar.name = req.params.bar;
					newBar.date[0] = [new Date, 1];
					newBar.date[1] = [new Date("October 13, 2014 11:13:00"), 1];
					

					newBar.save(function (err, result) {
						if (err) {
							throw err;
						}

						console.log("new bar made")
						res.json(newBar)
					});
				    
				}//end of if 
				
				
				
				//IF BAR EXISTS BUT NO ENTRY FOR TODAYS DATE - ADD NEW ENTRY
				
				//IF COUNTER IS 0 -- add new date
				else if (counter === 0) {
					
					var dateArray = [new Date(), 1]
					
					Bars.findOneAndUpdate({ 'name': req.params.bar }, { $push: { date: dateArray }}, {"new":true}) 
					.exec(function (err, result) {
				if (err) {
					return err;
				}
					
					res.json(result)
					
				});
				
			
				
				
				}//end of if

				//ELSE THERE IS A BAR AND HAS A DATE -- ADD 1 TO IT
				else {
					console.log("its going too far")
					//GET ALL DATES AND HOLD IN VAR
				var barData = result.date;
				console.log("BAR DATA: " + barData)
				
				//CHECK TO SEE IF USER IS ALREADY GOING TO BAR ON THIS DATE
            var barNames = [];
                	Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }

				//CREATE NEW VARS
				var allBars = result.bars;
				
				//PUSH BAR NAMES ON TO ARRAY FOR CURRENT DATE
				allBars.map(function(eachBar) {
					var date = eachBar.date;
				
				 	//CHECK THAT BARS ARE ON TODAY
				 	if (date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate() ) {
					barNames.push(eachBar.bar)
					
				 	}; //END OF IF
					
				})//END OF MAP
				
				console.log("BAR NAMES" + barNames);
				//IF BAR NAME IS IN ARRAY FOR CURRENT DATE - RETURN SOMETHING
				if (barNames.indexOf(req.params.bar) >= 0) {
					res.json("you already added this bar") 
				}
				
				else {

				    //ADD THE BAR TO THE PUBLIC BARS DB FOR THIS DATE
				 
				//GO THROUGH ALL DATES TO CHECK IF TODAYS DATE - ADD 1 TO TODAYS DATE
				barData.map(function(date) {
					if (date[0].getFullYear() === new Date().getFullYear() && date[0].getMonth() === new Date().getMonth() && date[0].getDate() === new Date().getDate())
				{
					date[1] +=1;	
					
				}
				}); //end of map
				
				
				//UPDATE BARS WITH NEW DATA
				Bars
			.findOneAndUpdate({ 'name': req.params.bar }, { $set: { date: barData} }, { "new": true})
			.exec(function (err, result) {
					if (err) { throw err; }
					
					res.json(result);
				
				});//END OF QUERY 3

				}//END OF ELSE 2
				
			    })//END OF QUERY 2
			    
				}//END OF ELSE 1
		}); //END OF QUERY 1
	};
	

	
this.getPublicBar = function(req, res) {
    
    Bars.findOne({ 'name': req.params.bar }, function (err, result) {
        
		if (result) {
		    //var to hold current data for today- make an array so if no data - returns 0
		  var currentDate = [0, 0];
		
		
	    var dates = result.date;
		 dates.map(function(date) {
				 	//FIND DATA FOR CURRENT DATE
				if (date[0].getFullYear() === new Date().getFullYear() && date[0].getMonth() === new Date().getMonth() && date[0].getDate() === new Date().getDate() ) {
				 		currentDate = date;
				 	}
				 })//END OF MAP
        //sends visitors going for today
        res.json(currentDate[1]);
		}
		else {
		    //nobody is going as bar no results for today
		    res.json(0);
		}
    });
    
}; //end of get public bar


this.deletePublicBar = function(req,res) {

		Bars.findOne({ 'name': req.params.bar }, function (err, result) {
				if (err) {
					return err;
				}
				//IF THERE IS A BAR IN THE DB
				
				var newArray = [];
				
				//get all dates
				var barData = result.date;
				console.log(barData);
				
				//IF IT IS TODAYS DATE - ADD 1
				barData.map(function(date) {
					if (date[0].getFullYear() === new Date().getFullYear() && date[0].getMonth() === new Date().getMonth() && date[0].getDate() === new Date().getDate())
				{
				    
				    if (date[1] === 0) {
				        date[1] ===0;
				    }
				    else {
					date[1] -=1;	
				    }
				}
				}); //end of map
				
				console.log(barData)
				//UPDATE BARS WITH NEW DATA
				Bars
			.findOneAndUpdate({ 'name': req.params.bar }, { $set: { date: barData} }, { "new": true})
			.exec(function (err, result) {
					if (err) { throw err; }
					
					res.json(result);
				
				});//END OF QUERY
    
});
}




}; //end of public handler

module.exports = PublicBarHandler;