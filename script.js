let player = document.querySelector('#player')
let playerCd = false
let playerXCoords,
playerScores = 0,
playerLives = 3,
playerRecord = 0
const enemiesAmount = document.querySelectorAll('.enemy').length





function movePlayer(e){
    playerXCoords = e.clientX
    if (playerXCoords > 64 && (playerXCoords + 64) < window.innerWidth)
    player.style.left =  playerXCoords - 32 + 'px'
}

let pBullet
function playerShoot(){
    if (!document.querySelector('.bullet.player-bullet')) {
         pBullet = document.createElement('div')
        pBullet.className = 'bullet player-bullet'
        document.querySelector("#game-screen").append(pBullet)
        pBullet.style.bottom = "calc(5% + 64px)";
        pBullet.style.left = player.getBoundingClientRect().left + 30 +'px';

        bulletFly(pBullet)
    }
}

let intervalId
function selectEnemy() {
    clearInterval(intervalId)
    let enemyLiveAmount = document.querySelectorAll('.enemy').length
    
    if(enemyLiveAmount == 0) {
        gameOver('vic')
        return
    }

    let shootPerc = (enemiesAmount - enemyLiveAmount + 0.5)/ 100
    intervalId = setInterval(()=>{
        document.querySelectorAll('.enemy').forEach((enemy)=>{
            if (Math.random() <= shootPerc) {
                enemyShoot(enemy)
            }
        })
    },1000)
}

let enemyBullet
function enemyShoot(enemy) {
    enemyBullet = document.createElement('div')
    enemyBullet.className = 'bullet enemy-bullet'
    document.querySelector('#game-screen').append(enemyBullet)
    enemyBullet.style.top = enemy.getBoundingClientRect().top + 32 + 'px'
    enemyBullet.style.left = enemy.getBoundingClientRect().left + 14 + 'px'
    
    enemyBulletFly(enemyBullet)
}

function enemyBulletFly(elem) {

    let enemyBulletCoords = window.getComputedStyle(elem).top
    elem.style.top = `calc(${enemyBulletCoords} + 15px)`;
    let timerId

    let bulletYbottom = elem.getBoundingClientRect().bottom,
        bulletXleft = elem.getBoundingClientRect().left

    let check = document.elementsFromPoint(bulletXleft, bulletYbottom).filter((elem)=>{return elem.classList.contains('player')})
    if (check.length) {
        playerDamage()
        elem.remove()
    } else {
        timerId = setTimeout(()=>{
            enemyBulletFly(elem)
        }, 30)
    }


    if(elem.getBoundingClientRect().top > window.innerHeight - 25) {
        clearTimeout(timerId)
        elem.remove()
    }
}

function playerDamage() {
    playerLives--
    document.querySelector('#lives').firstElementChild.firstElementChild.innerHTML = playerLives;
    if(playerLives == 0) {
        gameOver('def')
    }
}

function bulletFly(elem) {
    let playerBulletCoords = window.getComputedStyle(elem).bottom
    elem.style.bottom = `calc(${playerBulletCoords} + 25px)`;
    let timerId
    let bulletYtop = elem.getBoundingClientRect().top,
        bulletXleft = elem.getBoundingClientRect().left

    let check = document.elementsFromPoint(bulletXleft, bulletYtop).filter((elem)=>{return elem.classList.contains('enemy')})
    if (check.length && check[0].classList.contains('enemy')) {
        let index = Array.from(check[0].classList).findIndex(el => el.includes('enemy-'))
        killEnemy(check[0].classList[index])
        check[0].className = 'killed'
        elem.remove()
        selectEnemy()
    } else {
        timerId = setTimeout(()=>{
        bulletFly(elem)
    }, 30)
    }

    
    if(bulletYtop < 25) {
        clearTimeout(timerId)
        elem.remove()
    }


}



function killEnemy(enemyType){

    switch (enemyType) {
        case 'enemy-1':
            playerScores += 10
            break;
        case 'enemy-2':
            playerScores += 20
            break;
        case 'enemy-3':
            playerScores += 30
            break;
        case 'enemy-4':
            playerScores += 100
            break;
    }

    document.querySelector('#score').firstElementChild.firstElementChild.innerHTML = playerScores;
}


function gameOver(type) {
    record(playerScores)

    clearInterval(intervalId)
    document.removeEventListener('click', playerShoot)
    document.removeEventListener('mousemove', movePlayer)
    document.removeEventListener('keydown', keyEvents)

    document.querySelector('#game-screen').style.display = 'none'
    document.querySelector('#end-screen').style.display = 'flex'

    switch(type) {
        case 'vic':
            document.querySelector('.end-title').innerHTML = 'VICTORY'
            break;
        case 'def':
            document.querySelector('.end-title').innerHTML = 'GAME OVER'
            break;
    }

    document.querySelector('#endgame-score').firstElementChild.firstElementChild.innerHTML = playerScores;
    document.querySelector('#endgame-record').firstElementChild.firstElementChild.innerHTML = playerRecord;
}

function record() {
    playerRecord = playerScores > playerRecord ? playerScores:playerRecord

}

function keyEvents(e) {
    if (e.code == 'Space') {
        playerShoot()
    }
}



document.querySelector('#start').addEventListener('click', ()=>{
    selectEnemy()
    document.querySelector('#start-screen').style.display = 'none'
    document.querySelector('#game-screen').style.display = 'block'
    document.addEventListener('click', playerShoot)
    document.addEventListener('keydown', keyEvents)

    document.addEventListener('mousemove', movePlayer)
})

document.querySelector('#tryagain').addEventListener('click', ()=>{
    playerLives = 3
    document.querySelector('#lives').firstElementChild.firstElementChild.innerHTML = playerLives;
    playerScores = 0
    document.querySelector('#record').firstElementChild.firstElementChild.innerHTML = playerRecord;
    document.querySelectorAll('.killed').forEach((enemy)=>{
        enemy.className = `enemy enemy-${enemy.dataset.type}`
    })
    selectEnemy()
    document.querySelector('#start-screen').style.display = 'none'
    document.querySelector('#end-screen').style.display = 'none'
    document.querySelector('#game-screen').style.display = 'block'
    document.addEventListener('click', playerShoot)
    document.addEventListener('mousemove', movePlayer)
    document.addEventListener('keydown', keyEvents)
})