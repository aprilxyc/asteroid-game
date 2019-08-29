"use strict";
function asteroids() {
    const svg = document.getElementById("canvas");
    const keydown$ = Observable.fromEvent(document, 'keydown');
    const keyup$ = Observable.fromEvent(document, 'keyup');
    let g = new Elem(svg, 'g')
        .attr("transform", "translate(300 300) rotate(300)");
    keydown$
        .map((e) => {
        const myNum = initSequence((value) => value + 1);
        let value = 200;
        console.log(myNum(value).next().next().next());
        return {
            translation: "translate(300 " + String(myNum(300)) + ") rotate(300)"
        };
    })
        .takeUntil(keyup$)
        .subscribe(({ translation }) => g.attr("transform", translation));
    let ship = new Elem(svg, 'polygon', g.elem)
        .attr("points", "-15,20 15,20 0,-30")
        .attr("style", "fill:red;stroke:purple;stroke-width:1");
    console.log(g.elem);
}
if (typeof window != 'undefined')
    window.onload = () => {
        asteroids();
    };
//# sourceMappingURL=asteroids.js.map