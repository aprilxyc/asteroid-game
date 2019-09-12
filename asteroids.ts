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

  // make levels and if you get to certain amount of points, the background will change
  // you win when you hit a certain amount of points

  // have a random booster that that shows up every 10 seconds -> gives you more points

  // save global variables so you can make objects reference them later - taken from Harsil's code
  let            arrayOfAsteroids: Elem[] = [],    // array of bullets
  arrayOfBullets: Elem[]                  = [],
  myScore        :number                  = 0,
  lives          :number                  = 3,
  bomb           : number                 = 3,
  gameComplete   : boolean                = false

  const mainTimer               = Observable.interval(5),
        asteroidObservable      = Observable.interval(1),
        mainAsteroidsObservable = mainTimer
    .takeUntil(
      mainTimer.filter(_ => gameComplete == true)
    ).map(_ => ({
      bulletArray   : arrayOfBullets,
      asteroidArray : arrayOfAsteroids,
      ship          : g,
      shipTransformX: Number(g.elem.transform.baseVal.getItem(0).matrix.e),
      shipTransformY: Number(g.elem.transform.baseVal.getItem(0).matrix.f),
      shipRotation  : Number(g.elem.transform.baseVal.getItem(1).angle)
    })),
    scoreIncrease = 10

  const svg = document.getElementById("canvas")!,
  
  const g = new Elem(svg, 'g')
    .attr("transform", "translate(300 300) rotate(170)")

  const ship = new Elem(svg, 'polygon', g.elem)
    .attr("points", "-15,20 0,15 15,20 0, -20")
    .attr("style", "fill:#171846;stroke:#ffffff ;stroke-width:2")

  // get the width / height of the polygon element g
  let polygonTag  = document.querySelector("polygon"),
      polygonBBox = polygonTag!.getBBox()

  // creates new observable that emits an event object everytime a keydown is fired
  const keydown$ = Observable.fromEvent<KeyboardEvent>(document, 'keydown').map(({keyCode, key, repeat}) => ({
    asteroidArray: arrayOfAsteroids,
    keyCode,
    key,
    repeat
  })),
  keyup$ = Observable.fromEvent<KeyboardEvent>(document, 'keyup');

  /* 
  LOGIC FOR KEY MOVEMENT 
  */

  // moving ship to the right
  keydown$.map(({ key }) => {
    return ({
      key,
      spaceship: g
    })
  }).filter(({ key, keyCode }) => (key == "ArrowRight" || keyCode == 68))
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
  keydown$.map(({ key, keyCode }) => {
    return ({
      key,
      spaceship: g
    })
  }).filter(({ key, keyCode}) => (key == "ArrowLeft" || keyCode == 65))
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
  keydown$.map(({ key, keyCode }) => {
    return ({
      key         : key,
      transformX  : Number(g.elem.transform.baseVal.getItem(0).matrix.e),
      transformY  : Number(g.elem.transform.baseVal.getItem(0).matrix.f),
      shipRotation: Number(g.elem.transform.baseVal.getItem(1).angle)
    })
  }).filter(({ key, transformX, transformY, shipRotation, keyCode }) => (key == "ArrowUp" || keyCode == 87))
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
    .map(({ key, keyCode }) => ({
      key,
      transformX  : Number(g.elem.transform.baseVal.getItem(0).matrix.e),
      transformY  : Number(g.elem.transform.baseVal.getItem(0).matrix.f),
      shipRotation: Number(g.elem.transform.baseVal.getItem(1).angle),
    }))
    .filter(({ key, keyCode}) => (key == " "))
    .subscribe(({ transformX, transformY, shipRotation }) => {
      const rotationRadians = shipRotation * (Math.PI / 180)

      // create bullets
      let bulletShot = new Elem(svg, 'circle')
        .attr("style", "fill:#ffffff;stroke:#ffffff;stroke-width:2")
        .attr("cx", transformX) // follow where the arrow is
        .attr("cy", transformY)
        .attr("r", 3)
        .attr("bulletDistanceX", Math.cos(rotationRadians - (90 * (Math.PI / 180))) * 1)
        .attr("bulletDistanceY", Math.sin(rotationRadians - (90 * (Math.PI / 180))) * 1)

      // push bullet into array
      arrayOfBullets.push(bulletShot)

    })

  /*
  LOGIC FOR REMOVING BULLETS THAT ARE OFFSCREEN FROM ARRAY
  */
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

  /* 
  Checks for collisions between the bullet and the asteroid by checking whether the line distance is less
  then the sum of the radii
  */
  function checkBulletCollision(x1: number, x2: number, y1: number, y2: number, radius1: number, radius2: number) {
    return Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))) <= (radius1 + radius2)
  }

  /* 
  Checks whether the ship has collided with the asteroid by checking whether the line disttance is less than the sum
  of the radii (in this case, for the ship, we get getBBox element to get the height and width of the SVG element ship)
  */
  function checkShipCollision(x1: number, x2: number, y1: number, y2: number, radius1: number, radius2: number, shipTransformX: number, shipTransformY: number, shipRotation: number) {
    let lineOfDistance = Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))),
        sumOfRadii     = (radius1 + radius2)

    // if it has colliided, then move the ship to the middle of the screen againi and update lives
    if (lineOfDistance <= sumOfRadii) {
      g.attr("transform", `translate(300 300) rotate(300)`)
      --lives
      updateHTMLElements(myScore, lives, bomb)
      return true
    }
    return false
  }
  
  /* LOGIC FOR RANDOM ASTEROID MOVEMENT 
    Used to get a random integer for asteroid positions.
    This was inspired by: https:   //stackoverflow.com/questions/52015418/random-movement-angular
  */
  function getRandomInt(min: number, max: number) {
    return (Math.random() + min) * Math.floor(max);
  }

  /* 
  LOGIC FOR MOVING THE ASTEROIDS RANDOMLY
  */
  mainAsteroidsObservable.subscribe(({ asteroidArray }) => {
    asteroidArray.forEach((asteroid) => {
      asteroid
        .attr("cx", Number(asteroid.attr("directionX")) + Number(asteroid.attr("cx")))
        .attr("cy", Number(asteroid.attr("directionY")) + Number(asteroid.attr("cy")))
    }
    )
  })

  /*
  LOGIC TO CREATE THE ASTEROIDS AND PUT IT INTO AN ARRAY
  This creates all the asteroids at the beginning of the game and pushes them into an asteroid array
  so that we can do operations on them later. This needed to be stopped after a certain amount of time
  so an asteroidObservable was made with an interval. Thiis interval then emits values to stop the
  main observable after a certain amount of time (i.e. set by timer).
  */
 mainAsteroidsObservable
    .takeUntil(asteroidObservable.filter(timer => timer == 8)) // this part taken from Harsil's code
    .subscribe((e) => {
      // create random starting points
      let asteroidRandomX = getRandomInt(0, 600),
          asteroidRandomY = getRandomInt(0, 600)

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

  /*
    LOGIC FOR ASTEROID RESPAWNING AFTER BOMB
    This relies on the main game observable to constantly check whether the asteroid array is empty.
    When the asteroid array is empty, a bomb has been used and asteroids need to respawn. 
    This is done by setting intervals withiin the observable (stopped by another interval) and creating
    asteroiids (using SVG elements), which are then pushed into the asteroid array.
  */
    mainAsteroidsObservable
    .filter(({asteroidArray}) => asteroidArray.length == 0) // only runs when asteroid array is empty
    .subscribe((e) => {

      // create interval for respawning
      Observable.interval(10)
      .takeUntil(Observable.interval(15))
      .map(() => {
        let asteroidRandomX = getRandomInt(0, 600),
            asteroidRandomY = getRandomInt(0, 600)

        // create asteriod svg
        const asteroid = new Elem(svg, "circle")
        .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
        .attr("cx", asteroidRandomX) // follow where the arrow is
        .attr("cy", asteroidRandomY)
        .attr("r", 30)
        .attr("splitCounter", 3)
        .attr("directionX", getRandomInt(-1, 1))
        .attr("directionY", getRandomInt(-1, 1))

        // push asteroid into array
        arrayOfAsteroids.push(asteroid)
      }).subscribe(() => console.log
    )})

/* 
LOGIC TO SPLIT THE ASTEROIDS
This splits the asteroids into 2. It checks a splitCounter, which is the attribute on the asteroid. 
If splitCounter is not 0, then it can still split, otherwise, it should just be destroyed.
*/
  function splitAsteroid(asteroid, asteroidX: number, asteroidY: number, asteroidRadius: number, asteroidSplitCounter: number) {

    // if split counter not equal to 0, then split it into 2 asteroids (with an offset for x and y coordinates)
    if (asteroid.attr("splitCounter") != 0) {
      let asteroidChildrenOffset = 20,
          asteroidNewRadius      = 10

      let asteroid1 = new Elem(svg, "circle")
        .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
        .attr("cx", asteroidX + asteroidChildrenOffset)
        .attr("cy", asteroidY + asteroidChildrenOffset)
        .attr("r", asteroidRadius - asteroidNewRadius)
        .attr("splitCounter", asteroidSplitCounter = asteroidSplitCounter - 1) // decrement split counter so we know whether to split or not
        .attr("directionX", getRandomInt(-1, 1))
        .attr("directionY", getRandomInt(-1, 1))

      arrayOfAsteroids.push(asteroid1)

      let asteroid2 = new Elem(svg, "circle")
        .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
        .attr("cx", asteroidX - asteroidChildrenOffset)
        .attr("cy", asteroidY - asteroidChildrenOffset)
        .attr("r", asteroidRadius - asteroidNewRadius)
        .attr("splitCounter", asteroidSplitCounter = asteroidSplitCounter - 1)
        .attr("directionX", getRandomInt(-1, 1))
        .attr("directionY", getRandomInt(-1, 1))

      arrayOfAsteroids.push(asteroid2)
    }
  }

  /* 
  LOGIC FOR BULLET AND ASTEROID COLLISIONS 
  This removes bullets and asteroids when bullets collide with asteroids.
  */
  mainAsteroidsObservable.map(({ bulletArray, asteroidArray, shipTransformX, shipTransformY, shipRotation}) => {
    
    // go through the asteroids and check it with each bullet 
    asteroidArray.forEach((asteroid) => {
      bulletArray.filter((bullet) => (
        checkBulletCollision(Number(asteroid.attr("cx")), Number(bullet.attr("cx")), Number(asteroid.attr("cy")), Number(bullet.attr("cy")), Number(bullet.attr("r")), Number(asteroid.attr("r")), shipTransformX, shipTransformY, shipRotation)
      ))
        .forEach((bullet) => {

          // remove bullets from the array and remove the canvas element
          bullet.elem.remove()
          arrayOfBullets.splice(arrayOfBullets.indexOf(bullet), 1)

          // increase score by 10 for each collision
          myScore += scoreIncrease
          updateHTMLElements(myScore, lives, bomb)

          // split asteroids into new asteroids here
          splitAsteroid(asteroid, parseFloat(asteroid.attr("cx")), parseFloat(asteroid.attr("cy")), parseFloat(asteroid.attr("r")), parseFloat(asteroid.attr("splitCounter")))
          
          // remove asteroids from the array and remove the canvas element
          asteroid.elem.remove()
          arrayOfAsteroids.splice(arrayOfAsteroids.indexOf(asteroid), 1)
        })
    })
  }).subscribe(() => console.log)

  /*
  LOGIC THAT WRAPS THE SHIP
  This ensures that if the ship goes offscreen, then it wraps to the other side of the screen. 
  */
  const shipWrappingState = mainAsteroidsObservable
    .map(({ ship, shipTransformX, shipTransformY, shipRotation }) =>
      ({
        shipTransformX,
        shipTransformY,
        ship
      }))

  // if ship goes out of right hand side of the screen
  shipWrappingState
    .filter(({ shipTransformX }) => (shipTransformX >= 600))
    .subscribe(() => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)

      g.attr("transform", `translate(${transformX = 10} ${transformY}) rotate(${shipRotation})`)
    })

  // if ship goes out of left hand side of the screen
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


  /*
  LOGIC FOR ASTEROIDS WRAPPING AROUND THE SCREEN
  This ensures that when an asteroids moves off the screen, it comes back onscreen via the other side.
  */

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

  /*
  LOGIC FOR SPACESHIP COLLIDING WITH ASTEROID
  */
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
    showGameOver()
  })
  ).subscribe(() => console.log)


  /*
  LOGIC FOR REMOVING CIRCLE CANVAS ELEMENTS (ASTEROIDS)
  When the bomb clears the asteroid array, the asteroid's canvas elements are removed using the following
  function. It uses getElementsByTagName to grab the circle element, return a NodeList that is then converted
  into an array. This is then removed from the HTML.

  Code iinspired by: 
       https       :   //stackoverflow.com/questions/20044252/remove-all-the-dom-elements-with-a-specific-tag-name-in-javascript
  */
  function removeCircleCanvas() {
    // turn NodeList into an array first
    Array.prototype.slice.call(document.getElementsByTagName("circle")).forEach(
      function(item) {
        item.remove();
    });
  }

/* 
LOGIC FOR USING BOMB POWERUP
*/
  keydown$.map(({ keyCode, repeat }) => {
    return ({
      keyCode,
      spaceship: g,
      repeat
    })
  }).filter(({ keyCode, repeat}) => (keyCode == 80 && repeat == false && bomb != 0)) // if this is first ttime key is pressed and there are still bombs left
    .map(() => {
      return (
        arrayOfAsteroids
      )     
    })
    .forEach((arrayOfAsteroids) =>  {
      arrayOfAsteroids.splice(0, arrayOfAsteroids.length) // clear the asteroid array
      removeCircleCanvas() // remove the asteroids from canvas

      Observable.interval(15) // set interval for the explosion SVG element to appear
      .takeUntil(Observable.interval(200))
      .map(() => {

        const explosion = new Elem(svg, 'circle')
        .attr("style", "fill:#ea3e58;stroke:#ea3e58;stroke-width:2")
        .attr("fill-opacity", 0.1)
        .attr("opacity", 0.2)
        .attr("cx", 300)
        .attr("cy", 300)
        .attr("r", 350)
        
        // makes the SVG explosion element disappear after a
        // certain amount of time  
        Observable.interval(100)
        .takeUntil(Observable.interval(150))
        .map(() => {
          explosion.elem.remove()
        }).subscribe(_ => console.log)
      }).subscribe(_ => console.log)
    }).subscribe((arrayOfAsteroids) => {
      //update bomb since it has been used
      bomb--
      updateHTMLElements(myScore, lives, bomb)
    })

  /* 
  Impure function that is used to update the score, lives and bomb onto the screen
  */
  function updateHTMLElements(score: number, lives: number, bomb: number) {
    document.getElementById("score")!.innerHTML = "Score: " + score
    document.getElementById("lives")!.innerHTML = "Lives: " + lives
    document.getElementById("bomb")!.innerHTML  = "Bomb: " + bomb
  }

  function showGameOver() {
    // game is now complete
    gameComplete = true;
    // ship has died so turn it red
    ship.attr("style", "fill:#FF0000;stroke:purple;stroke-width:1");
    
    // show the game over text on screen
    let label = new Elem(svg, 'text')
      .attr('x', 150)
      .attr('y', 300)
      .attr('fill', '#1772a4')
      .attr('font-family', "Courier New")
      .attr('font-size', 50)
      .attr("id", "gameOver")

    document.getElementById("gameOver")!.innerHTML = "GAME OVER"
  }
}

// the following simply runs your asteroids function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = () => {
    asteroids();
  }