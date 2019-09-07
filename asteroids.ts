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

  // use interval to make it continue
  // write a function for the translation

  // const f = (k, transformFn) => {
  //   keydown$
  //     .map(({ key }) => {
  //       return key
  //     })
  //     .filter((key) => (key == k))
  //     .scan(300, transformFn)
  //     .subscribe((rotation) =>
  //       g.attr("transform", `translate(300 300) rotate(${Number(currentG[2]) + rotation})`))
  // }

  // // f('ArrowDown', (acc, x) => acc + 10);
  // // f('ArrowUp', (acc, x) => acc + 10);
  // f('ArrowLeft', (acc, x) => acc - 10);
  // f('ArrowRight', (acc, x) => acc + 10);

  // create a polygon shape for the space ship as a child of the transform group
  // spaceship aesthetic
  let ship = new Elem(svg, 'polygon', g.elem)
    .attr("points", "-15,20 15,20 0,-30")
    .attr("style", "fill:#f4e46c;stroke:#f4e46c;stroke-width:1")
  
  let translateX = Number(shipMove[1])
  let translateY = Number(shipMove[2])
  let rotation   = Number(shipMove[3])

  let asteroid = new Elem(svg, "circle")
        .attr("style", "fill:#9bd5bd;stroke:#9bd5bd;stroke-width:2")
        .attr("cx", 300) // follow where the arrow is
        .attr("cy", 20)
        .attr("r", 50)


  // use an interval to keep
  // taken from:
  // https://stackoverflow.com/questions/52015418/random-movement-angular
  function getRandomInt(min: Number, max: Number) {
    return Math.floor((Math.random() + min) * Math.floor(max));
  }

  // Then you will need to determine the direction, if it is negative (go left) or positive (go right):
  function getDirection() {
    return getRandomInt(0, 2) === 0? -1 : 1; 
  }

  let directionX = getDirection();
  let directionY = getDirection();
  let x_velocity = directionX * getRandomInt(1,8); // the number will be between -8 and 8 excluding 0
  let y_velocity = directionY * getRandomInt(1,8); // same here

  Observable.interval(100)
  .takeUntil(Observable.interval(10000))
  .map(() => {
    asteroid.attr("cx", x_velocity + Number(asteroid.attr("cx"))); // the ball should go towards the left or the right
    asteroid.attr("cy", y_velocity + Number(asteroid.attr("cy"))); // the ball should go up or down
    return asteroid
  })
  .filter((asteroid)=> (asteroid.attr("cx") > 600 + 50))
  .map((asteroid) => {
    asteroid.attr("cx", -50)
    return asteroid
  })
  .filter((asteroid) => (asteroid.attr("cx") < -50))
  .map((asteroid) => {
    asteroid.attr("cx", 650)
    return asteroid
  })
  .filter((asteroid) => asteroid.attr("cy") > 650)
  .map((asteroid) => {
    asteroid.attr("cy", -50)
    return asteroid
  })
  .filter((asteroid) => asteroid.attr("cy") < 50)
  .map((asteroid) => {
    asteroid("cy", 600 + 50)
    return asteroid
  })
  .filter((asteroid) => (asteroid.attr("cy") < 600))
  .subscribe((asteroid) => console.log)


    // .subscribe((asteroid) => console.log(asteroid.attr("cx")))


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
      // const rotation = shipMove[3] = Number(shipMove[3] - 10)
      g.attr("transform", `translate(${translateX} ${translateY}) rotate(${rotation = rotation - 10})`)
    }
    )

  // movement right
  keydown$
    .map(({ key }) => {
      return key
    })
    .filter((key) => (key == "ArrowRight"))
    .scan(0, (acc, curr) => acc + 10)
    .subscribe(() => {
      // const rotation = shipMove[3] = Number(shipMove[3] + 10)
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

    // delete the element using
    // element.remove 
//parent.remove(child)


}

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
