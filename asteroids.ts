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

  //REMINDER CHANGE EVERYTHING TO TODO

  // save global variables so you can make objects reference them later - taken from Harsil's code
  const          arrayOfAsteroids: Elem[] = [],   // array of bullets
  arrayOfBullets: Elem[]                  = []    // array of asteroiods

  let gameComplete = false

  const mainTimer = Observable.interval(5)

  const asteroidObservable = Observable.interval(1)

  const mainAsteroidsObservable = mainTimer
    .takeUntil(
      mainTimer.filter(_ => gameComplete == true)
    ).map(_ => ({
      bulletArray   : arrayOfBullets,
      asteroidArray : arrayOfAsteroids,
      ship: g,
      shipTransformX: Number(g.elem.transform.baseVal.getItem(0).matrix.e),
      shipTransformY: Number(g.elem.transform.baseVal.getItem(0).matrix.f),
      shipRotation  : Number(g.elem.transform.baseVal.getItem(1).angle)
    }))

  const svg = document.getElementById("canvas")!;

  // make a group for the spaceship and a transform to move it and rotate it
  // to animate the spaceship you will update the transform property
  const g = new Elem(svg, 'g')
    .attr("transform", "translate(300 300) rotate(170)")

  // create a polygon shape for the space ship as a child of the transform group 
  const ship = new Elem(svg, 'polygon', g.elem)
    .attr("points", "-15,20 15,20 0,-20")
    .attr("style", "fill:lime;stroke:purple;stroke-width:1")

  // creates new observable that emits an event object everytime a keydown is fired
  // emits keyboard event everytime user presses down a key
  const keydown$ = Observable.fromEvent<KeyboardEvent>(document, 'keydown');
  const keyup$   = Observable.fromEvent<KeyboardEvent>(document, 'keyup');

  /* Logic for the key movement */

  // moving ship to the right
  keydown$.map(({ key }) => {
    return ({
      key,
      spaceship: g
    })
  }).filter(({ key }) => (key == "ArrowRight"))
    .flatMap((key) => (
      Observable.interval(15)
        .takeUntil(keyup$)
    ))
    .subscribe(({ spaceship }) => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)
      g.attr("transform", `translate(${transformX} ${transformY}) rotate(${shipRotation = shipRotation + 10})`)
    })

  // moving ship to the left
  keydown$.map(({ key }) => {
    return ({
      key,
      spaceship: g
    })
  }).filter(({ key }) => (key == "ArrowLeft"))
    .flatMap((key) => (
      Observable.interval(15)
        .takeUntil(keyup$)
    ))
    .subscribe(({ spaceship }) => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)
      g.attr("transform", `translate(${transformX} ${transformY}) rotate(${shipRotation = shipRotation - 10})`)
    })

  keydown$.map(({ key }) => {
    return ({
      key         : key,
      transformX  : Number(g.elem.transform.baseVal.getItem(0).matrix.e),
      transformY  : Number(g.elem.transform.baseVal.getItem(0).matrix.f),
      shipRotation: Number(g.elem.transform.baseVal.getItem(1).angle)
    })
  }).filter(({ key, transformX, transformY, shipRotation }) => (key == "ArrowUp"))
    .map(({ key, transformX, transformY, shipRotation }) => ({ vx: Math.cos(Math.PI * (shipRotation - 90) / 180), vy: Math.sin(Math.PI * (shipRotation - 90) / 180) }))
    .flatMap(({ vx, vy }) =>
      Observable.interval(50)
        .map(t => ({ x: 300 * vx / t, y: 300 * vy / t })))
    .subscribe(({ x, y }) => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)

      g.attr("transform", `translate(${transformX = transformX + x} ${transformY = transformY + y}) rotate(${shipRotation})`)
    })

  /*  Logic for creating the bullets */
  keydown$
    .map(({ key }) => ({
      key,
      transformX  : Number(g.elem.transform.baseVal.getItem(0).matrix.e),
      transformY  : Number(g.elem.transform.baseVal.getItem(0).matrix.f),
      shipRotation: Number(g.elem.transform.baseVal.getItem(1).angle),
    }))
    .filter(({ key, transformX, transformY, shipRotation }) => (key == " "))
    .subscribe(({ key, transformX, transformY, shipRotation }) => {
      const rotationRadians = shipRotation * (Math.PI / 180)

      // create bullets
      let bulletShot = new Elem(svg, 'circle')
        .attr("style", "fill:#ffffff;stroke:#ffffff;stroke-width:2")
        .attr("cx", transformX) // follow where the arrow is
        .attr("cy", transformY)
        .attr("r", 4)
        .attr("bulletDistanceX", Math.cos(rotationRadians - (90 * (Math.PI / 180))) * 1)
        .attr("bulletDistanceY", Math.sin(rotationRadians - (90 * (Math.PI / 180))) * 1)

      // push bullet into array
      arrayOfBullets.push(bulletShot)

    })

  /* Logic for removing the bullets that are offscreen from the array */
  mainAsteroidsObservable.subscribe(({ bulletArray }) => {
    bulletArray.map((bullet) => bullet.attr("cx", parseFloat(bullet.attr("cx")) + parseFloat(bullet.attr("bulletDistanceX")))
      .attr("cy", parseFloat(bullet.attr("cy")) + parseFloat(bullet.attr("bulletDistanceY"))))
      .filter((bull) => (parseFloat(bull.attr("cx")) >= 600) || parseFloat(bull.attr("cy")) >= 600 || parseFloat(bull.attr("cy")) <= 0 || parseFloat(bull.attr("cx")) <= 0) // remove the bullet if offscreen
      .forEach((bull) => {
        bull.elem.remove()
        arrayOfBullets.splice(arrayOfBullets.indexOf(bull), 1)
      })
  })

  // Checks for collisons 
  function checkCollision(x1: number, x2: number, y1: number, y2: number, radius1: number, radius2: number) {
    let lineOfDistance = Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))),
        sumOfRadii     = (radius1 + radius2)
    return lineOfDistance <= sumOfRadii
  }

  //     /* LOGIC FOR RANDOM ASTEROID MOVEMENT */
  //     // used to get a random integer for asteroid random movementts
  //     // inspired by: https://stackoverflow.com/questions/52015418/random-movement-angular
  function getRandomInt(min: number, max: number) {
    return Math.floor((Math.random() + min) * Math.floor(max));
  }

  function getDirection() {
    return getRandomInt(0, 2) === 0? -1 : 1; 
}

  let x_velocity = getRandomInt(1,8); // the number will be between -8 and 8 excluding 0
  let y_velocity = getRandomInt(1,8); // same here
  let directionX = getDirection()
  let directionY = getDirection()


  //     /* LOGIC TO CREATE THE ASTEROIDS AND PUT IT INTO AN ARRAY */
  mainAsteroidsObservable.
    takeUntil(asteroidObservable.filter(i => i == 5)) // this part taken from Harsil's code
    .subscribe((e) => {
      // create random starting points
      let asteroidRandomX = getRandomInt(0, 600)
      let asteroidRandomY = getRandomInt(0, 600)

      // create asteriod svg
      let asteroid = new Elem(svg, "circle")
        .attr("style", "fill:#CAEBF2;stroke:#9bd5bd;stroke-width:2")
        .attr("cx", asteroidRandomX) // follow where the arrow is
        .attr("cy", asteroidRandomY)
        .attr("r", 50)
        .attr("splitCounter", 3)

      console.log(asteroid)

      // push asteroid into array
      arrayOfAsteroids.push(asteroid)
    })


  function splitAsteroid(asteroid, asteroidX, asteroidY, asteroidRadius, asteroidSplitCounter) {
    // add 2 new asteroid into the array
    // if split counter is not greater than 3
    if (asteroid.attr("splitCounter") != 0) {
        let asteroid = new Elem(svg, "circle")
          .attr("style", "fill:#CAEBF2;stroke:#9bd5bd;stroke-width:2")
          .attr("cx", asteroidX + 10)
          .attr("cy", asteroidY + 10)
          .attr("r", asteroidRadius = asteroidRadius - 10)
          .attr("splitCounter", asteroidSplitCounter = asteroidSplitCounter - 1)

        arrayOfAsteroids.push(asteroid)
    }
  }

  /* Logic for bullet and asteroid collision */
  // removes bullets and asteroids when it collides
  mainAsteroidsObservable.map(({ bulletArray, asteroidArray }) => {
    // go through the asteroids
    asteroidArray.forEach((asteroid) => {
      bulletArray.filter((bullet) => (
        checkCollision(parseFloat(asteroid.attr("cx")), parseFloat(bullet.attr("cx")), parseFloat(asteroid.attr("cy")), parseFloat(bullet.attr("cy")), parseFloat(bullet.attr("r")), parseFloat(asteroid.attr("r")))
      ))
        .forEach((bullet) => {
          // remove bullets here
          bullet.elem.remove()
          arrayOfBullets.splice(arrayOfBullets.indexOf(bullet), 1)

          // create new asteroids here - split here
          splitAsteroid(asteroid, parseFloat(asteroid.attr("cx")), parseFloat(asteroid.attr("cy")), parseFloat(asteroid.attr("r")), parseFloat(asteroid.attr("splitCounter")))
          asteroid.elem.remove()
          arrayOfAsteroids.splice(arrayOfAsteroids.indexOf(asteroid), 1)
        })
    })
  }).subscribe(() => console.log)

  /*  LOGIC FOR MOVING THE ASTEROIDS RANDOMLY */
  // mainAsteroidsObservable.subscribe(({ asteroidArray }) => {
  //   asteroidArray.forEach((asteroid) => 
  //     asteroid.attr("cx", (Math.random() * directionX ) + parseFloat(asteroid.attr("cx")))
  //     .attr("cy", (Math.random() * directionY) +parseFloat(asteroid.attr("cy")))
  //     )
  // })

  /* Constantly checking for screen wraps */

  let asteroidWrappingState = 
  mainAsteroidsObservable.map(({ship, shipTransformX, shipTransformY, shipRotation}) => ({
    shipTransformX,
    shipTransformY,
    ship
  }))


  // If ship goes out of right hand side of the screen
  asteroidWrappingState.filter(({shipTransformX, ship}) => (shipTransformX >= 600))
  .subscribe(() => {
    let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
        transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
        shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)
    
    g.attr("transform", `translate(${transformX = 10} ${transformY}) rotate(${shipRotation})`)
  })

    // If ship goes out of left hand side of the screen
    asteroidWrappingState.filter(({shipTransformX, ship}) => (shipTransformX <= 0))
    .subscribe(() => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)
      
      g.attr("transform", `translate(${transformX = 600} ${transformY}) rotate(${shipRotation})`)
    })

    // if ship leaves top of screen
    asteroidWrappingState.filter(({shipTransformY, ship}) => (shipTransformY >= 600))
    .subscribe(() => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)
      
      g.attr("transform", `translate(${transformX} ${transformY = 0}) rotate(${shipRotation})`)
    })

    // if ship leaves bottom of screen
  asteroidWrappingState.filter(({shipTransformY, ship}) => (shipTransformY <= 0))
    .subscribe(() => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)
      
      g.attr("transform", `translate(${transformX} ${transformY = 600}) rotate(${shipRotation})`)
    })
  
  /* Logic for person colliding with asteroid */

}

// the following simply runs your asteroids function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = () => {
    asteroids();
  }




