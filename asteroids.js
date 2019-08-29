"use strict";
function asteroids() {
    const svg = document.getElementById("canvas");
    const keydown$ = Observable.fromEvent(document, 'keydown');
    const keyup$ = Observable.fromEvent(document, 'keyup');
    let g = new Elem(svg, 'g')
        .attr("transform", "translate(300 300) rotate(300)");
    keydown$
        .scan(0, (acc, curr) => acc + 10)
        .map((e) => {
        return {
            translation: "translate(300 " + String(e) + ") rotate(300)"
        };
    })
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