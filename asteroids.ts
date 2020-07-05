// FIT2102 2019 Assignment 1
// Name: April Yu En Chi 
// Student Number: 26951460
// Tutorial: Wednesday 8am
// Tutor: Alina Bhari & Jason Nguyen
// https://docs.google.com/document/d/1Gr-M6LTU-tfm4yabqZWJYg-zTjEVqHKKTCvePGCYsUA/edit?usp=sharing

function asteroids() {
  // Inside this function you will use the classes and functions 
  // defined in svgelement.ts and observable.ts
  // to add visuals to the svg element in index.html, animate them, and make them interactive.
  // Study and complete the Observable tasks in the week 4 tutorial worksheet first to get ideas.

  // You will be marked on your functional programming style
  // as well as the functionality that you implement.
  // Document your code!  
  // Explain which ideas you have used ideas from the lectures to 
  // create reusable, generic functions.

  // April Yu En Chii 26951460

  /* 
  QUICK OVERVIEW                                                                                         : 
  -     Basis of the assignment code was inspired by the example game Tim Dwyer posted onto Moodle forums: 
        https                                                                                            :   //github.com/harsilspatel/pong-breakout/blob/master/src/pong.ts
        https                                                                                            :   //github.com/harsilspatel/pong-breakout/blob/master/src/breakout.ts
        The concept of a main game observable that handles everything was inspired from here along with the access of objects.
  The full game has been implemented including the presence fo random asteroids, bullet and asteroid collision detection,
  ship and asteroid collision detection (player loses liife when this happens) and screen wrapping. 

  EXTRA FEATURES ADDED: 
  - Score that increments when you shoot asteroids - each asteroid is worth 1 point.
  - Lives that decrement when your ship hits an asteroid - you have 3 lives.
  - Bomb feature that clears your screen for a moment and replaces asteroids with smaller asteroids (used when you are overwhelmed by asteroids).
    This bomb feature can be used up to 3 times.
  - Thrust when ship moves forward

  This game largely uses the mainAsteroidObservable as the main game observable that ticks through the game and checks
  constanly for changes. It stops when the game is complete, thereby ending the game. Note that throughout the code,
  I have stated where the code has been impure. Any impurities have been limited to just the subscribes (limiting the side effects).

  If this game were to be more pure, the bullet and asteroid arrays would need to be states and there would need to be
  an update game state that simply updates the game all at once. 

  Note that the observables have been placed into functions. This was inspired by observableexamples.ts.
  */

  // save global variables so you can make objects and reference them later in observables
  let            arrayOfAsteroids: Elem[] = [],      // array of asteroids
  arrayOfBullets : Elem[]                 = [],      // array of bulletts
  myScore        : number[]               = [1,1],   // my score is incremented using scan
  lives          : number                 = 3,
  bomb           : number                 = 3,
  gameComplete   : boolean                = false

  // Information was saved as objects in the main game observable so we can access it without having to directly grab the global variables
  // This method was chosen because it is more pure and you are able to grab references to variables without sacrificing purity
  // This is more pure than simply accessing it from global variables
  const mainTimer               = Observable.interval(5),   // main timer that emits observable to stop main game when game is complette
        asteroidObservable      = Observable.interval(1),   // this is used to set when to stop the spawning of the asteroids at the beginning of the game 
        mainAsteroidsObservable = mainTimer                 // this is the main game observable that consatntly checks throughout the game for changes - this ensures everything in the game is on the same timeline
    .takeUntil(
      mainTimer.filter(_ => gameComplete == true) // end game once game complete variable is true
    ).map(_ => ({ // save information here as objects so we can access them
      bulletArray   : arrayOfBullets,
      asteroidArray : arrayOfAsteroids,
      ship          : g,
      shipTransformX: Number(g.elem.transform.baseVal.getItem(0).matrix.e),
      shipTransformY: Number(g.elem.transform.baseVal.getItem(0).matrix.f),
      shipRotation  : Number(g.elem.transform.baseVal.getItem(1).angle)
    })),

  const svg = document.getElementById("canvas")!,
  
  const g = new Elem(svg, 'g')
    .attr("transform", "translate(300 300) rotate(170)")

  const ship = new Elem(svg, 'polygon', g.elem)
    .attr("points", "-15,20 0,15 15,20 0, -20")
    .attr("style", "fill:#171846;stroke:#ffffff ;stroke-width:2")

  // get the width / height of the polygon element g - this is used to get the exact width of the ship SVG for collision checking
  let polygonTag  = document.querySelector("polygon"),
      polygonBBox = polygonTag!.getBBox()
  
  /* 
  @ keydown observable
  Creates new observable that emits an event object everytime a keydown is fired
  we define the objects in this observable that we need so we can access them below when we start
  defining ship movements based on keys and keycodes
  This method is more pure than simply grabbing global variables from outside the scope
  */
  const keydown$ = Observable.fromEvent<KeyboardEvent>(document, 'keydown').map(({keyCode, key, repeat}) => ({
    asteroidArray: arrayOfAsteroids,
    keyCode,
    key,
    repeat
  })),
  keyup$ = Observable.fromEvent<KeyboardEvent>(document, 'keyup');


  /* 
  LOGIC FOR SHIP MOVEMENT (ROTATING AND MOVING FORWARD)
  Note: Setting the attributes is an impure way of doing things as it causes side effects.
  The attributes are set for moving the ship's coordinates. Due to their impure nature, they have been limited
  to inside the subscribes.
  */

  function shipPosObservable () {
  // moving ship to the right
  keydown$
  .map(({ key }) => {
    return ({
      key
    })
  }).filter(({ key }) => (key == "ArrowRight"))
    .flatMap((key) => ( // flatmap it because we are creating more values than we originally had
      Observable.interval(15) // continue firing observable and rotating until key goes up
        .takeUntil(keyup$)
    ))
    .subscribe(_ => {
      // grab the ship's current coordinates
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)
      
      // increment rotation by 10 - this is impure since it causes a side effect
      g.attr("transform", `translate(${transformX} ${transformY}) rotate(${shipRotation = shipRotation + 10})`)
    })

  // moving ship to the left
  keydown$
  .map(({ key }) => {
    return ({
      key
    })
  }).filter(({ key}) => (key == "ArrowLeft")) 
    .flatMap((key) => ( // flatmap it because we are creating more values than we originally had
      Observable.interval(15) // continue firing observable and rotating until key goes up
        .takeUntil(keyup$)
    ))
    .subscribe(_ => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)
          
      // this is impure since it causes a side effect
      g.attr("transform", `translate(${transformX} ${transformY}) rotate(${shipRotation = shipRotation - 10})`)
    })

  // moving ship forward with thrust
  keydown$
  .map(({ key, keyCode }) => {
    return ({
      key         : key,
      transformX  : Number(g.elem.transform.baseVal.getItem(0).matrix.e),
      transformY  : Number(g.elem.transform.baseVal.getItem(0).matrix.f),
      shipRotation: Number(g.elem.transform.baseVal.getItem(1).angle)
    })
  }).filter(({ key, transformX, transformY, shipRotation, keyCode }) => (key == "ArrowUp" || keyCode == 87))
    .map(({ key, transformX, transformY, shipRotation }) => ({
      // create new velocity direction
      directionX: Math.cos(Math.PI * (shipRotation - 90) / 180),
      directionY: Math.sin(Math.PI * (shipRotation - 90) / 180)
    }))
    .flatMap(({ directionX, directionY }) => // this part implements the thrust
      Observable.interval(30) // decreases the movement each time in the interval
        .map(thrust => ({
          newX: 300 * directionX / thrust,
          newY: 300 * directionY / thrust
        })))
    .subscribe(({ newX, newY }) => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)

       // this is impure since it causes a side effect
      g.attr("transform", `translate(${transformX = transformX + newX} ${transformY = transformY + newY}) rotate(${shipRotation})`)
    })

  /*  
  LOGIC FOR CREATING THE BULLETS 
  This observable creates bullets and pushes them into an array so that the main game observable can constantly check it
  and move it.
  */
  keydown$
    .map(({ key }) => ({
      key,
      transformX  : Number(g.elem.transform.baseVal.getItem(0).matrix.e),
      transformY  : Number(g.elem.transform.baseVal.getItem(0).matrix.f),
      shipRotation: Number(g.elem.transform.baseVal.getItem(1).angle),
    }))
    .filter(({ key }) => (key == " ")) // filter it for space key
    .subscribe(({ transformX, transformY, shipRotation }) => {
      const rotationRadians = shipRotation * (Math.PI / 180),
            bullCalculateX  = Math.cos(rotationRadians - (90 * (Math.PI / 180))) * 1,   // trigonometry calculations ensure bullets shoot from tip of ship (a triangle)
            bullCalculateY  = Math.sin(rotationRadians - (90 * (Math.PI / 180))) * 1

      // create bullets
      let bulletShot = new Elem(svg, 'circle')
        .attr("style", "fill:#ffffff;stroke:#ffffff;stroke-width:2")
        .attr("cx", transformX) // follow where the arrow is
        .attr("cy", transformY)
        .attr("r", 3)
        .attr("bulletDistanceX", bullCalculateX)
        .attr("bulletDistanceY", bullCalculateY)

      // pushing bullet into array is impure because it alters the array itself
      arrayOfBullets.push(bulletShot)

    })

  }

  /*
  LOGIC FOR MOVING BULLETS AND REMOVING BULLETS THAT ARE OFFSCREEN FROM ARRAY
  This uses the main game observable to constantly check whether there are bullets in the bullet array. 
  If there are bullets in the bullet array, it moves them and also checks whether they are onscreen via filter.
  If they are are offscreen, then they are removed from the bullet array in an impure manner.
  
  The pure way would be to not mutate the array and and turning it into a state instead.  
  */

  function bulletMovementObservable() {
    mainAsteroidsObservable.subscribe(({ bulletArray }) => {
      bulletArray
        .map((bullet) =>
        bullet
        .attr("cx", Number(bullet.attr("cx")) + Number(bullet.attr("bulletDistanceX"))) // go through each bullet and add an X distance to move it
        .attr("cy", Number(bullet.attr("cy")) + Number(bullet.attr("bulletDistanceY")))) // go through each bullet and add a Y distance to move it
        .filter((bull) => (Number(bull.attr("cx")) >= 600) || Number(bull.attr("cy")) >= 600 || Number(bull.attr("cy")) <= 0 || Number(bull.attr("cx")) <= 0) // remove the bullets if offscreen by filtering
        .forEach((bull) => {
          // if offscreen, remove its canvas element
          bull.elem.remove() 
  
          // this method of splicing and removing directly from the global array is impure as it directly mutates the list
          arrayOfBullets.splice(arrayOfBullets.indexOf(bull), 1) // if offscreen, remove bullet from array so we don't move it anymore
        })
    })
  }

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
        radiiSum       = radius1 + radius2

    // if it has colliided, then move the ship to the middle of the screen again and update lives
    if (lineOfDistance <= radiiSum) {
      // this is an impure method as it simply sets the attribute of the ship itself
      g.attr("transform", `translate(300 300) rotate(300)`) // manually move ship to middle of screen again
      
      // decrement lives is impure, as it directly changes the lives variable. This can be changed to a more
      // pure method via scan
      lives--
      // update html is an impure function - it prints elements onto the screen
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
  Note that this method of moving asteroids randomly by setting their attributes is impure. 
  This mutates the attributes itself and causes a side effect. For this reason, it has been placed
  inside a subscribe to limit side effects.

  Note: impurities have been limited to the subscribe
  */

  function asteroidMovementObservable() {
    mainAsteroidsObservable.subscribe(({ asteroidArray }) => {
      asteroidArray.forEach((asteroid) => { // go through every asteroid in the asteroid array and set its movement
        asteroid
          .attr("cx", Number(asteroid.attr("directionX")) + Number(asteroid.attr("cx"))) // set x to random direction + current x coordinate to get it moving randomly
          .attr("cy", Number(asteroid.attr("directionY")) + Number(asteroid.attr("cy"))) // set y to random direction + current y coordinate to get it moving randomly
      })
    })
  }

  /*
  LOGIC TO CREATE THE ASTEROIDS AND PUT IT INTO AN ARRAY
  This creates all the asteroids at the beginning of the game and pushes them into an asteroid array
  so that we can do operations on them later. This needed to be stopped after a certain amount of time
  so an asteroidObservable was made with an interval. Thiis interval then emits values to stop the
  main observable after a certain amount of time (i.e. set by timer).

  Note: impurities have been limited to the subscribe
  */

  function asteroidCreationObservable() {
    mainAsteroidsObservable
    .takeUntil(asteroidObservable.filter(timer => timer == 8)) // stop making asteroids after 8 milliseconds, inspired by Harsil's game example that Tim Dwyer posted
    .subscribe(_ => {
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
        .attr("id", "circleShape") // this is used to remove it later from html
        
      // push asteroid into array - this is impure as it causes a side effect by mutating the array directly
      arrayOfAsteroids.push(asteroid)
    })
  }


  /*
  LOGIC FOR ASTEROID RESPAWNING AFTER BOMB
  This relies on the main game observable to constantly check whether the asteroid array is empty.
  When the asteroid array is empty, a bomb has been used and asteroids need to respawn. 
  This is done by setting intervals withiin the observable (stopped by another interval) and creating
  asteroiids (using SVG elements), which are then pushed into the asteroid array.

  Note: impurities have been limited to the subscribe
  */

  function asteroidRespawnObservable() {
    mainAsteroidsObservable
    .filter(({asteroidArray}) => asteroidArray.length == 0) // only runs when asteroid array is empty
    .subscribe(({}) => {

      // create interval for respawning
      Observable.interval(10)
      .takeUntil(Observable.interval(15)) // emitting this observable stops the original observable from creating asteroids
      .map(() => {
        let asteroidRandomX  = getRandomInt(0, 600),
            asteroidRandomY  = getRandomInt(0, 600),
            randomDirectionX = getRandomInt(-1, 1),
            randomDirectionY = getRandomInt(-1, 1)

        // create asteriod svg
        const asteroid = new Elem(svg, "circle")
        .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
        .attr("cx", asteroidRandomX) // set to random position
        .attr("cy", asteroidRandomY)
        .attr("r", 30)
        .attr("splitCounter", 3) // keeps track of whether we should still split it if hit
        .attr("directionX",  randomDirectionX) // set asteroid to go randoom direction
        .attr("directionY", randomDirectionY)

         // push asteroid into array - this is impure as it causes a side effect by mutating the array directly
        arrayOfAsteroids.push(asteroid)

      }).subscribe(_ => {})})
  }

/* 
LOGIC TO SPLIT THE ASTEROIDS
This splits the asteroids into 2. It checks a splitCounter, which is the attribute on the asteroid. 
If splitCounter is not 0, then it can still split, otherwise, it should just be destroyed.
*/
  function splitAsteroid(asteroid: Elem, asteroidX: number, asteroidY: number, asteroidRadius: number, asteroidSplitCounter: number) {
    
    // if split counter not equal to 0, then split it into 2 asteroids (with an offset for x and y coordinates)
    // This code is impure as we are setting the attributes and mutating the code. 
    // Furthermore, it is also not the most functional way as it has an if statement. 
    // If this were functional, we would ideally save the asteroid that collided, and filter for the split
    // counter to know whether to destroy it or split it. 
    if (asteroid.attr("splitCounter") != 0) {
      let asteroidChildrenOffset = 20,
          asteroidNewRadius      = 10,
          randomDirectionX       = getRandomInt(-1, 1),
          randomDirectionY       = getRandomInt(-1, 1)

      let asteroid1 = new Elem(svg, "circle")
        .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
        .attr("cx", asteroidX + asteroidChildrenOffset)
        .attr("cy", asteroidY + asteroidChildrenOffset)
        .attr("r", asteroidRadius - asteroidNewRadius)
        .attr("splitCounter", asteroidSplitCounter = asteroidSplitCounter - 1) // decrement split counter so we know whether to split or not
        .attr("directionX", randomDirectionX)
        .attr("directionY", randomDirectionY)

      // push asteriod back into array so it can move and be checked for offscreen
      // this is impure as it directly mutates the array
      arrayOfAsteroids.push(asteroid1)

      let asteroid2 = new Elem(svg, "circle")
        .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
        .attr("cx", asteroidX - asteroidChildrenOffset)
        .attr("cy", asteroidY - asteroidChildrenOffset)
        .attr("r", asteroidRadius - asteroidNewRadius)
        .attr("splitCounter", asteroidSplitCounter = asteroidSplitCounter - 1)
        .attr("directionX", randomDirectionX)
        .attr("directionY", randomDirectionY)

        
      // push asteriod back into array so it can move and be checked for offscreen
      // this is impure as it directly mutates the array
      arrayOfAsteroids.push(asteroid2)
    }
  }

  /* 
  LOGIC FOR BULLET AND ASTEROID COLLISIONS 
  This removes bullets and asteroids when bullets collide with asteroids.
  Note that the use of scan was inspired by the sample code from ReactiveX: 
       http                                                               :   //reactivex.io/documentation/operators/scan.html?source=post_page-----859eb2c4508b----------------------

  Everytime the player manages to shoot an asteroid, their score increases by 1. Rather than simply decrement the global variable,
  I attempted to do this in a more functional manner by using scan. This was inspired by our lab in observableexamples.ts.
  Since we cannot simply scan a number, the score has been turned into an array, which is then turned into an observable. 
  The seed is set to 0 and 1 is added each time as the new score is updated. 
  */

  function asteroidBulletCollisionObservable() {
    mainAsteroidsObservable
    .map(({ bulletArray, asteroidArray, shipTransformX, shipTransformY, shipRotation}) => {

    // go through the asteroids and check it with each bullet 
    // Note that this is an impure way of doing this since you are essentially sharing states from 2 different arrays.
    // The pure way of doing this would be having a state for each of these arrays and then appending each new asteroid 
    // / new bullet to the end to create a new copy.
    // There would then be an updateGameState observable that updates the game and the collisions would be everything
    // that overlaps.
    asteroidArray.forEach((asteroid) => { // go through asteroids 
      bulletArray.filter((bullet) => ( // and then filter for bullets that collide
        checkBulletCollision(Number(asteroid.attr("cx")), Number(bullet.attr("cx")), Number(asteroid.attr("cy")), Number(bullet.attr("cy")), Number(bullet.attr("r")), Number(asteroid.attr("r")), shipTransformX, shipTransformY, shipRotation)
      ))
        .forEach((bullet) => {

          // remove bullets from the array and remove the canvas element
          bullet.elem.remove()
          // this is impure as it directly mutates the global variable
          arrayOfBullets.splice(arrayOfBullets.indexOf(bullet), 1)

          // increase score by 1 for each collision - scan is used here to attempt to do this in a more pure way rather than
          // simply decrementing the lives
          let scoreAccumulator = Observable.fromArray(myScore)
          .scan(0, function (acc, x) {
            return acc + x;
          }).subscribe(
            // this is impure as it changes the score array (used to make our scan work). This impurity has been
            // limited to the subscribe 
            function (x) { myScore = [x, 1]} // store the new value into first part of array and keep accumulating 1
          )
          
          // update score html -- this is impure as it prints / shows image to the screen
          updateHTMLElements(myScore, lives, bomb)

          // split asteroids into new asteroids here by passing through coordinates
          splitAsteroid(asteroid, Number(asteroid.attr("cx")), Number(asteroid.attr("cy")), Number(asteroid.attr("r")),
          Number(asteroid.attr("splitCounter")))
      
          // remove asteroids from the array and remove the canvas element
          // this is impure as it removes canvas element from screen and also directly mutates the array of asteroids
          asteroid.elem.remove()
          arrayOfAsteroids.splice(arrayOfAsteroids.indexOf(asteroid), 1)
        })
    })
  }).subscribe(_ => {})
  }
  
  /*
  LOGIC THAT WRAPS THE SHIP
  This ensures that if the ship goes offscreen, then it wraps to the other side of the screen. 

   Note: setting the attributes is an impure way of doing things as it causes side effects.
  Attributes are set for moving the ship's coordinates. Due to their impure nature, they have been limited
  to inside the subscribes.
  */

  // save the state here so we can do multiple filters for different parts of the screen
  // this was inspired by the mousePosObservable function that was seen in observableexamples.ts
  // in tutorial 4

  function shipWrappingObservable() {
    const shipWrappingState = mainAsteroidsObservable
    .map(({ ship, shipTransformX, shipTransformY, shipRotation }) => // use this to access ship x, y and rotation
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
      // setting the attribute here is impure
      g.attr("transform", `translate(${transformX = 10} ${transformY}) rotate(${shipRotation})`)
    })

  // if ship goes out of left hand side of the screen
  shipWrappingState
    .filter(({ shipTransformX }) => (shipTransformX <= 0))
    .subscribe(() => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)
          // setting the attribute here is impure
      g.attr("transform", `translate(${transformX = 600} ${transformY}) rotate(${shipRotation})`)
    })

  // if ship leaves top of screen
  shipWrappingState
    .filter(({ shipTransformY }) => (shipTransformY >= 600))
    .subscribe(() => {
      let transformX   = Number(g.elem.transform.baseVal.getItem(0).matrix.e),
          transformY   = Number(g.elem.transform.baseVal.getItem(0).matrix.f),
          shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle)
          // setting the attribute here is impure
      g.attr("transform", `translate(${transformX} ${transformY = 10}) rotate(${shipRotation})`)
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

  }
  

  /*
  LOGIC FOR ASTEROIDS WRAPPING AROUND THE SCREEN
  This ensures that when an asteroids moves off the screen, it comes back onscreen via the other side.

  Here, we iterate through each asteroid in the array and check whether it is greater or equal to the size of the screen. This filter returns the elements that are true for this
  and then set it.
  */

  function asteroidWrappingObservable() {
        // save the asteroid wrapping as a state
      let asteroidWrappingState = 
      mainAsteroidsObservable.map(({ asteroidArray }) => {
        return asteroidArray // get the array itself
      })

    // going out of right screen
    asteroidWrappingState.forEach((asteroid) => asteroid
      .filter((asteroid) => Number(asteroid.attr("cx")) >= 650)
      .map((asteroid) => asteroid.attr("cx", 0))
    ).subscribe(_ => {})

    // // going out of top screen
    asteroidWrappingState.forEach((asteroid) => asteroid
      .filter((asteroid) => Number(asteroid.attr("cy")) >= 650)
      .map((asteroid) => asteroid.attr("cy", 0))
    ).subscribe(() => {})

    // // going out of left screen
    asteroidWrappingState.forEach((asteroid) => asteroid.
      filter((asteroid) => Number(asteroid.attr("cx")) <= -50)
      .map((asteroid) => asteroid.attr("cx", 600))
    ).subscribe(() => {})

    // // going out of bottom screen
    asteroidWrappingState.forEach((asteroid) => asteroid
      .filter((asteroid) => parseFloat(asteroid.attr("cy")) <= -50)
      .map((asteroid) => asteroid.attr("cy", 600))
    ).subscribe(() => {})

  }
  
  /*
  LOGIC FOR SPACESHIP COLLIDING WITH ASTEROID
  This checks whether the ship has collided with the asteroid by iterating through the asteroid array and checking
  whether any asteroid's coordinates are within the vicinity of the ship (using line distance <= sum of radii).
  Colliding with an asteroid means that the player loses one of their 3 lives. When a ship collides with an asteroid,
  its position is set back to the middle of the screen (otherwise its lives will decrement infinitely). 
  However, if they get hit in the middle of the screen, they will die immediately! This is because they will be set back
  to the middle, hence the collision will continue. This can be countered by setting an observable to make them invincible at the
  beginning of each reset or game. 
  */

  function shipCollidingAsteroidObservable() {
    mainAsteroidsObservable.map(({ asteroidArray, shipTransformX, shipTransformY }) => {
      return ({
        asteroidArray : asteroidArray,
        shipTransformX: shipTransformX,
        shipTransformY: shipTransformY
      })
    }).forEach(({ asteroidArray, shipTransformX, shipTransformY, shipRotation }) => // going through asteroid array
      asteroidArray
        .filter((asteroid) => // if asteroid has collided with ship, then call functon to split or destroy asteroid
          checkShipCollision(Number(shipTransformX), Number(asteroid.attr("cx")), Number(shipTransformY), Number(asteroid.attr("cy")), Number(asteroid.attr("r")), Number(polygonBBox.width - 15), shipTransformX, shipTransformY, shipRotation))
      .map(() => {
        return lives // retturn lives so we can check it
    }).filter((lives) => (lives == 0)) // if lives is 0, then show game over
      .map(() => {
        // game is over, show game over HTMl element
        showGameOver()
    })
    ).subscribe(_ => {})
  }

  /*
  LOGIC FOR REMOVING CIRCLE CANVAS ELEMENTS (ASTEROIDS)
  When the bomb clears the asteroid array, the asteroid's canvas elements are removed using the following
  function. It uses getElementsByTagName to grab the circle element, return a NodeList that is then converted
  into an array. This is then removed from the HTML.

  This function is impure as it removes canvas elements.

  Code inspired by: 
       https      :   //stackoverflow.com/questions/20044252/remove-all-the-dom-elements-with-a-specific-tag-name-in-javascript
  */
  function removeCircleCanvas() {
    // turn NodeList into an array first
    Array.prototype.slice.call(document.getElementsByTagName("circle")).forEach(
      function(item) { // remove the item now from the new array
        item.remove();
    });
  }

/* 
LOGIC FOR USING BOMB POWERUP
Use this bomb feature to clear the asteroids and then replace it with new smaller asteroids 
by pressing the 'P' key.
*/

function bombPowerupObservable() {

  keydown$.map(({ keyCode, repeat }) => {
    return ({
      keyCode,
      repeat
    })
  }).filter(({ keyCode, repeat}) => (keyCode == 80 && repeat == false && bomb != 0)) // if this is first time key is pressed and there are still bombs left
    .map(() => {
      return (
        arrayOfAsteroids // return this so we can access it to check
      )     
    })
    .forEach((arrayOfAsteroids) =>  {
      arrayOfAsteroids.splice(0, arrayOfAsteroids.length) // clear the asteroid array
      removeCircleCanvas() // remove the asteroids from canvas

      Observable.interval(15) // set interval for the explosion SVG element to appear
      .takeUntil(Observable.interval(200)) // this new observable stops it after 200 milliseconds
      .map(() => {

        // explosion element
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
          explosion.elem.remove() // remove explosion canvas
        }).subscribe(_ => {})
      }).subscribe(_ => {})
    }).subscribe(_ => {
      
      //update bomb since it has been used - this is impure
      bomb--
      updateHTMLElements(myScore, lives, bomb)
    })
}
  
  /* 
  Impure function that is used to update the score, lives and bomb onto the screen
  */
  function updateHTMLElements(score: number[], lives: number, bomb: number) {
    document.getElementById("score")!.innerHTML = "Score: " + score[0]
    document.getElementById("lives")!.innerHTML = "Lives: " + lives
    document.getElementById("bomb")!.innerHTML  = "Bomb: " + bomb
  }

   /* 
  Impure function that is used to show the game over text element
  */
  function showGameOver() {
    // game is now complete
    gameComplete = true;
    // ship has died so turn it red
    ship.attr("style", "fill:#FF0000;stroke:purple;stroke-width:1");
    
    // show the game over text on screen
    const gameOverText = new Elem(svg, 'text')
      .attr('x', 150)
      .attr('y', 300)
      .attr('fill', '#ffffff')
      .attr('font-family', "monospace")
      .attr('font-size', 50)
      .attr("id", "gameOver")

      const scoreText = new Elem(svg, 'text')
      .attr('x', 220)
      .attr('y', 360)
      .attr('fill', '#ffffff')
      .attr('font-family', "monospace")
      .attr('font-size', 20)
      .attr("id", "showScore")

    document.getElementById("gameOver")!.innerHTML  = "GAME OVER"
    document.getElementById("showScore")!.innerHTML = "YOUR SCORE: " + myScore[0]
  }

  // All observables made have been placed into functions as seen from our tutorial's observableexamples.ts
  // This makes the code more reusable and allows it to be easier to be debugged. 
  shipPosObservable(); // moves the ship
  bulletMovementObservable(); // shoots bullets
  asteroidMovementObservable(); // moves asteroids
  asteroidCreationObservable(); // creates asteroids
  asteroidRespawnObservable(); // respawns asteroids after bomb
  asteroidBulletCollisionObservable(); // bullet shooting asteroid collisions -> breaks asteroids apart or destroys them
  shipWrappingObservable(); // wraps the ship across screen
  asteroidWrappingObservable(); // wraps asteroids across the screen
  shipCollidingAsteroidObservable(); // handles ship colliding with asteroid
  bombPowerupObservable(); // handles bomb powerup

}

// the following simply runs your asteroids function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = () => {
    asteroids();
  }