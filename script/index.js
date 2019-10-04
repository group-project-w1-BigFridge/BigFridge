function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId());
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); 

  var id_token = googleUser.getAuthResponse().id_token;
  console.log(id_token)

  $.ajax({
    method:'post',
    url: 'http://localhost:4000/users/googleSignin',
    data : {
      id_token
    }
  })
  .done(function(token){
    console.log(token)
    localStorage.setItem('token', token)
    // document.location.href = '/recipes.html'
  })
  .catch(function(err){
    console.log(err)
  })

}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}
