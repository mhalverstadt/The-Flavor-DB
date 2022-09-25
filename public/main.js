$(document).ready(function () {
    $('#ingredient').autocomplete({
        source: async function(request,response) {
            let data= await fetch(`http://localhost:2121/search?query=${request.term}`)
                    .then(results => results.json())
                    .then(results => results.map(result => {
                        return {
                            label: result.ingredient,
                            value: result.ingredient,
                            id: result._id
                        }
                    }))
                response(data)
                console.log(response)
        },
        minLength: 1,
        select: function(event, ui) {
            console.log(ui.item.id)
            fetch(`https://national-parks-api-v2.herokuapp.com/get/${ui.item.id}`)
                .then(result => result.json())
                .then(result => {
                    console.log(result)
                    // $('.info').css("display", "block")
                    // $('#description').empty()
                    //     $("#description").append(`<p>${result.description}</p>`)
                    // $('.visitors').empty()
                    //     $('.visitors').append(`<span>${result.visitors}</span>`)
                    // $('.location').empty()
                    //     $('.location').append(`<span>${result.states[0].title}</span>`)
                    // $('body').css("background-image", `url(${result.image.url})`);
            })
        }
    })
})
