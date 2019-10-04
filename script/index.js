$(document).ready(function() {
  $("#recipes-page").hide()
  $("#recipes-info").hide()
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
                      <div><button class="btn btn-primary btn-sm ml-4" onclick="seeDetail('${recipe.id}','${recipe.title}');" type="submit">Detail</button></div>
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

function seeDetail(idRecipes,title){
  $("#main-page").hide()
  $("#recipes-page").hide()
  spoonify(idRecipes)
  $("#recipes-info").show()
  googleImage(title)
  youtube(title)
}

function spoonify(idRecipes){
  $.ajax({
  method:'get',
  url: `http://localhost:4000/recipes/${idRecipes}`
  })
      .done(recipe=>{
          $("#title").append(`
              <div>
                  <h1>${recipe.title} </h1>
              </div>
          `)
          recipe.extendedIngredients.forEach(ingredients=>{
              $(".ingredients").append(`
                  <li>
                      ${ingredients.originalString}
                  </li>
              `)
          })
          recipe.diets.forEach(diet=>{
              $(".categories").append(`
                  <span class="badge badge-pill badge-primary">${diet}</span>
                  `)
          })
          recipe.dishTypes.forEach(dish=>{
              $(".dishTypes").append(`
                  <span class="badge badge-pill badge-light">${dish}</span>
                  `)
          })
          
      })
      .fail(err=>{
          console.log(err)
      })
}

function youtube(title){
  $.ajax({
  method:'get',
  url: `http://localhost:4000/recipes/youtube/${title}`
  })
      .done(list=>{
          $(".youtube").append(`
              <iframe width="600" height="315" style="margin:auto" 
              src="https://www.youtube.com/embed/${list.items[0].id.videoId}">
              </iframe>
              `)
          $(".youtube").append(`
              <iframe width="600" height="315" style="margin:auto" 
              src="https://www.youtube.com/embed/${list.items[1].id.videoId}">
              </iframe>
              `)
          $(".youtube").append(`
              <iframe width="600" height="315" style="margin:auto" 
              src="https://www.youtube.com/embed/${list.items[2].id.videoId}">
              </iframe>
              `)
      })
      .fail(console.log)
}

function googleImage(title){
  console.log(title)
  $.ajax({
    url: 'http://localhost:4000/recipes/images',
    method: 'post',
    data: {
        recipe: title
    }
})
.done(({images_src}) => {
    console.log(images_src)
    $('#recipes-images').empty()
    images_src.forEach(image_src => {
        $('#googleImages').append(`
        <img src="${image_src}" style="width: 100px; height: 100px;">
        `)
    });
})
.fail(err => {
    console.log(err)
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

function toHome(){
  $("#recipes-page").show()
  $("#main-page").hide()
  $("#recipes-info").hide()
  $("#title").empty()
  $(".ingredients").empty()
  $(".categories").empty()
  $(".dishTypes").empty()
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('token')
    $("#main-page").show()
    $(".modal-backdrop").show()
    $("#recipes-page").hide()
    $("#recipes-info").hide()
    console.log('User signed out.');
  });
}