function rectangularCollision({rectangle1, rectangle2}) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x) &&
        (rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width) &&
        (rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
            (rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height) &&
            rectangle1.isAttacking)
}

function Winner({player, enemy, timerId}) {

    document.getElementById('result').style.display = 'flex'
    clearTimeout(timerId)
    if (player.health > enemy.health)
        document.getElementById('result').innerHTML = 'Player Wins'
    else if (player.health < enemy.health)
        document.getElementById('result').innerHTML = 'Enemy Wins'
    else
        document.getElementById('result').innerHTML = 'Tie'


}

let timer = 60;
let timerId

function decreaseTimer() {

    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.getElementById('timer').innerHTML = timer + ''
    } else if (timer === 0)
        Winner({player, enemy, timerId})
}