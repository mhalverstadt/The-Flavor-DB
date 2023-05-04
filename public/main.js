// Search //
$(document).ready(function () {
    $('#search').autocomplete({
        autoFocus: true,
        source: async function(request,response) {
            let data= await fetch(`https://the-flavor-db.cyclic.app/search?query=${request.term}`)
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
            window.location.assign(`https://the-flavor-db.cyclic.app/search/${ui.item.id}`)
        }
    })
})

//Event listener (event delegation) to handle button clicks on list of pairings in builder//
pairingsList.onclick = function(event){
    let target = event.target;
    if(target.matches('button')){
        selectedPairs.appendChild(event.target.cloneNode(true));
        event.target.remove()
    }
}

// Highlight buttons and compare
selectedPairs.onclick = async function(event){
    let target = event.target;
    if(target.matches('button')){
        target.classList.contains('changeColor') ? target.classList.remove('changeColor') : target.classList.add('changeColor')
    //keyIngredient
    let keyIngredientCompare = document.getElementById('keyIngredient').innerText
    //selected pairings
    let pairingArray = Array.from(document.getElementById('selectedPairs').children)
    console.log(pairingArray)
    //all selected pairings
    let selectedPairings = pairingArray.map(txt => txt.innerHTML.trim())
    let encodeSelectedPairings = encodeURIComponent(JSON.stringify(selectedPairings))
    
    //only pairings with changeColor class
    let comparedPairing = pairingArray.filter(el => el.classList.contains('changeColor')).map(selected => selected.value.trim())
    let encodeComparedPairing = encodeURIComponent(JSON.stringify(comparedPairing))

    //queryString and fetch
    let queryString = `?compareKeyIngredient=${keyIngredientCompare}&compareSelectedPairings=${encodeSelectedPairings}&comparedPairings=${encodeComparedPairing}`
    window.location = `/searchCompare/data${queryString}`;
    }
}

//Event listener to save a pairing
const saveBtn = document.getElementById('saveBtn')
saveBtn.onclick = async function(event){
    let keyIngredient = document.getElementById('keyIngredient').innerText
    let pairings = []
    let pairingArray = document.getElementById('selectedPairs').childNodes
    for(let i = 0; i < pairingArray.length; i++){
        pairings.push(pairingArray[i].innerHTML)
    }
    pairings = pairings.filter(Boolean)
    let data = await fetch(`/createPairing`, {method: 'POST', headers: new Headers({ "Content-Type": "application/json" }), body: JSON.stringify({ keyIngredient, pairings, })})
        window.location.assign(`/profile`)  
}
// Event listener for users to add their own pairing
const userMadePairingBtn = document.getElementById('userMadePairingBtn')
userMadePairingBtn.onclick = function(){
    let txtValue = document.getElementById('userMadePairing').value
    let newBtn = document.createElement('button')
    newBtn.innerText = `${txtValue}`
    newBtn.classList.add('btn', 'btn-light', 'ml-1')
    selectedPairs.appendChild(newBtn);
}