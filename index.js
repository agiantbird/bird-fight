const canvas = document.querySelector('canvas');
// 'c' represents 'context'
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/new_background.png'
})

const volcano = new Sprite({
    position: {
        x: 600,
        y: 128,
    },
    imageSrc: './img/volcano.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/ostrich/ostrich_idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/ostrich/ostrich_idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/ostrich/ostrich_run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/ostrich/ostrich_jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/ostrich/ostrich_falling.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/ostrich/ostrich_attack.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/ostrich/ostrich_take_hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/ostrich/ostrich_death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50,
        },
        width: 160,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/secretary_bird/bird_idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/secretary_bird/bird_idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/secretary_bird/bird_run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/secretary_bird/bird_jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/secretary_bird/bird_fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/secretary_bird/bird_attack.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/secretary_bird/bird_take_hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/secretary_bird/bird_death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50,
        }, 
        width: 170,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    volcano.update()
    c.fillStyle = 'rgba(255,255,255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    // Player movement
    //// Set default (idle) animation
    player.velocity.x = 0
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // Jumping/Falling
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // Enemy movement
    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // Jumping/Falling
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // detect collision when enemy is hit
    if (
        rectangularCollision( { 
            rectangle1: player,
            rectangle2: enemy
        }) && 
        player.isAttacking && player.framesCurrent === 2
    ) {
        enemy.takeHit()
        player.isAttacking = false
        // document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
        console.log('player lands hit!')
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 2) {
        player.isAttacking = false
    }

    // detect collision when player is hit
    if (
        rectangularCollision( { 
            rectangle1: enemy,
            rectangle2: player
        }) && 
        enemy.isAttacking && enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false
        // document.querySelector('#playerHealth').style.width = player.health + '%'
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
        console.log('enemy lands hit!')
    }

     // if enemy misses
     if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if(!player.dead) {
        switch (event.key) {
            // Player movement and actions
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case ' ':
                player.attack()
                break     
        }
    }

    if (!enemy.dead) {
        switch(event.key) {
            // Enemy movement and actions
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                enemy.attack()
                break   
        }
    }
})

window.addEventListener('keyup', (event) => {
    // Player movement and action release
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
    // Enemy movment and action release
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})