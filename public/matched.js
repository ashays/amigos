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
	      console.log(matched);
	      firebase.database().ref(matched).once('value').then(function(snapshot) {
	        $('#name').text(snapshot.val().name);
	        $('#picture').text(snapshot.val().image);
	      });
	    });
	  } else {
		console.log("Client unauthenticated.")
		window.location.href = 'login.html';
	  }
	});

});