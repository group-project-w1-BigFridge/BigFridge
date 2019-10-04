
$(document).ready(()=>{
    console.log('DOM ready');
    
    showAll()

})

console.log('test')
function showAll(){
    $.ajax({
        method:'get',
        url: `http://localhost:3000/recipes/youtube`
    })
        .done(list=>{
            list.items.forEach(video=>{
                $("ul").append(`<li> ${video.id.videoId} </li>`)
            })
        })
}

// function userRepo(user){
//     $.ajax({
//         method: 'get',
//         url: `http://localhost:3000/repos/${user}`
//     })
//         .done(repos=>{

//             $('.list-group-item').hide()
//             repos.forEach(repo=>{
//                 $("ul").append(`<li class="list-group-item"> <a href="${repo.html_url}">${repo.name}</a></li>`)  
//             })
//         })
// }