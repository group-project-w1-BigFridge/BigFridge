

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