"use strict";
function asteroids() {
    let arrayOfAsteroids = [], arrayOfBullets = [], myScore = 0, lives = 3, bomb = 3, shipColourArray = [];
    let gameComplete = false;
    let collided = false;
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
        .attr("points", "-15,20 0,15 15,20 0, -20")
        .attr("style", "fill:#171846;stroke:#ffffff ;stroke-width:2");
    const keydown$ = Observable.fromEvent(document, 'keydown').map(({ keyCode, key, repeat }) => ({
        asteroidArray: arrayOfAsteroids,
        keyCode,
        key,
        repeat
    })), keyup$ = Observable.fromEvent(document, 'keyup');
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
        .subscribe(({}) => {
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
        .filter(({ key }) => (key == " "))
        .subscribe(({ transformX, transformY, shipRotation }) => {
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
        bulletArray
            .map((bullet) => bullet.attr("cx", parseFloat(bullet.attr("cx")) + parseFloat(bullet.attr("bulletDistanceX")))
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
    function checkShipCollision(x1, x2, y1, y2, radius1, radius2, shipTransformX, shipTransformY, shipRotation) {
        let lineOfDistance = Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))), sumOfRadii = (radius1 + radius2);
        if (lineOfDistance <= sumOfRadii) {
            g.attr("transform", `translate(300 300) rotate(300)`);
            --lives;
            updateHTMLElements(myScore, lives, bomb);
            return true;
        }
        return false;
    }
    function getRandomInt(min, max) {
        return (Math.random() + min) * Math.floor(max);
    }
    mainAsteroidsObservable.subscribe(({ asteroidArray }) => {
        asteroidArray.forEach((asteroid) => {
            asteroid
                .attr("cx", Number(asteroid.attr("directionX")) + Number(asteroid.attr("cx")))
                .attr("cy", Number(asteroid.attr("directionY")) + Number(asteroid.attr("cy")));
        });
    });
    mainAsteroidsObservable
        .takeUntil(asteroidObservable.filter(i => i == 8))
        .subscribe((e) => {
        let asteroidRandomX = getRandomInt(0, 600);
        let asteroidRandomY = getRandomInt(0, 600);
        let asteroid = new Elem(svg, "circle")
            .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
            .attr("cx", asteroidRandomX)
            .attr("cy", asteroidRandomY)
            .attr("r", 50)
            .attr("splitCounter", 3)
            .attr("directionX", getRandomInt(-1, 1))
            .attr("directionY", getRandomInt(-1, 1));
        arrayOfAsteroids.push(asteroid);
    });
    mainAsteroidsObservable
        .filter(({ asteroidArray }) => asteroidArray.length == 0)
        .takeUntil(Observable.interval(15).filter(i => i == 8))
        .subscribe((e) => {
        let asteroidRandomX = getRandomInt(0, 600);
        let asteroidRandomY = getRandomInt(0, 600);
        let asteroid = new Elem(svg, "circle")
            .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
            .attr("cx", asteroidRandomX)
            .attr("cy", asteroidRandomY)
            .attr("r", 50)
            .attr("splitCounter", 3)
            .attr("directionX", getRandomInt(-1, 1))
            .attr("directionY", getRandomInt(-1, 1));
        arrayOfAsteroids.push(asteroid);
    });
    function splitAsteroid(asteroid, asteroidX, asteroidY, asteroidRadius, asteroidSplitCounter) {
        if (asteroid.attr("splitCounter") != 0) {
            let asteroid1 = new Elem(svg, "circle")
                .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
                .attr("cx", asteroidX + 20)
                .attr("cy", asteroidY + 20)
                .attr("r", asteroidRadius - 10)
                .attr("splitCounter", asteroidSplitCounter = asteroidSplitCounter - 1)
                .attr("directionX", getRandomInt(-1, 1))
                .attr("directionY", getRandomInt(-1, 1));
            arrayOfAsteroids.push(asteroid1);
            let asteroid2 = new Elem(svg, "circle")
                .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
                .attr("cx", asteroidX - 20)
                .attr("cy", asteroidY - 20)
                .attr("r", asteroidRadius - 10)
                .attr("splitCounter", asteroidSplitCounter = asteroidSplitCounter - 1)
                .attr("directionX", getRandomInt(-1, 1))
                .attr("directionY", getRandomInt(-1, 1));
            arrayOfAsteroids.push(asteroid2);
        }
    }
    mainAsteroidsObservable.map(({ bulletArray, asteroidArray, shipTransformX, shipTransformY, shipRotation }) => {
        asteroidArray.forEach((asteroid) => {
            bulletArray.filter((bullet) => (checkCollision(Number(asteroid.attr("cx")), Number(bullet.attr("cx")), Number(asteroid.attr("cy")), Number(bullet.attr("cy")), Number(bullet.attr("r")), Number(asteroid.attr("r")), shipTransformX, shipTransformY, shipRotation)))
                .forEach((bullet) => {
                bullet.elem.remove();
                arrayOfBullets.splice(arrayOfBullets.indexOf(bullet), 1);
                myScore += 10;
                updateHTMLElements(myScore, lives, bomb);
                splitAsteroid(asteroid, parseFloat(asteroid.attr("cx")), parseFloat(asteroid.attr("cy")), parseFloat(asteroid.attr("r")), parseFloat(asteroid.attr("splitCounter")));
                asteroid.elem.remove();
                arrayOfAsteroids.splice(arrayOfAsteroids.indexOf(asteroid), 1);
            });
        });
    }).subscribe(() => console.log);
    const shipWrappingState = mainAsteroidsObservable
        .map(({ ship, shipTransformX, shipTransformY, shipRotation }) => ({
        shipTransformX,
        shipTransformY,
        ship
    }));
    shipWrappingState
        .filter(({ shipTransformX }) => (shipTransformX >= 600))
        .subscribe(() => {
        let transformX = Number(g.elem.transform.baseVal.getItem(0).matrix.e), transformY = Number(g.elem.transform.baseVal.getItem(0).matrix.f), shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle);
        g.attr("transform", `translate(${transformX = 10} ${transformY}) rotate(${shipRotation})`);
    });
    shipWrappingState
        .filter(({ shipTransformX }) => (shipTransformX <= 0))
        .subscribe(() => {
        let transformX = Number(g.elem.transform.baseVal.getItem(0).matrix.e), transformY = Number(g.elem.transform.baseVal.getItem(0).matrix.f), shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle);
        g.attr("transform", `translate(${transformX = 600} ${transformY}) rotate(${shipRotation})`);
    });
    shipWrappingState
        .filter(({ shipTransformY }) => (shipTransformY >= 600))
        .subscribe(() => {
        let transformX = Number(g.elem.transform.baseVal.getItem(0).matrix.e), transformY = Number(g.elem.transform.baseVal.getItem(0).matrix.f), shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle);
        g.attr("transform", `translate(${transformX} ${transformY = 0}) rotate(${shipRotation})`);
    });
    shipWrappingState
        .filter(({ shipTransformY }) => (shipTransformY <= 0))
        .subscribe(() => {
        let transformX = Number(g.elem.transform.baseVal.getItem(0).matrix.e), transformY = Number(g.elem.transform.baseVal.getItem(0).matrix.f), shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle);
        g.attr("transform", `translate(${transformX} ${transformY = 600}) rotate(${shipRotation})`);
    });
    let asteroidWrappingState = mainAsteroidsObservable.map(({ asteroidArray }) => {
        return asteroidArray;
    });
    asteroidWrappingState.forEach((asteroid) => asteroid.filter((asteroid) => Number(asteroid.attr("cx")) >= 650)
        .map((asteroid) => asteroid.attr("cx", 0))).subscribe(() => console.log);
    asteroidWrappingState.forEach((asteroid) => asteroid.filter((asteroid) => Number(asteroid.attr("cy")) >= 650)
        .map((asteroid) => asteroid.attr("cy", 0))).subscribe(() => console.log);
    asteroidWrappingState.forEach((asteroid) => asteroid.filter((asteroid) => Number(asteroid.attr("cx")) <= -50)
        .map((asteroid) => asteroid.attr("cx", 600))).subscribe(() => console.log);
    asteroidWrappingState.forEach((asteroid) => asteroid.filter((asteroid) => parseFloat(asteroid.attr("cy")) <= -50)
        .map((asteroid) => asteroid.attr("cy", 600))).subscribe(() => console.log);
    let polygonTag = document.querySelector("polygon"), polygonBBox = polygonTag.getBBox();
    mainAsteroidsObservable.map(({ asteroidArray, shipTransformX, shipTransformY }) => {
        return ({
            asteroidArray: asteroidArray,
            shipTransformX: shipTransformX,
            shipTransformY: shipTransformY
        });
    }).forEach(({ asteroidArray, shipTransformX, shipTransformY, shipRotation }) => asteroidArray.filter((asteroid) => checkShipCollision(Number(shipTransformX), Number(asteroid.attr("cx")), Number(shipTransformY), Number(asteroid.attr("cy")), Number(asteroid.attr("r")), Number(polygonBBox.width - 15), shipTransformX, shipTransformY, shipRotation)).map((e) => {
        return lives;
    }).filter((lives) => (lives == 0)).map(() => {
        gameComplete = true;
        ship.attr("style", "fill:#FF0000;stroke:purple;stroke-width:1");
    })).subscribe(() => console.log);
    keydown$.map(({ keyCode, repeat }) => {
        return ({
            keyCode,
            spaceship: g,
            repeat
        });
    }).filter(({ keyCode, repeat }) => (keyCode == 80 && repeat == false && bomb != 0))
        .map(() => {
        return (arrayOfAsteroids);
    }).map((arrayOfAsteroids) => {
        return (arrayOfAsteroids.forEach((asteroid) => {
            arrayOfAsteroids.splice(arrayOfAsteroids.indexOf(asteroid), 1);
            asteroid.elem.remove();
        }));
    }).subscribe(() => {
        bomb--;
        updateHTMLElements(myScore, lives, bomb);
    });
    function updateHTMLElements(score, lives, bomb) {
        document.getElementById("score").innerHTML = "Score: " + score;
        document.getElementById("lives").innerHTML = "Lives: " + lives;
        document.getElementById("bomb").innerHTML = "Bomb: " + bomb;
    }
}
if (typeof window != 'undefined')
    window.onload = () => {
        asteroids();
    };
//# sourceMappingURL=asteroids.js.map