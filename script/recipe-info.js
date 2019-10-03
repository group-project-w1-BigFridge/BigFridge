$(document).ready(function() {
    $.ajax({
        url: 'http://localhost:3000/recipes/images',
        method: 'post',
        data: {
            recipe: 'caramel machiatto'
        }
    })
    .done(({images_src}) => {
        console.log(images_src)
        $('#recipes-images').empty()
        images_src.forEach(image_src => {
            $('#recipe-images').append(`
            <img src="${image_src}" style="width: 100px; height: 100px;">
            `)
        });
    })
    .fail(err => {
        console.log(err)
    })
});