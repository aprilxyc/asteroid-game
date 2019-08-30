"use strict";
function asteroids() {
    const svg = document.getElementById("canvas");
    const keydown$ = Observable.fromEvent(document, 'keydown');
    const keyup$ = Observable.fromEvent(document, 'keyup');
    let g = new Elem(svg, 'g')
        .attr("transform", "translate(300 300) rotate(300)");
    let shipControls = {
        moveUp: "ArrowUp",
        moveDown: "ArrowDown",
        moveLeft: "ArrowLeft",
        moveRight: "Arrowright"
    };
    keydown$
        .map(({ key }) => {
        return key;
    })
        .filter((key) => (key == "ArrowUp"))
        .scan(0, (acc, curr) => acc + 10)
        .subscribe((translation) => g.attr("transform", `translate(300 ${translation}) rotate(300)`));
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