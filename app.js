// Variables globales
let isProcessing = false;
let timerId = null;
let gameEnded = false;
// startGame()  descomentar para iniciar el juego al cargar la pagina

function shuffle (array) { // Funcion para barajear usando el algoritmo de fisher-yates
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
}

function addToElement (array) {
    let htmlElement = '';
    for (let i = 0; i < array.length; i++) {
        htmlElement += `<div class='card' onClick='handleClick(this)'>
            <div class='front'><img src='assets/back_card.png' alt='card back' /></div>
            <div class='back'><img src=${array[i].image} alt=${array[i].id} /></div>
        </div>`;
    }
    return htmlElement
}

function updateAttempts () { // Funcion para actualizar el marcador de intentos
    const attempts = document.getElementById('attempts')
    attempts.textContent = parseInt(attempts.textContent) + 1
}

function updateTime () { // Funcion para actualizar el marcador de tiempo
    const timeElement = document.getElementById('time');

    if (timerId) {
        clearTimeout(timerId) // Limpiar el timeout anterior si existe
    }
    timerId = setTimeout(updateTime, 1000) // Llamada recursiva cada segundo
    
    // Incrementar el tiempo en 1 segundo
    timeElement.textContent = parseInt(timeElement.textContent) + 1
}

function createGameBoard () { // Funcion para generar el tablero
    const pair1 = [
        {id: 'coffee', image: 'assets/coffe.png'},
        {id: 'froggy', image: 'assets/froggy.png'},
        {id: 'girl', image: 'assets/girl.png'},
        {id: 'guepard', image: 'assets/guepard.png'},   
        {id: 'hill', image: 'assets/hill.png'},
        {id: 'sea', image: 'assets/sea.png'},
    ]
    const pair2 = pair1.slice()

    cards = pair1.concat(pair2)
    shuffle(cards)

    return cards
}

function handleClick (event) { // Evento click en cartas
    const clickedCard = event;
    const board = document.getElementById('board')
    const allElements = board.querySelectorAll('div.card');

    if (isProcessing || clickedCard.classList.contains('rotate') || clickedCard.classList.contains('found')) {
        return;
    }
    if (pauseButton.disabled === true) {
        alert('El juego está en pausa. Por favor, reanuda el juego para continuar');
        return;
    }
    updateAttempts() // Actualizar marcador
    const currentlyRotated = identifyRotatedElements(allElements)

    if (currentlyRotated.length < 2){
        clickedCard.classList.add('rotate')
        const updatedRotatedElements = identifyRotatedElements(allElements)
        checkPairs(updatedRotatedElements)
        confirmVictory(allElements)
    }
}

function confirmVictory (allElements) {
    const foundElements = Array.from(allElements).filter(element => element.classList.contains('found'));
    if (foundElements.length === allElements.length) {
        setTimeout(() => {
            alert('¡Felicidades! Has encontrado todos los pares.');
            gameEnded = true; // Marcar el juego como finalizado
            pauseGame(); // Pausar el juego al completar
        }, 500);
    }
}

function identifyRotatedElements (allElements) { // identifica cartas volteadas
    let rotatedElements = []

    for (let i = 0; i < allElements.length; i++) {
        if (allElements[i].classList.contains('rotate') && !(allElements[i].classList.contains('found'))) {
            rotatedElements.push(allElements[i])
        }
    }

    return rotatedElements
}

function checkPairs (rotatedElements) { // Verificar pares

    if (rotatedElements.length === 2) {
        const element1 = rotatedElements[0].querySelector('.back').children[0]
        const element2 = rotatedElements[1].querySelector('.back').children[0]

        if (element1 && element2) {
            if (element1.alt === element2.alt) {
                console.log('par encontrado')
                rotatedElements[0].classList.add('found')
                rotatedElements[1].classList.add('found')
            }
            else {
                console.log('sigue buscando')
                isProcessing = true
                setTimeout(() => {
                    rotatedElements[0].classList.remove('rotate')
                    rotatedElements[1].classList.remove('rotate')
                    isProcessing = false
                },1000)
            }
        }
    }
}

function startGame () { // Funcion para iniciar el juego
    if (gameEnded === true) { // Verificar si el juego ya ha terminado
        resetScore(); // Reiniciar el marcador al finalizar el juego
        startButton.disabled = false; // Habilitar el botón de inicio para reiniciar el juego
        resetButton.classList.add('display-none'); // Ocultar el botón de reinicio
        pauseButton.classList.add('display-none'); // Ocultar el botón de pausa
    }
    boardElement = createGameBoard()
    const elements = addToElement(boardElement)
    const board = document.getElementById('board')
    board.innerHTML = elements
    updateTime() // Iniciar el marcador de tiempo
}

function resetScore () { // Funcion para reiniciar el marcador
    const attempts = document.getElementById('attempts')
    attempts.textContent = 0
    if (timerId) {
        clearTimeout(timerId) // Limpiar el timeout del marcador de tiempo
    }
    const timeElement = document.getElementById('time');
    timeElement.textContent = 0 // Reiniciar el marcador de tiempo
}

const resetButton = document.getElementById('reset')
resetButton.addEventListener('click', () => {
    resetScore()
    startGame()
    pauseButton.disabled = false // Habilitar el botón de pausa
})


const pauseButton = document.getElementById('pause')
pauseButton.addEventListener('click', () => {
    pauseGame()
})

const startButton = document.getElementById('start')
startButton.addEventListener('click', () => {   
    if (!isProcessing) {
        startGame()
        startButton.disabled = true // Deshabilitar el botón de inicio para evitar múltiples inicios
        resetButton.classList.remove('display-none') // Mostrar el botón de reinicio
        pauseButton.classList.remove('display-none') // Mostrar el botón de pausa
        pauseButton.disabled = false // Habilitar el botón de pausa
    }
})

function pauseGame () { // Funcion para pausar el juego
    if (timerId) {
        pauseButton.disabled = true // Deshabilitar el botón de pausa para evitar múltiples pausas
        clearTimeout(timerId) // Detener el marcador de tiempo
        timerId = null // Reiniciar el ID del temporizador
        startButton.disabled = false // Habilitar el botón de inicio para reiniciar el juego
    }
}
