const cardArray = [
    {
        name: 'fries',
        img: 'static/images/fries.png'
    },
    {
        name: 'burger',
        img: 'static/images/burger.jpg'
    },
    {
        name: 'chocolate',
        img: 'static/images/chocolate.png'
    },
    {
        name: 'drinks',
        img: 'static/images/drinks.png'
    },
    {
        name: 'ice-creme',
        img: 'static/images/ice-creme.png'
    },
    {
        name: 'pizza',
        img: 'static/images/pizza.png'
    },
    {
        name: 'fries',
        img: 'static/images/fries.png'
    },
    {
        name: 'burger',
        img: 'static/images/burger.jpg'
    },
    {
        name: 'chocolate',
        img: 'static/images/chocolate.png'
    },
    {
        name: 'drinks',
        img: 'static/images/drinks.png'
    },
    {
        name: 'ice-creme',
        img: 'static/images/ice-creme.png'
    },
    {
        name: 'pizza',
        img: 'static/images/pizza.png'
    }
]

cardArray.sort(() => 0.5 - Math.random())  // sort the array randomly

const gridDisplay = document.querySelector('#grid')
const resultDisplay = document.querySelector('#result')
let cardChoosen = []
let cardsChoosenIds = []
const cardsWon = []

function createBoard(){
    for(let i=0; i<cardArray.length; i++){
        const card = document.createElement('img')
        card.setAttribute('src', 'static/images/blank.png')
        card.setAttribute('data-id', i)
        card.addEventListener('click', flipCard)
        gridDisplay.appendChild(card)
    }
}

createBoard()

function checkMatch(){
    const cards = document.querySelectorAll('img')
    const optionOneId = cardsChoosenIds[0]
    const optionTwoId = cardsChoosenIds[1]

    // Check if the same card was clicked twice
    if(optionOneId == optionTwoId){
        cards[optionOneId].setAttribute('src', 'static/images/blank.png' )
        alert("You have clicked the same image")
        // Clear the chosen cards and return early
        cardChoosen = []
        cardsChoosenIds = []
        return; // Prevent further execution
    }

    // Check if the two selected cards match
    if (cardChoosen[0] == cardChoosen[1]){
        alert('You Found a match!')
        cards[optionOneId].setAttribute('src', 'static/images/white.png' )
        cards[optionTwoId].setAttribute('src', 'static/images/white.png' )
        cards[optionOneId].removeEventListener('click', flipCard)
        cards[optionTwoId].removeEventListener('click', flipCard)
        cardsWon.push(cardChoosen)
    } 
    else{
        cards[optionOneId].setAttribute('src', 'static/images/blank.png' )
        cards[optionTwoId].setAttribute('src', 'static/images/blank.png' )
        alert('Sorry, try again!')
    }
    resultDisplay.textContent = cardsWon.length 
    cardChoosen = []
    cardsChoosenIds = []

    if(cardsWon.length == cardArray.length / 2){
        resultDisplay.textContent ='Congratulations! You Found them All!' 
    }
}


function flipCard(){
    const cardId = this.getAttribute('data-id')
    cardChoosen.push(cardArray[cardId].name)
    cardsChoosenIds.push(cardId)
    console.log(cardChoosen)
    console.log(cardsChoosenIds)
    console.log("clicked", cardId)
    this.setAttribute('src', cardArray[cardId].img)
    if(cardChoosen.length === 2){
        setTimeout(checkMatch, 500)
    }
}
