firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var user = firebase.auth().currentUser;
      if(user != null){
        var name, email, photoUrl, uid, emailVerified;
        var email_id = user.email;
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;

  
      }
      
    } else {
      // No user is signed in.
  
    }
  });
  var database = firebase.database().ref();
function logout(){
  
    firebase.auth().signOut();
    window.location.replace('index.html');
  }
  