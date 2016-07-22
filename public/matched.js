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
	    firebase.database().ref(user.uid).once('value').then(function(snapshot) {
	      var matched = snapshot.val().matched;
	      var long = snapshot.val().longitude;
	      var lat = snapshot.val().latitude;
	      console.log(matched);
	      firebase.database().ref(matched).once('value').then(function(snapshot) {
	        $('#matchName').text(snapshot.val().name);
	        $('#picture').html("<img class='matchImg' src='" + snapshot.val().image + "'>'");
		    $('#distance').text(Math.round(getDistance(lat, long, snapshot.val().latitude, snapshot.val().longitude) * 1000));
	      });
	    });
	  } else {
		console.log("Client unauthenticated.")
		window.location.href = 'login.html';
	  }
	});

});

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
