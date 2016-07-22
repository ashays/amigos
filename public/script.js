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
	    firebase.database().ref(user.uid).set({
	      name: user.displayName
	    });
	  } else {
		console.log("Client unauthenticated.")
		window.location.href = 'login.html';
	  }
	});

});