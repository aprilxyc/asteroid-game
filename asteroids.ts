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

  // create he canvas Element
  const svg = document.getElementById("canvas")!;

  // creates new observable that emits an event object everytime a keydwn is fired
  // emits keyboard event everytime user presses down a key
  const keydown$ = Observable.fromEvent<KeyboardEvent>(document, 'keydown');
  const keyup$   = Observable.fromEvent<KeyboardEvent>(document, 'keyup');

  // const animate = setInterval(() => rect.attr('x', 1 + Number(rect.attr('x'))), 10);




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
  // console.log(currentG[1]);

  // store as global variables




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




  // keydown$
  //   .map(({ key }) => {
  //     return key
  //   })
  //   .filter((key) => (key == "ArrowRight"))
  //   .scan(300, (acc, curr) => acc + 10)
  //   .subscribe((translation) =>
  //     g.attr("transform", `translate(300 300) rotate(${translation})`))

  // keydown$
  //   .map(({ key }) => {
  //     return key
  //   })
  //   .filter((key) => (key == "ArrowLeft"))
  //   .scan(300, (acc, curr) => acc - 10)
  //   .subscribe((translation) =>
  //     g.attr("transform", `translate(300 300) rotate(${translation})`))

  // store r 
  let translateX = Number(shipMove[1])
  let translateY = Number(shipMove[2])
  let rotation   = Number(shipMove[3])


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

  // create a polygon shape for the space ship as a child of the transform group
  // spaceship aesthetic
  let ship = new Elem(svg, 'polygon', g.elem)
    .attr("points", "-15,20 15,20 0,-30")
    .attr("style", "fill:red;stroke:purple;stroke-width:1")

  // handle the shooting with the space bar
  let bulletX = translateX
  let bulletY = translateY

  keydown$
    .map(({ key }) => {
      return key
    })
    .filter((key) => (key == " "))
    .subscribe((e) => {
      const rotationRadians = rotation * (Math.PI / 180)
      const bulletDistanceX = Math.cos(rotationRadians - (90 * (Math.PI / 180))) * 10
      const bulletDistanceY = Math.sin(rotationRadians - (90 * (Math.PI / 180))) * 10

      let bulletShot = new Elem(svg, 'ellipse')
        .attr("style", "fill:yellow;stroke:purple;stroke-width:2")
        .attr("cx", translateX) // follow where the arrow is
        .attr("cy", translateY)
        .attr("rx", 5)
        .attr("ry", 5)
      Observable.interval(100)
        .subscribe(() => {
          bulletShot.attr("cx", bulletX = bulletDistanceX + bulletX)
          bulletShot.attr("cy", bulletY = bulletDistanceY + bulletY)
        });
    })
}

// For asteroids, absolute distance mustt be smaller than sum of the radii then they have collided


// the following simply runs your asteroids function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = () => {
    asteroids();
  }
