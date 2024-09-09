const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position:{
        x:0,
        y:0
    }, imageSrc: "./image/background.png",
})

const player = new Fighter({
    position: {
        x: 0, y: 0
    }, velocity: {
        x: 0, y: 0
    },
    color: 'red',
    offset: {
        x: 0,
        y: 0
    }
})


const enemy = new Fighter({
    position: {
        x: 400, y: 100
    }, velocity: {
        x: 0, y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})

const keys = {
    a: {
        pressed: false
    }, d: {
        pressed: false
    }, w: {
        pressed: false
    }, ArrowRight: {
        pressed: false
    }, ArrowLeft: {
        pressed: false
    }

}



decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player move
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }

    //enemy move
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    //collision
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking) {
        console.log("Hit Player")
        player.isAttacking = false;
        enemy.health -= 20
        document.getElementById('enemyHealth').style.width = enemy.health + '%'
    }
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking) {
        console.log("Hit Enemy")
        enemy.isAttacking = false;
        player.health -= 20
        document.getElementById('playerHealth').style.width = player.health + '%'
    }

    //end game
    if (enemy.health <= 0 || player.health <= 0)
        Winner({player, enemy, timerId})

}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd' :
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a' :
            player.lastKey = 'a'
            keys.a.pressed = true
            break
        case 'w' :
            player.velocity.y = -18;
            break
        case ' ':
            player.attack()
            break;
        case 'ArrowRight' :
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp' :
            enemy.velocity.y = -18;
            break
        case 'ArrowDown':
            enemy.attack()
            break;

    }
})
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd' :
            keys.d.pressed = false;
            break
        case 'a' :
            keys.a.pressed = false;
            break
    }
    switch (event.key) {
        case 'ArrowRight' :
            keys.ArrowRight.pressed = false;
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false;
            break
    }
})