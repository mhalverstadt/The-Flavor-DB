
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

//Event listener (event delegation) to handle button clicks on list of pairings in builder//
const paringsList = document.getElementById('paringsList');
const selectedPairs = document.getElementById('selectedPairs');

pairingsList.onclick = function(event){
    let target = event.target;
    if(target.matches('button')){
        selectedPairs.appendChild(event.target.cloneNode(true));
        // event.target.remove()
    }
}

// selectedPairs.onclick = function(event){
//     let target = event.target;
//     if(target.matches('input.btn.btn-light')){
//         event.target.remove()
//     }
// }

//Event listener to save a pairing
const saveBtn = document.getElementById('saveBtn')
saveBtn.onclick = async function(event){
    let keyIngredient = document.getElementById('keyIngredient').innerText
    let pairings = []
    let pairingArray = document.getElementById('selectedPairs').childNodes
    for(let i = 0; i < pairingArray.length; i++){
        pairings.push(pairingArray[i].value)
    }
    let data = await fetch(`/createPairing`, {method: 'POST', headers: new Headers({ "Content-Type": "application/json" }), body: JSON.stringify({ keyIngredient, pairings })})
        console.log(data)
        window.location.assign('/profile')
}
