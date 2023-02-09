// create

function itemTemplate(item){
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
    <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
    </li>`

}
let ourHTML=itemss.map(function(item){
    return itemTemplate(item)
}).join('')
document.getElementById("item-list").insertAdjacentHTML("beforeend",ourHTML)


let createField = document.getElementById("create-field")
document.getElementById("create-form").addEventListener("submit",function(e){
    e.preventDefault()
    axios.post("/create-item", {text: createField.value}).then(function(response){
        document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
        createField.value=""
        createField.focus()
    }).catch(function(){
        console.log("PLEASE TRY AGAIN LATER.")
    })
})

// click thay to aa function chalavo
document.addEventListener("click", function(e){
    // jena par click kayru ena html code ma eno class="edit-me" hot to j aa chalavo
    if(e.target.classList.contains("edit-me")){
        // user ne lakhva mate navu prompt
        let userInput = prompt("Enter the task:",e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        // userInput ne server ne mokalva axios ni post request karsu
        // post request mokline aa link ma aa input aapo
        if(userInput){
            axios.post("/update-item", {text: userInput, id: e.target.getAttribute("data-id")}).then(function(){
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
            }).catch(function(){
                console.log("try again later.")
            })
        }
    }

    if(e.target.classList.contains("delete-me")){
        if(confirm("Sachukale kadhi j nakhvu chhe?")){
            axios.post("/delete-item", {id:e.target.getAttribute("data-id")}).then(function(){
                e.target.parentElement.parentElement.remove()
            }).catch(function(){
                console.log("PLEASE TRY AGAIN LATER.")
            })
        }
    }
})