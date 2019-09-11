"use strict";
function asteroids() {
    const arrayOfAsteroids = [], arrayOfBullets = [];
    let gameComplete = false;
    const mainTimer = Observable.interval(5);
    const asteroidObservable = Observable.interval(1);
    const mainAsteroidsObservable = mainTimer
        .takeUntil(mainTimer.filter(_ => gameComplete == true)).map(_ => ({
        bulletArray: arrayOfBullets,
        asteroidArray: arrayOfAsteroids,
        ship: g,
        shipTransformX: Number(g.elem.transform.baseVal.getItem(0).matrix.e),
        shipTransformY: Number(g.elem.transform.baseVal.getItem(0).matrix.f),
        shipRotation: Number(g.elem.transform.baseVal.getItem(1).angle)
    }));
    const svg = document.getElementById("canvas");
    const g = new Elem(svg, 'g')
        .attr("transform", "translate(300 300) rotate(170)");
    const ship = new Elem(svg, 'polygon', g.elem)
        .attr("points", "-15,20 15,20 0,-20")
        .attr("style", "fill:#f4e46c;stroke:#d3f08d;stroke-width:2");
    const keydown$ = Observable.fromEvent(document, 'keydown');
    const keyup$ = Observable.fromEvent(document, 'keyup');
    keydown$.map(({ key }) => {
        return ({
            key,
            spaceship: g
        });
    }).filter(({ key }) => (key == "ArrowRight"))
        .flatMap((key) => (Observable.interval(15)
        .takeUntil(keyup$)))
        .subscribe(({ spaceship }) => {
        let transformX = Number(g.elem.transform.baseVal.getItem(0).matrix.e), transformY = Number(g.elem.transform.baseVal.getItem(0).matrix.f), shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle);
        g.attr("transform", `translate(${transformX} ${transformY}) rotate(${shipRotation = shipRotation + 10})`);
    });
    keydown$.map(({ key }) => {
        return ({
            key,
            spaceship: g
        });
    }).filter(({ key }) => (key == "ArrowLeft"))
        .flatMap((key) => (Observable.interval(15)
        .takeUntil(keyup$)))
        .subscribe(({ spaceship }) => {
        let transformX = Number(g.elem.transform.baseVal.getItem(0).matrix.e), transformY = Number(g.elem.transform.baseVal.getItem(0).matrix.f), shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle);
        g.attr("transform", `translate(${transformX} ${transformY}) rotate(${shipRotation = shipRotation - 10})`);
    });
    keydown$.map(({ key }) => {
        return ({
            key: key,
            transformX: Number(g.elem.transform.baseVal.getItem(0).matrix.e),
            transformY: Number(g.elem.transform.baseVal.getItem(0).matrix.f),
            shipRotation: Number(g.elem.transform.baseVal.getItem(1).angle)
        });
    }).filter(({ key, transformX, transformY, shipRotation }) => (key == "ArrowUp"))
        .map(({ key, transformX, transformY, shipRotation }) => ({ vx: Math.cos(Math.PI * (shipRotation - 90) / 180), vy: Math.sin(Math.PI * (shipRotation - 90) / 180) }))
        .flatMap(({ vx, vy }) => Observable.interval(50)
        .map(t => ({ x: 300 * vx / t, y: 300 * vy / t })))
        .subscribe(({ x, y }) => {
        let transformX = Number(g.elem.transform.baseVal.getItem(0).matrix.e), transformY = Number(g.elem.transform.baseVal.getItem(0).matrix.f), shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle);
        g.attr("transform", `translate(${transformX = transformX + x} ${transformY = transformY + y}) rotate(${shipRotation})`);
    });
    keydown$
        .map(({ key }) => ({
        key,
        transformX: Number(g.elem.transform.baseVal.getItem(0).matrix.e),
        transformY: Number(g.elem.transform.baseVal.getItem(0).matrix.f),
        shipRotation: Number(g.elem.transform.baseVal.getItem(1).angle),
    }))
        .filter(({ key, transformX, transformY, shipRotation }) => (key == " "))
        .subscribe(({ key, transformX, transformY, shipRotation }) => {
        const rotationRadians = shipRotation * (Math.PI / 180);
        let bulletShot = new Elem(svg, 'circle')
            .attr("style", "fill:#ffffff;stroke:#ffffff;stroke-width:2")
            .attr("cx", transformX)
            .attr("cy", transformY)
            .attr("r", 4)
            .attr("bulletDistanceX", Math.cos(rotationRadians - (90 * (Math.PI / 180))) * 1)
            .attr("bulletDistanceY", Math.sin(rotationRadians - (90 * (Math.PI / 180))) * 1);
        arrayOfBullets.push(bulletShot);
    });
    mainAsteroidsObservable.subscribe(({ bulletArray }) => {
        bulletArray.map((bullet) => bullet.attr("cx", parseFloat(bullet.attr("cx")) + parseFloat(bullet.attr("bulletDistanceX")))
            .attr("cy", parseFloat(bullet.attr("cy")) + parseFloat(bullet.attr("bulletDistanceY"))))
            .filter((bull) => (parseFloat(bull.attr("cx")) >= 600) || parseFloat(bull.attr("cy")) >= 600 || parseFloat(bull.attr("cy")) <= 0 || parseFloat(bull.attr("cx")) <= 0)
            .forEach((bull) => {
            bull.elem.remove();
            arrayOfBullets.splice(arrayOfBullets.indexOf(bull), 1);
        });
    });
    function checkCollision(x1, x2, y1, y2, radius1, radius2) {
        let lineOfDistance = Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))), sumOfRadii = (radius1 + radius2);
        return lineOfDistance <= sumOfRadii;
    }
    function getRandomInt(min, max) {
        return Math.floor((Math.random() + min) * Math.floor(max));
    }
    function getDirection() {
        return getRandomInt(0, 2) === 0 ? -1 : 1;
    }
    mainAsteroidsObservable.subscribe(({ asteroidArray }) => {
        asteroidArray.forEach((asteroid) => {
            asteroid.attr("cx", parseFloat(asteroid.attr("directionX")) + parseFloat(asteroid.attr("cx")))
                .attr("cy", parseFloat(asteroid.attr("directionY")) + parseFloat(asteroid.attr("cy")));
        });
    });
    mainAsteroidsObservable.
        takeUntil(asteroidObservable.filter(i => i == 7))
        .subscribe((e) => {
        let asteroidRandomX = getRandomInt(0, 600);
        let asteroidRandomY = getRandomInt(0, 600);
        let asteroid = new Elem(svg, "circle")
            .attr("style", "fill:#CAEBF2;stroke:#9bd5bd;stroke-width:2")
            .attr("cx", asteroidRandomX)
            .attr("cy", asteroidRandomY)
            .attr("r", 50)
            .attr("splitCounter", 3)
            .attr("directionX", Math.random())
            .attr("directionY", Math.random());
        arrayOfAsteroids.push(asteroid);
    });
    function splitAsteroid(asteroid, asteroidX, asteroidY, asteroidRadius, asteroidSplitCounter) {
        if (asteroid.attr("splitCounter") != 0) {
            let asteroid1 = new Elem(svg, "circle")
                .attr("style", "fill:#CAEBF2;stroke:#9bd5bd;stroke-width:2")
                .attr("cx", asteroidX - 10)
                .attr("cy", asteroidY - 10)
                .attr("r", asteroidRadius - 20)
                .attr("splitCounter", asteroidSplitCounter = asteroidSplitCounter - 1);
            arrayOfAsteroids.push(asteroid1);
            let asteroid2 = new Elem(svg, "circle")
                .attr("style", "fill:#CAEBF2;stroke:#9bd5bd;stroke-width:2")
                .attr("cx", asteroidX + 10)
                .attr("cy", asteroidY + 10)
                .attr("r", asteroidRadius - 20)
                .attr("splitCounter", asteroidSplitCounter = asteroidSplitCounter - 1);
            arrayOfAsteroids.push(asteroid2);
        }
    }
    mainAsteroidsObservable.map(({ bulletArray, asteroidArray }) => {
        asteroidArray.forEach((asteroid) => {
            bulletArray.filter((bullet) => (checkCollision(parseFloat(asteroid.attr("cx")), parseFloat(bullet.attr("cx")), parseFloat(asteroid.attr("cy")), parseFloat(bullet.attr("cy")), parseFloat(bullet.attr("r")), parseFloat(asteroid.attr("r")))))
                .forEach((bullet) => {
                bullet.elem.remove();
                arrayOfBullets.splice(arrayOfBullets.indexOf(bullet), 1);
                splitAsteroid(asteroid, parseFloat(asteroid.attr("cx")), parseFloat(asteroid.attr("cy")), parseFloat(asteroid.attr("r")), parseFloat(asteroid.attr("splitCounter")));
                asteroid.elem.remove();
                arrayOfAsteroids.splice(arrayOfAsteroids.indexOf(asteroid), 1);
            });
        });
    }).subscribe(() => console.log);
    let shipWrappingState = mainAsteroidsObservable.map(({ ship, shipTransformX, shipTransformY, shipRotation }) => ({
        shipTransformX,
        shipTransformY,
        ship
    }));
    shipWrappingState
        .filter(({ shipTransformX, ship }) => (shipTransformX >= 600))
        .subscribe(() => {
        let transformX = Number(g.elem.transform.baseVal.getItem(0).matrix.e), transformY = Number(g.elem.transform.baseVal.getItem(0).matrix.f), shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle);
        g.attr("transform", `translate(${transformX = 10} ${transformY}) rotate(${shipRotation})`);
    });
    shipWrappingState
        .filter(({ shipTransformX, ship }) => (shipTransformX <= 0))
        .subscribe(() => {
        let transformX = Number(g.elem.transform.baseVal.getItem(0).matrix.e), transformY = Number(g.elem.transform.baseVal.getItem(0).matrix.f), shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle);
        g.attr("transform", `translate(${transformX = 600} ${transformY}) rotate(${shipRotation})`);
    });
    shipWrappingState
        .filter(({ shipTransformY, ship }) => (shipTransformY >= 600))
        .subscribe(() => {
        let transformX = Number(g.elem.transform.baseVal.getItem(0).matrix.e), transformY = Number(g.elem.transform.baseVal.getItem(0).matrix.f), shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle);
        g.attr("transform", `translate(${transformX} ${transformY = 0}) rotate(${shipRotation})`);
    });
    shipWrappingState
        .filter(({ shipTransformY, ship }) => (shipTransformY <= 0))
        .subscribe(() => {
        let transformX = Number(g.elem.transform.baseVal.getItem(0).matrix.e), transformY = Number(g.elem.transform.baseVal.getItem(0).matrix.f), shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle);
        g.attr("transform", `translate(${transformX} ${transformY = 600}) rotate(${shipRotation})`);
    });
    let asteroidWrappingState = mainAsteroidsObservable.map(({ asteroidArray }) => {
        return asteroidArray;
    });
    asteroidWrappingState.forEach((asteroid) => asteroid.filter((asteroid) => parseFloat(asteroid.attr("cx")) >= 600)
        .map((asteroid) => asteroid.attr("cx", 0))).subscribe(() => console.log);
    asteroidWrappingState.forEach((asteroid) => asteroid.filter((asteroid) => parseFloat(asteroid.attr("cy")) >= 600)
        .map((asteroid) => asteroid.attr("cy", 0))).subscribe(() => console.log);
    let polygonTag = document.querySelector("polygon"), polygonBBox = polygonTag.getBBox();
    mainAsteroidsObservable.map(({ asteroidArray, shipTransformX, shipTransformY }) => {
        return ({
            asteroidArray: asteroidArray,
            shipTransformX: shipTransformX,
            shipTransformY: shipTransformY
        });
    }).forEach(({ asteroidArray, shipTransformX, shipTransformY }) => asteroidArray.filter((asteroid) => checkCollision(parseFloat(shipTransformX), parseFloat(asteroid.attr("cx")), parseFloat(shipTransformY), parseFloat(asteroid.attr("cy")), parseFloat(asteroid.attr("r")), parseFloat(polygonBBox.width - 15))).map((e) => {
        gameComplete = true;
        ship.attr("style", "fill:#FF0000;stroke:purple;stroke-width:1");
    }))
        .subscribe(() => console.log);
}
if (typeof window != 'undefined')
    window.onload = () => {
        asteroids();
    };
//# sourceMappingURL=asteroids.js.map