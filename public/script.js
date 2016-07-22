$(document).ready(function (){

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    // User is signed in.
	    var user = firebase.auth().currentUser;
	    var name, email, photoUrl, uid;
	    if (user != null) {
	      name = user.displayName;
	      email = user.email;
	      photoUrl = user.photoURL;
	      uid = user.uid;
	    }
	    console.log(user);
	    $('#name').text(name);
	    firebase.database().ref(user.uid).update({
	      name: user.displayName
	    });
	  } else {
		console.log("Client unauthenticated.")
		window.location.href = 'login.html';
	  }
	});

});

function getMahLocation() {
	var locs = [];
	var startPos;
  	var geoSuccess = function(position) {
	    startPos = position;
	    var user = firebase.auth().currentUser;
	    locs[0] = startPos.coords.latitude;
	    locs[1] = startPos.coords.longitude;
	    console.log(startPos.coords.latitude);
  		console.log(startPos.coords.longitude);
  		firebase.database().ref(user.uid).update({
		    status: "active",
		    latitude: locs[0],
		  	longitude: locs[1],
		  	matched: null
		});

  		var matches = [];

		firebase.database().ref().once('value').then(function(snapshot) {
	    	snapshot.forEach(function(childSnapshot) {
		    	// key will be "ada" the first time and "alan" the second time
		      	// var matchLat = childSnapshot.child("latitude");
		      	var matchLat = childSnapshot.val().latitude;
		      	var matchLong = childSnapshot.val().longitude;
		      	console.log(matchLat + ", " + matchLong);
		      	if (matchLat && matchLong && getDistance(matchLat, matchLong, locs[0], locs[1]) < 10 
		      		&& user.uid != childSnapshot.key
		      	 	&& childSnapshot.val().status == "active") {
		      			//COMPARE FOR SIMALARITY KEEP TRACK OF MOST SIMILAR
		      			console.log("hello");
		      			console.log(childSnapshot.key);
		      			matches.push(childSnapshot.key);
		    	}
				// childData will be the actual contents of the child
				//UPDATE USERID AND MATCH ID WITH EACH OTHERS ID
		 	});

		 	if (matches.length != 0) {
				var matchID = matches[Math.floor(Math.random()*matches.length)];
				console.log(matchID);
				firebase.database().ref(user.uid).update({
				  	matched: matchID,
				  	status: "passive"
				});

				firebase.database().ref(matchID).update({
				  	matched: user.uid,
				  	status: "passive"
				});
			} else {
				var myMatchRef = firebase.database().ref(user.uid);
				myMatchRef.on('child_changed', function(data) {
					console.log(data.key);
					console.log(data.val());
			  		// setCommentValues(postElement, data.key, data.val().text, data.val().author);
				});
			}
		});

	  	/*if (topMatch != null) {
	  		ref.child(userID).set({
	  			Matched: topMatch,
	  			status: "passive"
	  		})
	  		ref.child(topMatch).set({
	  			Matched: userID,
	  			status: "passive"
	  		});

	  	}*/
  	};
  	navigator.geolocation.getCurrentPosition(geoSuccess);
  	return locs;
}

function getDistance(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1); 
	var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function meet() {
	var user = firebase.auth().currentUser;
	var locs = getMahLocation();
	var topMatch = null;
	//console.log(locs[1],locs[0]);

}