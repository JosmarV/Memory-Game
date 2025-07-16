/**
 * Este es un juego de memoria donde debes encontrar pares de cartas.
 * El juego se inicia al hacer clic en el botón "Iniciar".
 * Cada carta tiene una imagen en su parte trasera y al hacer clic se voltea para mostrar la imagen.
 * Si dos cartas volteadas coinciden, permanecen visibles; de lo contrario, se vueltean de nuevo.
 * El juego registra el número de intentos y el tiempo transcurrido.
 * Puedes pausar y reanudar el juego, así como reiniciarlo.
 */

// Variables globales
const INITIAL_GAME_STATE = {
    isProcessing: false,
    isPaused: false,
    timerId: null,
    gameEnded: false,
    attempts: 0,
}
let gameState = {...INITIAL_GAME_STATE}; // Estado del juego
// startGame()  descomentar para iniciar el juego al cargar la pagina

// Elementos del DOM
const board = document.getElementById('board')
const boardAttempts = document.getElementById('attempts')
const timeElement = document.getElementById('time')
// Botones de control
const startButton = document.getElementById('start')
const resetButton = document.getElementById('reset')
const pauseButton = document.getElementById('pause')
const playAgainButton = document.getElementById('play-again')
const statsElement = document.getElementById('stats')
const winningScreen = document.getElementsByClassName('winning-screen')[0];
const pausedScreen = document.querySelector('.paused-screen');
const resetGameButton = document.getElementById('reset-game');
const resumeGameButton = document.getElementById('resume-game');

// -- Funciones de utilidad --

function shuffle (array) { // Funcion para barajear usando el algoritmo de fisher-yates
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
}

// -- Funciones de Inicialización y Renderizado del tablero --

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

// -- Funciones del Temporizador --

function updateTime () { // Funcion para actualizar el marcador de tiempo
    // Incrementar el tiempo en 1 segundo
    timeElement.textContent = parseInt(timeElement.textContent) + 1
}

function startTimer () { // Funcion para iniciar el temporizador
    if (gameState.timerId) {
        clearInterval(gameState.timerId); // Limpiar el intervalo si ya existe
    }
    gameState.timerId = setInterval(updateTime, 1000); // Iniciar el temporizador
}

// -- Lógica Principal del Juego --

function handleClick (event) { // Evento click en cartas
    const clickedCard = event;
    const allElements = board.querySelectorAll('div.card');

    if (gameState.isProcessing || clickedCard.classList.contains('rotate') || clickedCard.classList.contains('found')) {
        return;
    }
    if (gameState.isPaused) { // Verificar si el juego está pausado
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
                gameState.isProcessing = true
                setTimeout(() => {
                    rotatedElements[0].classList.remove('rotate')
                    rotatedElements[1].classList.remove('rotate')
                    gameState.isProcessing = false
                },1000)
            }
        }
    }
}

function updateAttempts () { // Funcion para actualizar el marcador de intentos
    boardAttempts.textContent = gameState.attempts + 1
    gameState.attempts += 1 // Incrementar el contador de intentos
}


function confirmVictory (allElements) {
    const foundElements = Array.from(allElements).filter(element => element.classList.contains('found'));
    if (foundElements.length === allElements.length) {
        setTimeout(() => {
            // alert('¡Felicidades! Has encontrado todos los pares.');
            const finalAttempts = document.getElementById('attempts').textContent;
            const finalTime = document.getElementById('time').textContent;
            gameState.gameEnded = true; // Marcar el juego como finalizado
            pauseGame(); // Pausar el juego al completar
            winningScreen.querySelector('#final-attempts').textContent = finalAttempts;
            winningScreen.querySelector('#final-time').textContent = finalTime;
            winningScreen.classList.add('visible');
        }, 500);
    }
}

function startGame () { // Funcion para iniciar el juego
    if (gameState.gameEnded === true) { // Verificar si el juego ya ha terminado
        resetGame(); // Reiniciar el marcador al finalizar el juego
        pauseButton.disabled = false 
        gameState.gameEnded = false; // Reiniciar el estado del juego
    }
    boardElement = createGameBoard()
    const elements = addToElement(boardElement)
    board.innerHTML = elements
    gameState.isProcessing = false // Reiniciar el estado de procesamiento
    startButton.disabled = true // Deshabilitar el botón de inicio para evitar múltiples inicios
    startButton.classList.add('display-none') // Ocultar el botón de inicio
    startTimer() // Iniciar el marcador de tiempo

    pauseButton.disabled = false // Habilitar el botón de pausa
    statsElement.classList.add('stats') // Añadir clase de estadísticas
    resetButton.classList.remove('display-none') // Mostrar el botón de reinicio
    pauseButton.classList.remove('display-none') // Mostrar el botón de pausa
}

function resetGame () { // Funcion para reiniciar el marcador
    if (gameState.timerId) {
        clearInterval(gameState.timerId) // Limpiar el intervalo del marcador de tiempo
        gameState.timerId = null // Reiniciar el ID del temporizador
    }
    if (gameState.gameEnded) {
        winningScreen.classList.remove('visible'); // Ocultar la pantalla de victoria
    }

    gameState = {...INITIAL_GAME_STATE} // Reiniciar el estado del juego

    board.innerHTML = '' // Limpiar el tablero
    startButton.disabled = false // Habilitar el botón de inicio
    startButton.classList.remove('display-none') // Mostrar el botón de inicio

    pauseButton.disabled = true // Deshabilitar el botón de pausa
    pauseButton.classList.add('display-none') // Ocultar el botón de pausa
    

    boardAttempts.textContent = 0 // Reiniciar el marcador de intentos
    timeElement.textContent = 0 // Reiniciar el marcador de tiempo
    resetButton.classList.add('display-none') // Ocultar el botón de reinicio
    statsElement.classList.remove('stats') // Eliminar clase de estadísticas
    
    gameState.isPaused = false // Marcar el juego como no pausado
}

function pauseGame () { // Funcion para pausar el juego
    if (gameState.timerId) {
        clearInterval(gameState.timerId) // Detener el marcador de tiempo
        gameState.isPaused = true // Marcar el juego como pausado
        gameState.timerId = null // Reiniciar el ID del temporizador
        pauseButton.disabled = true // Deshabilitar el botón de pausa para evitar múltiples pausas
        resetButton.disabled = false // Habilitar el botón de inicio para reiniciar el juego
        console.log('Juego pausado')
        // Mostrar la pantalla de pausa
        pausedScreen.classList.add('visible');
    }
}

function resumeGame () { // Funcion para reanudar el juego
    if (gameState.gameEnded === false && gameState.isPaused === true) { // Verificar si el juego no ha terminado y está pausado
        startTimer()
        gameState.isPaused = false // Marcar el juego como no pausado
        pauseButton.disabled = false // Habilitar el botón de pausa
        pausedScreen.classList.remove('visible') // Ocultar la pantalla de pausa
    }
}

// -- Eventos de los botones --

resetButton.addEventListener('click', () => {
    resetGame()
    startGame() // Reiniciar el juego al hacer clic en el botón de reinicio
})

pauseButton.addEventListener('click', () => {
    pauseGame()
})

startButton.addEventListener('click', () => {
    if (!gameState.isProcessing) {
        startGame()
    }
})

playAgainButton.addEventListener('click', () => {
    const winningScreen = document.getElementsByClassName('winning-screen')[0];
    winningScreen.classList.remove('visible');
    startGame();
});

resetGameButton.addEventListener('click', () => {
    resetGame();    // Reiniciar el juego al hacer clic en el botón de reinicio 
    startGame(); // Iniciar un nuevo juego
    pausedScreen.classList.remove('visible'); // Ocultar la pantalla de pausa
})

resumeGameButton.addEventListener('click', () => {
    resumeGame(); // Reanudar el juego al hacer clic en el botón de reanudar
})

// Actualmente tengo 241 lineas de código, puede reducir el código eliminando comentarios innecesarios 
// o simplificando funciones, pero es importante mantener la claridad y legibilidad del código.