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

  //REMINDER CHANGE EVERYTHING TO CONST
  //REMINDER TO ASK ABOUT HOW TO DO RANDOM MMOVEMENT
  // REMINDER TO TALK ASK ABOUT HOW TO SPLIT IT PROPERL IN A FUNCTIONAL WAY

  // make levels and if you get to certain amount of points, the background will change
  // you win when you hit a certain amount of points

  // have a random booster that that shows up every 10 seconds -> gives you more points

  // save global variables so you can make objects reference them later - taken from Harsil's code
  let            arrayOfAsteroids: Elem[] = [],   // array of bullets
  arrayOfBullets: Elem[]                  = [],
                 myScore                  = 0,
                 lives                    = 3,
                 bomb                     = 3,
                 shipColourArray          = []

  let   gameComplete = false
  const mainTimer    = Observable.interval(5)

  const asteroidObservable = Observable.interval(1)

  const mainAsteroidsObservable = mainTimer
    .takeUntil(
      mainTimer.filter(_ => gameComplete == true)
    ).map(_ => ({
      bulletArray   : arrayOfBullets,
      asteroidArray : arrayOfAsteroids,
      ship          : g,
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
    .attr("points", "-15,20 0,15 15,20 0, -20")
    .attr("style", "fill:#171846;stroke:#ffffff ;stroke-width:2")

  // creates new observable that emits an event object everytime a keydown is fired
  const keydown$ = Observable.fromEvent<KeyboardEvent>(document, 'keydown').map(({keyCode, key, repeat}) => ({
    asteroidArray: arrayOfAsteroids,
    keyCode,
    key,
    repeat
  })),
  keyup$ = Observable.fromEvent<KeyboardEvent>(document, 'keyup');

  /* LOGIC FOR KEY MOVEMENT  */

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
    .subscribe(({ }) => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)
      g.attr("transform", `translate(${transformX} ${transformY}) rotate(${shipRotation = shipRotation - 10})`)
    })

  // moving ship forwards
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

  /*  LOGIC FOR CREATING THE BULLETS */
  keydown$
    .map(({ key }) => ({
      key,
      transformX  : Number(g.elem.transform.baseVal.getItem(0).matrix.e),
      transformY  : Number(g.elem.transform.baseVal.getItem(0).matrix.f),
      shipRotation: Number(g.elem.transform.baseVal.getItem(1).angle),
    }))
    .filter(({ key }) => (key == " "))
    .subscribe(({ transformX, transformY, shipRotation }) => {
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

  /* LOGIC FOR REMOVING BULLETS THAT ARE OFFSCREEN FROM ARRAY */
  mainAsteroidsObservable.subscribe(({ bulletArray }) => {
    bulletArray
      .map((bullet) => bullet.attr("cx", parseFloat(bullet.attr("cx")) + parseFloat(bullet.attr("bulletDistanceX")))
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

  function checkShipCollision(x1: number, x2: number, y1: number, y2: number, radius1: number, radius2: number, shipTransformX: number, shipTransformY: number, shipRotation: number) {
    let lineOfDistance = Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))),
        sumOfRadii     = (radius1 + radius2)

    if (lineOfDistance <= sumOfRadii) {
      g.attr("transform", `translate(300 300) rotate(300)`)
      --lives
      updateHTMLElements(myScore, lives, bomb)
      return true
    }
    return false
  }
  
  /* LOGIC FOR RANDOM ASTEROID MOVEMENT 
   // used to get a random integer for asteroid random movements
  // inspired by: https://stackoverflow.com/questions/52015418/random-movement-angular
  */
  function getRandomInt(min: number, max: number) {
    return (Math.random() + min) * Math.floor(max);
  }

  /*  LOGIC FOR MOVING THE ASTEROIDS RANDOMLY */
  mainAsteroidsObservable.subscribe(({ asteroidArray }) => {
    asteroidArray.forEach((asteroid) => {
      asteroid
        .attr("cx", Number(asteroid.attr("directionX")) + Number(asteroid.attr("cx")))
        .attr("cy", Number(asteroid.attr("directionY")) + Number(asteroid.attr("cy")))
    }
    )
  })

  /* LOGIC TO CREATE THE ASTEROIDS AND PUT IT INTO AN ARRAY */
 mainAsteroidsObservable
    .takeUntil(asteroidObservable.filter(i => i == 8)) // this part taken from Harsil's code
    .subscribe((e) => {
      // create random starting points
      let asteroidRandomX = getRandomInt(0, 600)
      let asteroidRandomY = getRandomInt(0, 600)

      // create asteriod svg
      let asteroid = new Elem(svg, "circle")
        .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
        .attr("cx", asteroidRandomX) // follow where the arrow is
        .attr("cy", asteroidRandomY)
        .attr("r", 50)
        .attr("splitCounter", 3)
        .attr("directionX", getRandomInt(-1, 1))
        .attr("directionY", getRandomInt(-1, 1))
        .attr("id", "circleShape")
      // push asteroid into array
      arrayOfAsteroids.push(asteroid)
    })

    mainAsteroidsObservable
    .filter(({asteroidArray}) => asteroidArray.length == 0)
    .subscribe((e) => {

      // create asteriod svg
      let asteroid = new Elem(svg, "circle")
        .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
        .attr("cx", getRandomInt(0, 600)) // follow where the arrow is
        .attr("cy", getRandomInt(0, 600))
        .attr("r", 50)
        .attr("splitCounter", 3)
        .attr("directionX", getRandomInt(-1, 1))
        .attr("directionY", getRandomInt(-1, 1))
      // push asteroid into array
      arrayOfAsteroids.push(asteroid)
    })

  function splitAsteroid(asteroid, asteroidX: number, asteroidY: number, asteroidRadius: number, asteroidSplitCounter: number) {

    // add 2 new asteroid into the array
    // if split counter is not greater than 3
    if (asteroid.attr("splitCounter") != 0) {

      let asteroid1 = new Elem(svg, "circle")
        .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
        .attr("cx", asteroidX + 20)
        .attr("cy", asteroidY + 20)
        .attr("r", asteroidRadius - 10)
        .attr("splitCounter", asteroidSplitCounter = asteroidSplitCounter - 1)
        .attr("directionX", getRandomInt(-1, 1))
        .attr("directionY", getRandomInt(-1, 1))

      arrayOfAsteroids.push(asteroid1)

      let asteroid2 = new Elem(svg, "circle")
        .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
        .attr("cx", asteroidX - 20)
        .attr("cy", asteroidY - 20)
        .attr("r", asteroidRadius - 10)
        .attr("splitCounter", asteroidSplitCounter = asteroidSplitCounter - 1)
        .attr("directionX", getRandomInt(-1, 1))
        .attr("directionY", getRandomInt(-1, 1))

      arrayOfAsteroids.push(asteroid2)
    }
  }

  /* LOGIC FOR BULLET AND ASTEROID COLLISIONS 
  This removes bullets and asteroids when bullets collide with asteroids. */
  mainAsteroidsObservable.map(({ bulletArray, asteroidArray, shipTransformX, shipTransformY, shipRotation}) => {
    // go through the asteroids
    asteroidArray.forEach((asteroid) => {
      bulletArray.filter((bullet) => (
        checkCollision(Number(asteroid.attr("cx")), Number(bullet.attr("cx")), Number(asteroid.attr("cy")), Number(bullet.attr("cy")), Number(bullet.attr("r")), Number(asteroid.attr("r")), shipTransformX, shipTransformY, shipRotation)
      ))
        .forEach((bullet) => {
          // remove bullets here
          bullet.elem.remove()
          arrayOfBullets.splice(arrayOfBullets.indexOf(bullet), 1)

          // increase score by 10 for each collision
          myScore += 10
          updateHTMLElements(myScore, lives, bomb)

          // create new asteroids here - split here
          splitAsteroid(asteroid, parseFloat(asteroid.attr("cx")), parseFloat(asteroid.attr("cy")), parseFloat(asteroid.attr("r")), parseFloat(asteroid.attr("splitCounter")))
          
          asteroid.elem.remove()
          arrayOfAsteroids.splice(arrayOfAsteroids.indexOf(asteroid), 1)
        })
    })
  }).subscribe(() => console.log)

  /* LOGIC THAT CONSTANTLY CHECKS FOR SCREEN WRAPS */

  const shipWrappingState = mainAsteroidsObservable
    .map(({ ship, shipTransformX, shipTransformY, shipRotation }) =>
      ({
        shipTransformX,
        shipTransformY,
        ship
      }))

  // If ship goes out of right hand side of the screen
  shipWrappingState
    .filter(({ shipTransformX }) => (shipTransformX >= 600))
    .subscribe(() => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)

      g.attr("transform", `translate(${transformX = 10} ${transformY}) rotate(${shipRotation})`)
    })

  // If ship goes out of left hand side of the screen
  shipWrappingState
    .filter(({ shipTransformX }) => (shipTransformX <= 0))
    .subscribe(() => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)

      g.attr("transform", `translate(${transformX = 600} ${transformY}) rotate(${shipRotation})`)
    })

  // if ship leaves top of screen
  shipWrappingState
    .filter(({ shipTransformY }) => (shipTransformY >= 600))
    .subscribe(() => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)

      g.attr("transform", `translate(${transformX} ${transformY = 0}) rotate(${shipRotation})`)
    })

  // if ship leaves bottom of screen
  shipWrappingState
    .filter(({ shipTransformY }) => (shipTransformY <= 0))
    .subscribe(() => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)

      g.attr("transform", `translate(${transformX} ${transformY = 600}) rotate(${shipRotation})`)
    })

  // save the asteroid wrapping as a state
  let asteroidWrappingState = 
    mainAsteroidsObservable.map(({ asteroidArray }) => {
      return asteroidArray // get the array itself
    })

  // going out of right screen
  asteroidWrappingState.forEach((asteroid) => asteroid.filter((asteroid) => Number(asteroid.attr("cx")) >= 650)
    .map((asteroid) => asteroid.attr("cx", 0))
  ).subscribe(() => console.log)

  // // going out of top screen
  asteroidWrappingState.forEach((asteroid) => asteroid.filter((asteroid) => Number(asteroid.attr("cy")) >= 650)
    .map((asteroid) => asteroid.attr("cy", 0))
  ).subscribe(() => console.log)

  // // going out of left screen
  asteroidWrappingState.forEach((asteroid) => asteroid.filter((asteroid) => Number(asteroid.attr("cx")) <= -50)
    .map((asteroid) => asteroid.attr("cx", 600))
  ).subscribe(() => console.log)

  // // going out of bottom screen
  asteroidWrappingState.forEach((asteroid) => asteroid.filter((asteroid) => parseFloat(asteroid.attr("cy")) <= -50)
    .map((asteroid) => asteroid.attr("cy", 600))
  ).subscribe(() => console.log)


  let polygonTag  = document.querySelector("polygon"),
      polygonBBox = polygonTag!.getBBox()               // get the width or height of the polygon element g

  /* LOGIC FOR SPACESHIP COLLIDING WITH ASTEROID*/
  mainAsteroidsObservable.map(({ asteroidArray, shipTransformX, shipTransformY }) => {
    return ({
      asteroidArray : asteroidArray,
      shipTransformX: shipTransformX,
      shipTransformY: shipTransformY
    })
  }).forEach(({ asteroidArray, shipTransformX, shipTransformY, shipRotation }) => asteroidArray.filter((asteroid) =>
    checkShipCollision(Number(shipTransformX), Number(asteroid.attr("cx")), Number(shipTransformY), Number(asteroid.attr("cy")), Number(asteroid.attr("r")), Number(polygonBBox.width - 15), shipTransformX, shipTransformY, shipRotation)
  ).map((e) => {
    return lives
  }).filter((lives) => (lives == 0)).map(() => {
    gameComplete = true;
    ship.attr("style", "fill:#FF0000;stroke:purple;stroke-width:1"); // make this a shortterm observable
    // add function here to show game over
  })
  ).subscribe(() => console.log)

  // removes all circles using HTML. getElementsByTagName returns a NodeList that needs to be
  // converted into an array first
  //https://stackoverflow.com/questions/20044252/remove-all-the-dom-elements-with-a-specific-tag-name-in-javascript
  function removeCircleCanvas() {
    Array.prototype.slice.call(document.getElementsByTagName("circle")).forEach(
      function(item) {
        item.remove();
        // or item.parentNode.removeChild(item); for older browsers (Edge-)
    });
  }

/*  LOGIC FOR USING BOMB POWERUP */
  keydown$.map(({ keyCode, repeat }) => {
    return ({
      keyCode,
      spaceship: g,
      repeat
    })
  }).filter(({ keyCode, repeat}) => (keyCode == 80 && repeat == false && bomb != 0))
    .map(() => {
      return (
        arrayOfAsteroids
      )     
    })
    .forEach((arrayOfAsteroids) =>  {
      arrayOfAsteroids.splice(0, arrayOfAsteroids.length)
      removeCircleCanvas()
    }).subscribe((arrayOfAsteroids) => console.log(arrayOfAsteroids))

  // impure function to update the score, lives and bomb
  function updateHTMLElements(score: number, lives: number, bomb: number) {
    document.getElementById("score")!.innerHTML = "Score: " + score
    document.getElementById("lives")!.innerHTML = "Lives: " + lives
    document.getElementById("bomb")!.innerHTML  = "Bomb: " + bomb
  }

}

// the following simply runs your asteroids function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = () => {
    asteroids();
  }