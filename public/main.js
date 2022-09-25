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
            fetch(`http://localhost:2121/search/${ui.item.id}`)
                .then(result => result.json())
                .then(result => {
                    console.log(result)
            })
        }
    })
})
