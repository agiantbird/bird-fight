class Sprite {
    // pass arguments as an object, so position and requirement does not matter
    constructor({ position, imageSrc, scale=1, framesMax=1}) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
    }

    draw() {
        c.drawImage(
            this.image,
            //animate sprite sheets with canvas 'crop'
            // crop x position
            this.framesCurrent * (this.image.width / this.framesMax),
            // crop y position
            0,
            // crop width
            this.image.width / this.framesMax,
            // crop height
            this.image.height,

            this.position.x,
            this.position.y,
            //// image width, divided by amount of frames, times scale
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    update() {
        this.draw()
        this.framesElapsed++
        // control animation speed via framesElapsed and framesHold
        if(this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++         
            } else {
                this.framesCurrent = 0
            }
        }
    }
}

class Fighter {
    // pass arguments as an object, so position and requirement does not matter
    constructor({position, velocity, color = 'red', offset}) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        // Attack box
        if (this.isAttacking) {
            c.fillStyle = 'green'
            c.fillRect(
                this.attackBox.position.x, 
                this.attackBox.position.y, 
                this.attackBox.width, 
                this.attackBox.height 
            )
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
                                                                            // - 96 puts them on the background's 'floor'
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}
