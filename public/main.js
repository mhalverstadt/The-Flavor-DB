
$(document).ready(function () {
    $('#search').autocomplete({
        autoFocus: true,
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
                .then(result => {
                    window.location.assign(result.url)
            })
        }
    })
})

//Trying to fix the 'enter' search problem

// document.getElementById("search").addEventListener("keypress", async function (event) {
//     if (event.key === "Enter") {
//        const value = event.target.value
//        console.log(value)
//        let data= await fetch(`http://localhost:2121/search?query=${value}`)
//         .then(results => results.json())
//         console.log(results)
//     }
// })