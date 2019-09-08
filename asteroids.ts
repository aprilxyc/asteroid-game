// FIT2102 2019 Assignment 1
// https://docs.google.com/document/d/1Gr-M6LTU-tfm4yabqZWJYg-zTjEVqHKKTCvePGCYsUA/edit?usp=sharing

function asteroids() {
  // Inside this function you will use the classes and functions 
  // defined in svgelement.ts and observable.ts
  // to add visuals to the svg element in asteroids.html, animate them, and make them interactive.
  // Study and complete the Observable tasks in the week 4 tutorial worksheet first to get ideas.

  // You will be marked on your functional programming style
  // as well as the functionality that you implement.
  // Document your code!  
  // Explain which ideas you have used ideas from the lectures to 
  // create reusable, generic functions.

  const svg = document.getElementById("canvas")!;

  let gameTimer = 100,
      gameComplete = false
  const gameObservable = Observable.interval(gameTimer).filter(() => !gameComplete)

  // creates new observable that emits an event object everytime a keydown is fired
  // emits keyboard event everytime user presses down a key
  const keydown$ = Observable.fromEvent<KeyboardEvent>(document, 'keydown');
  const keyup$   = Observable.fromEvent<KeyboardEvent>(document, 'keyup');

  // make a group for the spaceship and a transform to move it and rotate it
  // to animate the spaceship you will update the transform property
  // spaceship actual movement
  let g = new Elem(svg, 'g')
    .attr("transform", "translate(300 300) rotate(300)")

  // regex pattern to parse the string
  let shipMove = /translate\((\d+) (\d+)\) rotate\((\d+)\)/.exec(g.attr("transform"))!;
  // 0: "translate(300 300) rotate(70)"
  // 1: "300" 
  // 2: "300"
  // 3: "70"

  // create a polygon shape for the space ship as a child of the transform group
  // spaceship aesthetic
  let ship = new Elem(svg, 'polygon', g.elem)
    .attr("points", "-15,20 15,20 0,-30")
    .attr("style", "fill:#f4e46c;stroke:#f4e46c;stroke-width:1")
  
  let translateX = Number(shipMove[1])
  let translateY = Number(shipMove[2])
  let rotation   = Number(shipMove[3])

  let asteroid_velocityX = 1
  let asteroid_velocityY = 1

  let asteroid = new Elem(svg, "circle")
        .attr("style", "fill:#9bd5bd;stroke:#9bd5bd;stroke-width:2")
        .attr("cx", 300) // follow where the arrow is
        .attr("cy", 20)
        .attr("r", 50)

  // use an interval to keep
  // inspired by: https://stackoverflow.com/questions/52015418/random-movement-angular
  function getRandomInt(min: number, max: number) {
    return Math.floor((Math.random() + min) * Math.floor(max));
  }

  // Then you will need to determine the direction, if it is negative (go left) or positive (go right):
  function getDirection() {
    return getRandomInt(0, 2) === 0 ? -1 : 1; 
  }

  let directionX = getDirection();
  let directionY = getDirection();

  let velocityX = getRandomInt(1,8); // the number will be between -8 and 8 excluding 0
  let velocityY = getRandomInt(1,8); // same here

  // LOGIC FOR ASTEROID MOVING RANDOMLY
  gameObservable.subscribe(() => {
    asteroid.attr("cx", directionX * velocityX + Number(asteroid.attr("cx")))  // the ball should go towards the left or the right
    asteroid.attr("cy", directionY * velocityY + Number(asteroid.attr("cy"))) // the ball should go up or down
  })

  // LOGIC FOR ASTEROID COLLIDING WITH EDGE

  gameObservable
  .map(() => ({
    asteroidX: Number(asteroid.attr("cx")),
    asteroidY: Number(asteroid.attr("cy")),
    asteroidR: Number(asteroid.attr("r"))
  }))
  .filter(({asteroidX, asteroidY, asteroidR}) => (
    (asteroidX >= 600 || asteroidX <= 0) && (asteroidY >= 600 || asteroidY <= 0 )
  ))
  .subscribe(() => {
    directionX *= -1
    directionY *= -1
  })


  // gameObservable.map(() => (
  //   {asteroidX: Number(asteroid.attr("cx")),
  //   asteroidY: Number(asteroid.attr("cy")),
  //   asteroidR: Number(asteroid.attr("r"))  
  //   }
  // ).filter(({asteroidX, asteroidY, asteroidR}) => (
    
  // ))
  
  // )

  // Observable.interval(100)
  // .takeUntil(Observable.interval(10000))
  // .map(() => {
  //   asteroid.attr("asteroidVelocityX", randomDirectionX) // set the velocity for x
  //   asteroid.attr("asteroidVelocityY", randomDirectionY) // set the velocity for y
  //   asteroid.attr("cx", (directionX * asteroid.attr("asteroidVelocityX")) + Number(asteroid.attr("cx"))); // the ball should go towards the left or the right
  //   asteroid.attr("cy", (directionY * asteroid.attr("asteroidVelocityY")) + Number(asteroid.attr("cy"))); // the ball should go up or down
  //   return asteroid
  // })
  // .map((asteroid) => ({
  //   asteroid,
  //   asteroidX: Number(asteroid.attr("cx")),
  //   asteroidY: Number(asteroid.attr("cy")),
  //   asteroidR: Number(asteroid.attr("r"))}))
  //   .filter(({asteroidX, asteroidY, asteroidR}) => {
  //     (asteroidX > 600 || asteroidX < 0)
  //   })
  //     .subscribe(() =>{
  //     asteroid.attr("asteroidVelocityX", Number(asteroid.attr("asteroidVelocityX") * -1))
  //     asteroid.attr("cx", (directionX * asteroid.attr("asteroidVelocityX")) + Number(asteroid.attr("cx")))
  //     asteroid.attr("asteroidVelocityY", Number(asteroid.attr("asteroidVelocityX") * -1))// reverse the velocity
  //     asteroid.attr("cx", (directionY * asteroid.attr("asteroidVelocityY")) + Number(asteroid.attr("cy")))
  // })
  
  // .filter(({asteroidX, asteroidY, asteroidR}) => {
  //   (asteroidX <= -20 || asteroidX > 610)
  //   console.log("true")
    // (asteroidX <= -20 || asteroidX >= 620) && (asteroidY > -20 || asteroidY < 620)
  // }).subscribe(() => console.log("true"))
  // .subscribe(() =>{
  //   asteroid.attr("asteroidVelocityX", Number(asteroid.attr("asteroidVelocityX") * -1)
  //   asteroid.attr("asteroidVelocityY" Number(asteroid.attr("asteroidVelocityX") * -1)// reverse the velocity
  // }
  


  
    // )).subscribe((asteroidX, asteroidY, asteroidR) => {
  //   console.log(asteroidX, asteroidY, asteroidR)
  // })


  // Observable.interval(10)
  // .takeUntil(Observable.interval(100000))
  // .map(() => {
  //   asteroid.attr("cx", asteroidX = asteroidX + 10)
  //   // asteroid.attr("cx", asteroidY = asteroidY + 10)
  //   return asteroid.attr("cx")
  // }).filter((asteroidXcoord) => (asteroidXcoord > 600))
  // .subscribe(() => asteroid.attr("cx", 0))


  // movement left
  keydown$ // get the repeat object and take it once itis true
    .map(({ key }) => {
      return key
    })
    .filter((key) => (key == "ArrowLeft"))
    .scan(0, (acc, curr) => acc + 10) // Don't need a scan
    .subscribe(() => {
      g.attr("transform", `translate(${translateX} ${translateY}) rotate(${rotation = rotation - 10})`)
    })

  // movement right
  keydown$
    .map(({ key }) => {
      return key
    })
    .filter((key) => (key == "ArrowRight"))
    .scan(0, (acc, curr) => acc + 10)
    .subscribe(() => {
      g.attr("transform", `translate(${translateX} ${translateY}) rotate(${rotation = rotation + 10})`)
    })

  // movement up
  keydown$
    .map(({ key }) => {
      return key
    })
    .filter((key) => (key == "ArrowUp"))
    .scan(0, (acc, curr) => acc + 10)
    .subscribe(() => {
      const rotationRadians = rotation * (Math.PI / 180)
      const distanceX       = Math.cos(rotationRadians - (90 * (Math.PI / 180))) * 10
      const distanceY       = Math.sin(rotationRadians - (90 * (Math.PI / 180))) * 10
      g.attr("transform", `translate(${translateX = translateX + distanceX} ${translateY = translateY + distanceY}) rotate(${rotation})`)
    })

  // reduce observables into an array  -> takes emissions from observable and reduces them too initial value
  // keep time and user input int oobservables and do merge etc.. combine etc... 
  // there is merge nad merge but merge withh the latest bit 
  // reduce user input into a game state

  // store the bullets into an array
  let bulletArray = []

  keydown$
    .map(({ key }) => {
      return key
    })
    .filter((key) => (key == " "))
    .subscribe((e) => {
      const rotationRadians = rotation * (Math.PI / 180)
      const bulletDistanceX = Math.cos(rotationRadians - (90 * (Math.PI / 180))) * 10
      const bulletDistanceY = Math.sin(rotationRadians - (90 * (Math.PI / 180))) * 10

      // put bullets into an array
      let bulletShot = new Elem(svg, 'circle')
        .attr("style", "fill:#ffffff;stroke:#ffffff;stroke-width:2")
        .attr("cx", translateX) // follow where the arrow is
        .attr("cy", translateY)
        .attr("r", 5)

      bulletArray.push(bulletShot)

      Observable.interval(100).map(x => ({ x, currBullet: bulletShot }))
        .filter((currBullet) => Number(currBullet.currBullet.attr("cx")) < 600)
        .filter((currBullet) => Number(currBullet.currBullet.attr("cy")) < 600)
        .subscribe((currBullet) => {
          let bulletX = Number(currBullet.currBullet.attr("cx"))
          let bulletY = Number(currBullet.currBullet.attr("cy"))

          currBullet.currBullet.attr("cx", bulletDistanceX + bulletX)
          currBullet.currBullet.attr("cy", bulletDistanceY + bulletY)
        })
    })
  }

    // delete the element using
    // element.remove 
//parent.remove(child)

// logic for asteroid destroying 
// const checkIfOnscreen = (bullet) => {
//   if bullet.cx < 600 & bullet.cy < 600 {
//     bulletShot.attr("cx", bulletX = bulletDistanceX + bulletX)
//     bulletShot.attr("cy", bulletY = bulletDistanceY + bulletY)
//   } else {
//     parent.remove(child) // delete the element using element.remove
//   }
// }

// For asteroids, absolute distance must be smaller than sum of the radii then they have collided

// the following simply runs your asteroids function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = () => {
    asteroids();
  }
