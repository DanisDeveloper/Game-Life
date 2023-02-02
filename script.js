/**************************** 

space - stop/start
c - clear
r - random
a - state drawing
s - state clearing
left mouse click - drawing/clearing depending on state

*****************************/

'use strict'

let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight



let arr1 = []
let arr2 = []
let countCycles = 0
let isDrawing = true
let isMouseDown = false
let state = 1 // состояние клетки
let CELL_SIZE = 6
let figure = 'square' // square or circle

function clearArr(){
    for (let i = 0; i < canvas.height / CELL_SIZE; i++) {
        for (let j = 0; j < canvas.width / CELL_SIZE; j++) {
            arr1[i][j] = 0
            arr2[i][j] = 0
        }
    }
}

function randomField(){
    for (let i = 0; i < canvas.height / CELL_SIZE; i++) {
        for (let j = 0; j < canvas.width / CELL_SIZE; j++) {
            let value = Math.round(Math.random())
            arr1[i][j] = value
            arr2[i][j] = value
        }
    }
}

function calculate(beginArr,endArr){
    for (let i = 0; i < canvas.height / CELL_SIZE; i++) {
        for (let j = 0; j < canvas.width / CELL_SIZE; j++) {
            let counter = 0;
            for (let k = -1; k < 2; k++) {
                for (let w = -1; w < 2; w++) {
                    let y = i+k
                    let x = j+w
                    if(y === -1) y = beginArr.length-1
                    if(y === beginArr.length) y = 0
                    if(x === -1) x = beginArr[0].length-1
                    if(x === beginArr[0].length) x = 0
                    if(beginArr[y][x]) ++counter
                }
            }
            
            if(beginArr[i][j]){
                counter-- // вычитаем центральный элемент
                if(counter === 3 || counter === 2){
                    endArr[i][j] = 1
                }else{
                    endArr[i][j] = 0
                }
            }else{
                if(counter === 3){
                    endArr[i][j] = 1
                }else{
                    endArr[i][j] = 0
                }
            }   
        }
    }
}

function clearBackground() {
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'white'
}

function drawOne(arr, x, y,fig='square'){
    if (arr[y][x]) context.fillStyle = 'white'
    else context.fillStyle = 'black'
    switch(fig){
        case 'square':{
            context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
            break;
        }
        case 'circle':{
            context.beginPath()
            context.arc(x * CELL_SIZE,y * CELL_SIZE,CELL_SIZE/2,0,Math.PI*2)
            context.fill();
            context.closePath()
            break;
        }
    }
}

function draw(arr,fig='square'){
    clearBackground()
    for (let i = 0; i < canvas.height / CELL_SIZE; i++) {
        for (let j = 0; j < canvas.width / CELL_SIZE; j++) {
            drawOne(arr,j,i,fig)
        }
    }
}

//слушатели нажатий
addEventListener('keydown',function(event){
    console.log(event.keyCode)
    switch(event.keyCode){
        case 32:{ // space
            if(isDrawing) isDrawing = false
            else isDrawing = true
            break;
        }
        case 67:{ // c
            clearArr()
            draw(arr1,figure)
            break;
        }
        case 82:{ // r
            randomField()
            draw(arr1,figure)
            break;
        }
        case 65:{ // a  левая кнопка мыши - белый
            state = 1
            break;
        }
        case 83:{ // s правая кнопка мыши - черный
            state = 0
            break;
        }
    }
})

addEventListener('mousedown',function(event){
    isMouseDown = true
    let x = Math.round(event.clientX/CELL_SIZE)
    let y = Math.round(event.clientY/CELL_SIZE)
    console.log(`(${x},${y})`)

    if(countCycles%2===1){
        arr2[y][x] = state
        drawOne(arr2,x,y,figure)
    }else{
        arr1[y][x] = state
        drawOne(arr1,x,y,figure)
    }
})

addEventListener('mouseup',function(event){
    isMouseDown = false
})
addEventListener('mousemove',function(event){
    let x = Math.round(event.clientX/CELL_SIZE)
    let y = Math.round(event.clientY/CELL_SIZE)
    console.log(`(${x},${y})`)
    if(isMouseDown){
        if(countCycles%2===1){
            arr2[y][x] = state
            drawOne(arr2,x,y,figure)
        }else{
            arr1[y][x] = state
            drawOne(arr1,x,y,figure)
        }
    }
})

//инициализация массива
for (let i = 0; i < canvas.height / CELL_SIZE; i++) {
    arr1.push([])
    arr2.push([])
    for (let j = 0; j < canvas.width / CELL_SIZE; j++) {
        arr1[i][j] = Math.round(Math.random())
    }
}

//жизненный цикл

draw(arr1,figure)
setInterval(function(){
    if(isDrawing){
        if(countCycles++%2===0){
            calculate(arr1,arr2)
            draw(arr2,figure)
        }else{
            calculate(arr2,arr1)
            draw(arr1,figure)
        } 
    }
})
