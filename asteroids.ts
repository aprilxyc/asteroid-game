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

  let   gameTimer      = 150,
        gameComplete   = false
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
  // shipMpve[0] = translate X
  // shipMove[1] = translate Y
  // shipMove[2] = rotation
  let shipMove = /translate\((\d+) (\d+)\) rotate\((\d+)\)/.exec(g.attr("transform"))!;

  // create ship svg
  let ship = new Elem(svg, 'polygon', g.elem)
    .attr("points", "-15,20 15,20 0,-30")
    .attr("style", "fill:#f4e46c;stroke:#f4e46c;stroke-width:1")

  // create asteriod svg
  let asteroid = new Elem(svg, "circle")
    .attr("style", "fill:#9bd5bd;stroke:#9bd5bd;stroke-width:2")
    .attr("cx", 300) // follow where the arrow is
    .attr("cy", 20)
    .attr("r", 50)

  let asteroid2 = new Elem(svg, "circle")
    .attr("style", "fill:#9bd5bd;stroke:#9bd5bd;stroke-width:2")
    .attr("cx", 400) // follow where the arrow is
    .attr("cy", 200)
    .attr("r", 50)

  // keep track of ship coordinates (translate x, translate y, rotation)
  let translateX = Number(shipMove[1])
  let translateY = Number(shipMove[2])
  let rotation   = Number(shipMove[3])

  // used to get a random integer for asteroid random movementts
  // inspired by: https://stackoverflow.com/questions/52015418/random-movement-angular
  function getRandomInt(min: number, max: number) {
    return Math.floor((Math.random() + min) * Math.floor(max));
  }

  // Then you will need to determine the direction, if it is negative (go left) or positive (go right):
  function getDirection() {
    return getRandomInt(0, 2) === 0 ? -1: 1;
  }

  let directionX = getDirection();
  let directionY = getDirection();

  let velocityX = getRandomInt(1, 8);  // the number will be between -8 and 8 excluding 0
  let velocityY = getRandomInt(1, 8);  // same here

  // LOGIC FOR ASTEROID MOVING RANDOMLY
  gameObservable.subscribe(() => {
    asteroid.attr("cx", directionX * velocityX + Number(asteroid.attr("cx")))  // the ball should go towards the left or the right
    asteroid.attr("cy", directionY * velocityY + Number(asteroid.attr("cy"))) // the ball should go up or down
  })

  // LOGIC FOR ASTEROID COLLIDING WITH EDGE --> x axis
  gameObservable
    .map(() => ({
      asteroidX: Number(asteroid.attr("cx")),
      asteroidY: Number(asteroid.attr("cy")),
      asteroidR: Number(asteroid.attr("r"))
    }))
    .filter(({ asteroidX }) => (
      (asteroidX > 600 + 10)
    ))
    .subscribe(() => {
      asteroid.attr("cx", -10)
    })


  // LOGIC FOR ASTEROID COLLIDING WITH EDGE --> x axis
  gameObservable
    .map(() => ({
      asteroidX: Number(asteroid.attr("cx")),
      asteroidY: Number(asteroid.attr("cy")),
      asteroidR: Number(asteroid.attr("r"))
    }))
    .filter(({ asteroidX }) => (
      (asteroidX < -10)
    ))
    .subscribe(() => {
      asteroid.attr("cx", 600 + 10)
    })

  // y axis screen wrap
  gameObservable
    .map(() => ({
      asteroidX: Number(asteroid.attr("cx")),
      asteroidY: Number(asteroid.attr("cy")),
      asteroidR: Number(asteroid.attr("r"))
    }))
    .filter(({ asteroidY }) => (
      (asteroidY > 600 + 10)
    ))
    .subscribe(() => {
      asteroid.attr("cy", -10)
    })

  // y-axis screen wrap
  gameObservable
    .map(() => ({
      asteroidX: Number(asteroid.attr("cx")),
      asteroidY: Number(asteroid.attr("cy")),
      asteroidR: Number(asteroid.attr("r"))
    }))
    .filter(({ asteroidX }) => (
      (asteroidX < -10)
    ))
    .subscribe(() => {
      asteroid.attr("cy", 600 + 10)
    })



    
  // movement left
  keydown$ // get the repeat object and take it once itis true
    .map(({ key }) => {
      return key
    })
    .filter((key) => (key == "ArrowLeft"))
    .subscribe(() => {
      g.attr("transform", `translate(${translateX} ${translateY}) rotate(${rotation = rotation - 10})`)
    })

  // movement right
  keydown$
    .map(({ key }) => {
      return key
    })
    .filter((key) => (key == "ArrowRight"))
    .subscribe(() => {
      g.attr("transform", `translate(${translateX} ${translateY}) rotate(${rotation = rotation + 10})`)
    })

  // movement up
  keydown$
    .map(({ key }) => {
      return key
    })
    .filter((key) => (key == "ArrowUp"))
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

  // store the bullets into an array so asteroids can iterate through it
  let bulletsArray: Elem[] = [];

  keydown$
    .map(({ key }) => {
      return key
    })
    .filter((key) => (key == " "))
    .subscribe((e) => {
      const rotationRadians = rotation * (Math.PI / 180)
      const bulletDistanceX = Math.cos(rotationRadians - (90 * (Math.PI / 180))) * 10
      const bulletDistanceY = Math.sin(rotationRadians - (90 * (Math.PI / 180))) * 10

      // create bullets
      let bulletShot = new Elem(svg, 'circle')
        .attr("style", "fill:#ffffff;stroke:#ffffff;stroke-width:2")
        .attr("cx", translateX) // follow where the arrow is
        .attr("cy", translateY)
        .attr("r", 5)

      // add bullets into an array
      bulletsArray.push(bulletShot)

      // save the state
      let currentState = Observable.interval(100).map(x => ({ x, currBullet: bulletShot }))

      //Number(currBullet.currBullet.attr("cx")) >= 550 || (Number(currBullet.currBullet.attr("cy")) >= 550) || (Number(currBullet.currBullet.attr("cy")) <= 0) || Number(currBullet.currBullet.attr("cx")) < 0)
      currentState
        .filter((currBullet) => Number(currBullet.currBullet.attr("cx")) > 600 || (Number(currBullet.currBullet.attr("cy")) > 600) || (Number(currBullet.currBullet.attr("cy")) < 0) || Number(currBullet.currBullet.attr("cx")) < 0)
        .subscribe((currBullet) => {
          currBullet.currBullet.elem.remove(); // otherwise remove bullet
        })
      // checks if bullet is offscreen
      currentState
        .filter((currBullet) => Number(currBullet.currBullet.attr("cx")) <= 600 && (Number(currBullet.currBullet.attr("cy")) <= 600) && (Number(currBullet.currBullet.attr("cy")) >= 0) && Number(currBullet.currBullet.attr("cx")) >= 0)
        .subscribe((currBullet) => {
          // console.log(currBullet)
          let bulletX = Number(currBullet.currBullet.attr("cx"))
          let bulletY = Number(currBullet.currBullet.attr("cy"))

          currBullet.currBullet.attr("cx", bulletDistanceX + bulletX)
          currBullet.currBullet.attr("cy", bulletDistanceY + bulletY)
        })

    })

  // LOGIC TO REMOVE ASTEROIDS OFFSCREEN FROM ARRAY
  // ask about how to check if the bullet is within the coordinates of the circle
  // this goes througgh the array of bullets and removes the ones that are offscreen
  // gameObservable.map((x) => ({
  //   timer      : x,
  //   bulletArray: bulletsArray
  // })).map((e) =>
  //   e.bulletArray.filter((element) => {
  //     (Number(element.attr("cx")) >= 600 || Number(element.attr("cy")) >= 600 || Number(element.attr("cy")) <= 0 || Number(element.attr("cx")) <= 0)
  //   })
  // )

  // interval observable and user input oobservable. whhen they hit space, turn it intoo a bullet and subscribe to that
  // by drawing a bullet
  // diffrence in x^2 and difference in y^2 and if that is less than yuor radius 

  function checkCollision(x1: number, x2: number, y1: number, y2: number, radius1:number, radius2: number) {
    // console.log("x1: " + x1)
    // console.log("x2: " + x2)
    // console.log("y1: " + y1)
    // console.log("y2: " + y2)

    let lineOfDistance = Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)))
    let sumOfRadii = (radius1 + radius2)
    // console.log("line of distance: " + lineOfDistance)
    // console.log("radius " + sumOfRadii)
    console.log(lineOfDistance <= sumOfRadii)
    return lineOfDistance <= sumOfRadii
  }


  gameObservable.map((x) => ({
    time       : x,
    bulletArray: bulletsArray
  })).map((e) => {
    return e.bulletArray.filter((bulletArray) => (
      Number(bulletArray.attr("cx")) <= 600 && (Number(bulletArray.attr("cy")) <= 600) && (Number(bulletArray.attr("cy")) >= 0) && Number(bulletArray.attr("cx")) >= 0
    ))
  }).subscribe(array => {
    bulletsArray = array
    // console.log(bulletsArray)
  })

  // logic for asteroid checking for collision with the bullets
  gameObservable.map(x => ({
    x,
    currAsteroid: asteroid,
    bulletArray  : bulletsArray
  })).map((e) => {
    
  let asteroidXCircle = Number(e.currAsteroid.attr("cx"))
  let asteroidYCircle = Number(e.currAsteroid.attr("cy"))
  let asteroidRadius = Number(e.currAsteroid.attr("r"))

  return e.bulletArray.filter((bullet) => (
    checkCollision(Number(bullet.attr("cx")), asteroidXCircle, Number(bullet.attr("cy")), asteroidYCircle, asteroidRadius, Number(bullet.attr("r")))
  ))})
  .subscribe((returnArray) => {
    returnArray.forEach((element) => element.elem.remove())
    console.log(returnArray)
    // asteroid2.elem.remove()
  })


  //     return e.bulletArray.forEach((bullet) => {
//       let asteroidXCircle = Number(e.currAsteroid.attr("cx"))
//       let asteroidYCircle = Number(e.currAsteroid.attr("cy"))
//       let asteroidRadius = Number(e.currAsteroid.attr("r"))
//       let bulletXCircle = Number(bullet.attr("cx"))
//       let bulletYCircle = Number(bullet.attr("cy"))
//       let bulletRadius = Number(bullet.attr("r"))

//       return Math.sqrt( Math.pow((asteroidXCircle - bulletXCircle), 2) + Math.pow((asteroidYCircle - bulletYCircle), 2))
//     })
//   }).subscribe((bullet) => console.log(bullet))
// }


}


//   gameObservable.map(x => ({
//     x,
//     currAsteroid: asteroid,
//     bulletArray  : bulletsArray
//   })).map((e) => {

//   let asteroidXCircle = Number(e.currAsteroid.attr("cx"))
//   let asteroidYCircle = Number(e.currAsteroid.attr("cy"))
//   let asteroidRadius = Number(e.currAsteroid.attr("r"))

//   return e.bulletArray.forEach((bullet),
    
//   })
// }).subscribe((e) => ({
//   currAsteroid.elem.remove()
// }))
// let bulletXCircle = Number(bullet.attr("cx"))
// let bulletYCircle = Number(bullet.attr("cy"))
// let bulletRadius = Number(bullet.attr("r"))

//     return e.bulletArray.forEach((bullet) => {
//       let asteroidXCircle = Number(e.currAsteroid.attr("cx"))
//       let asteroidYCircle = Number(e.currAsteroid.attr("cy"))
//       let asteroidRadius = Number(e.currAsteroid.attr("r"))
//       let bulletXCircle = Number(bullet.attr("cx"))
//       let bulletYCircle = Number(bullet.attr("cy"))
//       let bulletRadius = Number(bullet.attr("r"))

//       return Math.sqrt( Math.pow((asteroidXCircle - bulletXCircle), 2) + Math.pow((asteroidYCircle - bulletYCircle), 2))
//     })
//   }).subscribe((bullet) => console.log(bullet))
// }

  // distance of two things and add their radii together and compare 
  // if that line distance is smaller or equal to othe radius of the two things added toogehter htan it will collide

  // one interval that updates every 10 milliseconods, controols whole game


  // array of 1. It's pure and if you add 2 to it it is still pure as long as long as you work with 1 and not set
  // it. So everytime you add something, you need too directly manipulate it everything. Create a new array
  // scan is an observable of all the intermediate states. So you don't just ge the last state, you get every state. 

// For asteroids, absolute distance must be smaller than sum of the radii then they have collided

  // bounding client stuff in ship. Get rectangele that bounds yuor traignle. getbbbox (elements inside svg -- this is svg method)
  // getBBbox gives it to you in svg cooridnates. That giives yoouo a swuare, then you can do the same thing on your asteroid.
  // Then its the code from oone of the lectures - two squares overlapping. 
// the following simply runs your asteroids function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = () => {
    asteroids();
  }

