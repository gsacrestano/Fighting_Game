const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0, y: 0
    }, imageSrc: "./image/background.png",
})

const player = new Fighter({
    position: {
        x: 0, y: 0
    }, velocity: {
        x: 0, y: 0
    }, imageSrc: './image/Martial_Hero/Sprites/Idle.png', framesMax: 8, scale: 3.0, offset: {
        x: 215, y: 225.5
    }, sprites: {
        idle: {
            imageSrc: './image/Martial_Hero/Sprites/Idle.png', framesMax: 8
        }, run: {
            imageSrc: './image/Martial_Hero/Sprites/Run.png', framesMax: 8,
        }, jump: {
            imageSrc: './image/Martial_Hero/Sprites/Jump.png', framesMax: 2,
        }, fall: {
            imageSrc: './image/Martial_Hero/Sprites/Fall.png', framesMax: 2,

        }, attack1: {
            imageSrc: './image/Martial_Hero/Sprites/Attack1.png', framesMax: 6,

        },
        takeHit: {
            imageSrc: './image/Martial_Hero/Sprites/Take Hit - white silhouette.png', framesMax: 4,
        },
        death: {
            imageSrc: './image/Martial_Hero/Sprites/Death.png', framesMax: 6,
        }

    }, attackBox: {
        offset: {
            x: 130, y: 20,
        }, width: 180, height: 50
    }
})


const enemy = new Fighter({
    position: {
        x: 500, y: 100
    }, velocity: {
        x: 0, y: 0
    }, imageSrc: './image/Medieval_King/Sprites/Idle.png', framesMax: 8, scale: 3.0, offset: {
        x: 215, y: 169
    }, sprites: {
        idle: {
            imageSrc: './image/Medieval_King/Sprites/Idle.png', framesMax: 8
        }, run: {
            imageSrc: './image/Medieval_King/Sprites/Run.png', framesMax: 8,
        }, jump: {
            imageSrc: './image/Medieval_King/Sprites/Jump.png', framesMax: 2,
        }, fall: {
            imageSrc: './image/Medieval_King/Sprites/Fall.png', framesMax: 2,

        }, attack1: {
            imageSrc: './image/Medieval_King/Sprites/Attack3.png', framesMax: 4,

        },
        takeHit: {
            imageSrc: './image/Medieval_King/Sprites/Take Hit - white silhouette.png', framesMax: 4,

        },
        death: {
            imageSrc: './image/Medieval_King/Sprites/Death.png', framesMax: 6,
        }
    }, attackBox: {
        offset: {
            x: -190, y: 20,
        }, width: 170, height: 50
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
    context.fillStyle = 'rgba(255,255,255,0.15)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0


    //player move
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    }
    if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //enemy move
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }
    if (enemy.velocity.y < 0) {
        player.switchSprite('jump')
    }
    if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //collision
    if (rectangularCollision({
        rectangle1: player, rectangle2: enemy
    }) && player.isAttacking && player.framesCurrent === 4) {
        console.log("Hit Player")
        enemy.takeHit()
        player.isAttacking = false;
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }
    //miss player
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }
    if (rectangularCollision({
        rectangle1: player, rectangle2: enemy
    }) && enemy.isAttacking && enemy.framesCurrent === 2) {
        console.log("Hit Enemy")
        player.takeHit()
        enemy.isAttacking = false;
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    } else if (enemy.isAttacking) {
        console.log(enemy.attackBox.position.x + ' ' + enemy.width + ' ' + player.position.x)

    }
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    //end game
    if (enemy.health <= 0 || player.health <= 0) Winner({player, enemy, timerId})

}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.death)
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
        }
    if (!enemy.death)
        switch (event.key) {
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