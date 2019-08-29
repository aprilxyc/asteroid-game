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

  // keydown$
  //   .map(() => {
  //     x: 300
  //   })
  //   .map(({ x }: Number) => ({
  //     translation: "translate (300 " + String(x + 1) + ") rotate(300)"
  //   }))
  //   .subscribe(({ translation }) => g.attr("transoform", translation));


  // make a group for the spaceship and a transform to move it and rotate it
  // to animate the spaceship you will update the transform property
  // spaceship actual movement
  // SET THE COORDINATETS FIRST?


  // function* infiniteSeq(seed) {
  //   var i = seed;
  //   while (true) {
  //     yield i;
  //     i = i + 1;  // add 1
  //   }
  // }

  // const iterator    = infiniteSeq(300);           // insert starting value 300
  // const generateNum = Observable.from(iterator);
  // generateNum.subscribe((x: number) => console.log(x))



  let g = new Elem(svg, 'g')
    .attr("transform", "translate(300 300) rotate(300)")


  keydown$
    .map((e) => {
      const myNum = initSequence((value: number) => value + 1)
      let   value = 200;
      console.log(myNum(value).next().next().next())
      return {
        translation: "translate(300 " + String(myNum(300)) + ") rotate(300)"
      }
    })
    .takeUntil(keyup$)
    .subscribe(({ translation }) =>
      g.attr("transform", translation));



  // keydown$
  //   .subscribe((e) => g.attr("transform", "translate(300 500) rotate(300)"))

  // keydown$
  //   .subscribe((e) => moveLeft(g));



  // g.subscribe(({ x, y }) => console.log);


  //     .filter(x => x.keyCode === 32)
  //     .map(({ translate, rotate }) => {
  //       translate: translate(300 300),
  //       rotate   : rotate(300),
  //     })
  //     .subscribe(({ translate, rotate }) => {
  //       g.attr("transform", toString(translate) + ' ' + toString(rotate))
  //     )
  // }


  // create a polygon shape for the space ship as a child of the transform group
  // spaceship aesthetic
  let ship = new Elem(svg, 'polygon', g.elem)
    .attr("points", "-15,20 15,20 0,-30")
    .attr("style", "fill:red;stroke:purple;stroke-width:1")

  console.log(g.elem)

}

// the following simply runs your asteroids function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = () => {
    asteroids();
  }




