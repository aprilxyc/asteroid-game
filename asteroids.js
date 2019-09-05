"use strict";
function asteroids() {
    const svg = document.getElementById("canvas");
    const keydown$ = Observable.fromEvent(document, 'keydown');
    const keyup$ = Observable.fromEvent(document, 'keyup');
    let g = new Elem(svg, 'g')
        .attr("transform", "translate(300 300) rotate(300)");
    let shipMove = /translate\((\d+) (\d+)\) rotate\((\d+)\)/.exec(g.attr("transform"));
    keydown$
        .map(({ key }) => {
        return key;
    })
        .filter((key) => (key == "ArrowLeft"))
        .scan(0, (acc, curr) => acc + 10)
        .subscribe(() => {
        const rotation = shipMove[3] = Number(shipMove[3] + 10);
        g.attr("transform", `translate(${shipMove[1]} ${shipMove[2]}) rotate(${rotation})`);
    });
    keydown$
        .map(({ key }) => {
        return key;
    })
        .filter((key) => (key == "ArrowRight"))
        .scan(0, (acc, curr) => acc + 10)
        .subscribe(() => {
        const rotation = shipMove[3] = Number(shipMove[3] - 10);
        g.attr("transform", `translate(${shipMove[1]} ${shipMove[2]}) rotate(${rotation})`);
    });
    keydown$
        .map(({ key }) => {
        return key;
    })
        .filter((key) => (key == "ArrowUp"))
        .scan(0, (acc, curr) => acc + 10)
        .subscribe(() => {
        const rotationRadians = shipMove[3] * (Math.PI / 180);
        const distanceX = Math.cos(rotationRadians - (90 * (Math.PI / 180))) * 10;
        const distanceY = Math.sin(rotationRadians - (90 * (Math.PI / 180))) * 10;
        const rotation = shipMove[3];
        g.attr("transform", `translate(${shipMove[1] = Number(shipMove[1]) + distanceX} ${shipMove[2] = Number(shipMove[2]) + distanceY}) rotate(${rotation})`);
    });
    let ship = new Elem(svg, 'polygon', g.elem)
        .attr("points", "-15,20 15,20 0,-30")
        .attr("style", "fill:red;stroke:purple;stroke-width:1");
}
if (typeof window != 'undefined')
    window.onload = () => {
        asteroids();
    };
//# sourceMappingURL=asteroids.js.map