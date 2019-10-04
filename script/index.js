$(document).ready(function() {
  $("#recipes-page").hide()
  getRecipes()
});

function getRecipes(){
  $('#ingredients-form').submit((e) => {
      e.preventDefault()
      $.ajax({
          url: 'http://localhost:4000/recipes',
          method: 'post',
          data: {
              ingredients: $('#ingredients').val()
          }
      })
      .done(recipes => {
          if(recipes.length === 0) {
              swal('No recipe found', 'try another keywords', "info");
          } else {
              $('#recipes-container').empty()
              recipes.forEach(recipe => {
                  let usedIngredients = '<ul>'
                  recipe.usedIngredients.forEach(usedIngredient => {
                      console.log(usedIngredient)
                      usedIngredients += `<li style="color: #6ec96d; list-style-type: none;"><i class='fas fa-circle' style='font-size:10px'></i> ${usedIngredient.name}</li>`
                  })
                  usedIngredients += '</ul>'
                  let missedIngredients = '<ul>'
                  recipe.missedIngredients.forEach(missedIngredient => {
                      console.log(missedIngredient)
                      missedIngredients += `<li style="color: #c95555; list-style-type: none;"><i class='fas fa-circle' style='font-size:10px'></i> ${missedIngredient.name}</li>`
                  })
                  missedIngredients += '</ul>'
                  $('#recipes-container').append(`
                  <div class="media">
                  <img src="${recipe.image}" class="rounded-circle" style="width: 100px; height: 100px; padding-top: 5px;" alt="${recipe.title}">
                  <div class="media-body" style="margin-left: 20px;">
                      <h5 class="mt-0">${recipe.title}</h5>
                      <div class="row">
                      <div class="column" style="width: 200px;">${usedIngredients}</div>
                      <div class="column" style="width: 250px;">${missedIngredients}</div>
                      </div>
                  </div>
                  </div>
                  <hr>
                  `)
              });
          }
      })
      .fail(err => {
          if(!err.responseJSON) {
              swal('Connection lost', 'Something wrong with the server', "error"); 
          } else {
              swal(err.responseJSON.message, '', "error");
          }
      })
  })
}

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
    
    $("#main-page").hide()
    $("#recipes-page").show()
    $(".modal-backdrop").hide()

  })
  .catch(function(err){
    console.log(err)
  })

}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('token')

    $("#main-page").show()
    $(".modal-backdrop").show()
    $("#recipes-page").hide()
    console.log('User signed out.');
  });
}
