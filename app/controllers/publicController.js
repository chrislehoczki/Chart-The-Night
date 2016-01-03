
$("#bars").hide()
$("#title").hide()


var SearchBox = React.createClass({
    
    getInitialState: function() {
        return {
            searchData: localStorage.getItem("userLocation")
        }
    },

    //GETS THE DATA FROM SEARCH FROM 4SQ ON LOAD - CREATES ELEMENTS IN PAGE
    componentDidMount: function() {
    
    },
    
    //GETS DATA FROM 4SQ ON CLICK - CREATES ELEMENTS IN PAGE
    getData: function() {
    //ADD DATA TO LOCAL STORAGE
    localStorage.setItem('userLocation', this.state.searchData);
    
    //SET H1 TO SHOW SEARCH AREA
    $("#title").show()    
    $("#title").text("Showing bars in " + this.state.searchData)
        
    getBarData(this.state.searchData);
 
    },
    
    //SETS STATE ON ENTRY OF INPUT
    setName: function(e) {
    this.setState({searchData: e.target.value}); 
    },
    
    //RENDER SEARCH BOX AND BUTTON
    render: function(){
        return (
            <div>
            <input type="text" value={this.state.searchData} onChange={this.setName}></input>
            <button className="btn btn-primary" onClick={this.getData}> Search </button>
            </div>
            )
    }
    
});


 //SIMPLE BAR COMPONENT
var Bar = React.createClass({

    
     componentDidMount: function() {
        //REST API FOR NO. GOING DATA
        var barUrl = "https://nightlifeapp-christoph-phillips-1.c9users.io/public/api/" + this.state.name;
        ajaxFunctions.ajaxRequest('GET', barUrl, function (data) {

        //CHANGES STATE FOR NO. GOING
        this.setState({going: data}); 
        }.bind(this))     
    
    
    
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

    
    
    },
    
    getInitialState: function() {
        return {
            id: this.props.config.id,
            url: this.props.config.url,
            name: this.props.config.name,
            tips: this.props.config.tips, 
            rating: this.props.config.rating,
            going: 0,
            classref: this.props.config.classref
            
        };
    },
    
    login: function() {
    
    //CREATE LOGIN VIEW
    
    var html = '<div id="overlay"><div id="login-prompt"><h3>Log In To Define Your Night</h3><a href="/auth/github"><div class="btn" id="login-btn"><img src="/public/img/github_32px.png" alt="github logo" />'
    html += '<p>LOGIN WITH GITHUB</p>'
    html += '</div></a></div></div>'
    	
    $(html).hide().prependTo("body").fadeIn("slow")
    
    //HIDE ELEMENTS ON CLICK
    $("#overlay").click(function() {
        $(this).fadeOut("slow")
    })
    
    $("#login-prompt").click(function() {
        $(this).fadeOut("slow")
    })

    },
    
    render: function() {
        //CLASSES TO APPLY
        var imgClass = "barimg";
        var ulClass = "data";
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
            <div className="addBar" onClick={this.login}>
            <img  src="/public/img/add.png"></img>
            <h3> Add Bar</h3>
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
        $("#bars").fadeIn(1000)
        //CLEAR ELEMNT
        document.getElementById("bars").innerHTML = "";
        
        //CREATE INDIVIDUAL ELEMENT FOR EACH BAR
        bars.map(function(bar) {

            //create URL to get photos
            var apiUrl = "https://api.foursquare.com/v2/venues/" + bar.venue.id + "/photos?" + id + secret + "v=20140130";
            
            //GET request to 4SQ
            $.getJSON(apiUrl, function(data) {
            
            //GET PHOTO DATA (only if venue has photo)
            var barPhoto;
            if (data.response.photos.items[0]) {
            barPhoto = data.response.photos.items[0].prefix + "150x150" + data.response.photos.items[0].suffix;
            }
            
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
            
            //SCROLL DOWN
            setTimeout(function() {
                
                $('html, body').animate({
            scrollTop: $(window).height(),

            }, 20);
            }, 600)
            
           
        
        });//END OF FIRST API CALL
        
        
        
        
}


//FUNCTION TO CREATE AN ELEMENT WITH A BAR OBJECT AS CONFIG
function createElement(object) {
    
    //CLEAR HTML IN BARS
    
    var barEl = document.createElement("div");
    document.getElementById('bars').appendChild(barEl);
    
    ReactDOM.render(<Bar config={object} />, barEl);
}




/* OLD FUNCTION
//FUNCTION TO CREATE REACT BAR ELEMENTS
function createBars() { 
    
    //CLEAR HTML IN BARS
    document.getElementById("bars").innerHTML = "";
    
    //create bars components and return div with them all
    var BarsList = React.createClass({
    render: function() {
        var bars = this.props.bars.map(function(barsObject, index){
                        return <Bar config={ barsObject } key={ index } />;
                      })
                     
        return (
            <div>
                { bars }
            </div>
        );

    }
});

    //RENDER BARS UL INTO DOM
    ReactDOM.render(<BarsList bars={ barArray } />, document.getElementById("bars"));

}
*/

//LOGIN BOX ON TRYING TO ADD BAR



//CREATE SEARCH BOX IN DOM
ReactDOM.render(<SearchBox />, document.getElementById('input'));
