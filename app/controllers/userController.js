

var SearchBox = React.createClass({
    
    getInitialState: function() {
        return {
            searchData: localStorage.getItem("userLocation")
        }
    },
    //DO SEARCH + INSERT DATA ON LOAD
    componentDidMount: function() {
    getBarData(this.state.searchData);
    },
    //DO SEARCH + INSERT DATA ON CLICK
    getData: function() {
    localStorage.setItem('userLocation', this.state.searchData);
    getBarData(this.state.searchData);
    },

    //CHANGE SEARCH TERM STATE ON INPUT
    setName: function(e) {
    
    this.setState({searchData: e.target.value});
    },
    
    //RENDER SEARCH BOX AND BUTTON
    render: function(){
        return (
            <div>
            
            <input type="text" onChange={this.setName} value={this.state.searchData} ></input>
            <button className="btn btn-primary" onClick={this.getData}> Search </button>
            </div>
            )
    }
    
});


 //SIMPLE BAR COMPONENT
var Bar = React.createClass({

    
    getInitialState: function() {
        return {
            id: this.props.config.id,
            url: this.props.config.url,
            name: this.props.config.name,
            tips: this.props.config.tips, 
            rating: this.props.config.rating,
            going: 0,
            addimg: "/public/img/add.png",
            msg: "Add Bar",
            classref: this.props.config.classref
            
        };
    },
    
    componentDidMount: function() {
        
        //FADE IN COMPONENT
    // Get the components DOM node
    var elem = ReactDOM.findDOMNode(this);
    // Set the opacity of the element to 0
    elem.style.opacity = 0;
    window.requestAnimationFrame(function() {
    // Now set a transition on the opacity
    elem.style.transition = "opacity 1000ms";
    // and set the opacity to 1
    elem.style.opacity = 1;
    });
        
        //AJAX1: CONVERTS CLASS/ COLOUR OF BAR IF GOING
         var userUrl = "https://nightlifeapp-christoph-phillips-1.c9users.io/api"
        
         ajaxFunctions.ajaxRequest('GET', userUrl, function (data) {
            
            console.log(data)
            
            if (data.indexOf(this.state.name) >= 0) {
                this.setState({addimg: "/public/img/drink.png"});
                this.setState({classref:"go"})
                this.setState({msg: "Remove Bar"});
            }
        
        }.bind(this));
        
        //AJAX 2: GETS NO. PEOPLE GOING TO BAR
        var barUrl = "https://nightlifeapp-christoph-phillips-1.c9users.io/public/api/" + this.state.name;
        ajaxFunctions.ajaxRequest('GET', barUrl, function (data) {
        
        this.setState({going: data}); //uses setstate to change values in initial state

        console.log(data)
    
        }.bind(this))     
 
    },
    
    
    addUser: function() {
        
        if (this.state.classref === "go") {
            
            this.setState({classref: "notgo"});
            this.setState({addimg: "/public/img/add.png"});
            this.setState({msg: "Add Bar"});
        
        //AJAX 1: Remove a user from bars DB
        var barUrl = "https://nightlifeapp-christoph-phillips-1.c9users.io/public/api/" + this.state.name;
        ajaxFunctions.ajaxRequest('DELETE', barUrl, function (data) {
            console.log(data)
        });
        
        
        //AJAX 2: Removes bar from user
        
        var userUrl = "https://nightlifeapp-christoph-phillips-1.c9users.io/api/" + this.state.name;
        
         ajaxFunctions.ajaxRequest('DELETE', userUrl, function (data) {
            
            console.log(data)
            var getUrl = "https://nightlifeapp-christoph-phillips-1.c9users.io/public/api/" + this.state.name;
        ajaxFunctions.ajaxRequest('GET', getUrl, function (data) {
        
        this.setState({going: data}); //uses setstate to change values in initial state

        console.log(data)
    
        }.bind(this));   
            
            
        }.bind(this));
       
        //AJAX 3 - Gets new data
        
        
            
            
            
        }
        else {
            
            this.setState({classref: "go"});
            this.setState({addimg: "/public/img/drink.png"});
            this.setState({msg: "Remove Bar"});
            
        var name = this.state.name;
        //AJAX 1: adds bar to bars collection
        
           var barUrl2 = "https://nightlifeapp-christoph-phillips-1.c9users.io/public/api/" + this.state.name;
        ajaxFunctions.ajaxRequest('POST', barUrl2, function (data) {
            console.log(data)
        });
        

        //AJAX 2: adds bar to user
        var barUrl = "https://nightlifeapp-christoph-phillips-1.c9users.io/api/" + this.state.name;
        
        ajaxFunctions.ajaxRequest('POST', barUrl, function (data) {
        console.log(data)
        
        var barUrl3 = "https://nightlifeapp-christoph-phillips-1.c9users.io/public/api/" + name;
        
        ajaxFunctions.ajaxRequest('GET', barUrl3, function (data) {
        
        this.setState({going: data}); //uses setstate to change values in initial state

        console.log(data)
    
        }.bind(this));  
        
        
         }.bind(this));

        }


    },
    
    
    
    render: function() {
        var imgClass = "barimg";
        var ulClass = "data"
        return (
            
        <div className={this.state.classref}>
            
            <a className={imgClass} href={this.state.url}>
            <img  src={this.props.config.photo}/>
            </a>
            
            <div className={ulClass}> 
            <ul>
                <li><h3>{this.state.name}</h3> </li>
                <li> {this.state.tips} </li>
                <li> Rating: {this.state.rating} </li>
                <li className="visitors"> <h2> Visitors Tonight {this.state.going} </h2></li>
            </ul>
            
            </div>
            <div className="addBar" onClick={this.addUser}>
            <img src={this.state.addimg}></img>
            <h3> {this.state.msg} </h3>
            </div>
        
        </div>
        )
    }
});


function getBarData(searchData) {
    //COMPILE API URL
        var id = "client_id=NLH24D4ZAGNFJ2QCKSPPATPZO01H1MOPV1ALXEHT3P00ENHZ&";
        var secret = "client_secret=N4DA2NIQZSNHEKHZLKOP0NCVZX5YHDCB5OANQS3D34S40AXY&"
        
        var foursquareUrl = "https://api.foursquare.com/v2/venues/explore?" 
        + id 
        + secret 
        + "v=20130815&near=" 
        + searchData
        + "&section=drinks&limit=10"


        //SEND GET REQUEST
        $.getJSON(foursquareUrl, function(data) {
            
        var bars = data.response.groups[0].items;

        //CLEAR ELEMTN
        document.getElementById("bars").innerHTML = "";
        
        //CREATE INDIVIDUAL ELEMENT FOR EACH BAR
        bars.map(function(bar) {

            //create URL to get photos
            var apiUrl = "https://api.foursquare.com/v2/venues/" + bar.venue.id + "/photos?" + id + secret + "v=20140130";
            
            //GET request to API
            $.getJSON(apiUrl, function(data) {
            var barPhoto = data.response.photos.items[0].prefix + "150x150" + data.response.photos.items[0].suffix;
            
            
            //DO SOME DATA CHECKING IN CASE OF UNDEFINED
            if (bar.tips) {
                var tips = bar.tips[0].text;
                var barUrl = "https://foursquare.com/v/" + bar.venue.name +"/" + bar.venue.id;
            }
            
            if (bar.venue.price) {
                var price = bar.venue.price.message;
            }
            
            //CREATE BAR OBJECT
             var barObject = {
                id: bar.venue.id,
                url: bar.venue.url || barUrl,
                name: bar.venue.name,
                price: price,
                tips: tips,
                rating: bar.venue.rating,
                photo: barPhoto,
                going: 0,
                classref: "notgo"
            }
    
            //CREATE ELEMENT FUNCTION
            createElement(barObject);
        
            });//END OF SECOND API CALL
           
            });//end of MAP
        
      
        });//END OF FIRST API CALL
}

function createElement(object) {
    var barEl = document.createElement("div");
    document.getElementById('bars').appendChild(barEl);
    
    ReactDOM.render(<Bar config={object} />, barEl);
}


//CREATE SEARCH BOX IN DOM
ReactDOM.render(<SearchBox />, document.getElementById('input'));
