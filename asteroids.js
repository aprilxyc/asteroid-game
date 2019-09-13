"use strict";
function asteroids() {
    let arrayOfAsteroids = [], arrayOfBullets = [], myScore = [1, 1], lives = 3, bomb = 3, gameComplete = false;
    const mainTimer = Observable.interval(5), asteroidObservable = Observable.interval(1), mainAsteroidsObservable = mainTimer
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
    let polygonTag = document.querySelector("polygon"), polygonBBox = polygonTag.getBBox();
    const keydown$ = Observable.fromEvent(document, 'keydown').map(({ keyCode, key, repeat }) => ({
        asteroidArray: arrayOfAsteroids,
        keyCode,
        key,
        repeat
    })), keyup$ = Observable.fromEvent(document, 'keyup');
    function shipPosObservable() {
        keydown$
            .map(({ key }) => {
            return ({
                key
            });
        }).filter(({ key, keyCode }) => (key == "ArrowRight" || keyCode == 68))
            .flatMap((key) => (Observable.interval(15)
            .takeUntil(keyup$)))
            .subscribe(_ => {
            let transformX = Number(g.elem.transform.baseVal.getItem(0).matrix.e), transformY = Number(g.elem.transform.baseVal.getItem(0).matrix.f), shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle);
            g.attr("transform", `translate(${transformX} ${transformY}) rotate(${shipRotation = shipRotation + 10})`);
        });
        keydown$
            .map(({ key, keyCode }) => {
            return ({
                key,
                spaceship: g
            });
        }).filter(({ key, keyCode }) => (key == "ArrowLeft" || keyCode == 65))
            .flatMap((key) => (Observable.interval(15)
            .takeUntil(keyup$)))
            .subscribe(_ => {
            let transformX = Number(g.elem.transform.baseVal.getItem(0).matrix.e), transformY = Number(g.elem.transform.baseVal.getItem(0).matrix.f), shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle);
            g.attr("transform", `translate(${transformX} ${transformY}) rotate(${shipRotation = shipRotation - 10})`);
        });
        keydown$
            .map(({ key, keyCode }) => {
            return ({
                key: key,
                transformX: Number(g.elem.transform.baseVal.getItem(0).matrix.e),
                transformY: Number(g.elem.transform.baseVal.getItem(0).matrix.f),
                shipRotation: Number(g.elem.transform.baseVal.getItem(1).angle)
            });
        }).filter(({ key, transformX, transformY, shipRotation, keyCode }) => (key == "ArrowUp" || keyCode == 87))
            .map(({ key, transformX, transformY, shipRotation }) => ({
            directionX: Math.cos(Math.PI * (shipRotation - 90) / 180),
            directionY: Math.sin(Math.PI * (shipRotation - 90) / 180)
        }))
            .flatMap(({ directionX, directionY }) => Observable.interval(30)
            .map(thrust => ({
            newX: 300 * directionX / thrust,
            newY: 300 * directionY / thrust
        })))
            .subscribe(({ newX, newY }) => {
            let transformX = Number(g.elem.transform.baseVal.getItem(0).matrix.e), transformY = Number(g.elem.transform.baseVal.getItem(0).matrix.f), shipRotation = Number(g.elem.transform.baseVal.getItem(1).angle);
            g.attr("transform", `translate(${transformX = transformX + newX} ${transformY = transformY + newY}) rotate(${shipRotation})`);
        });
        keydown$
            .map(({ key, keyCode }) => ({
            key,
            transformX: Number(g.elem.transform.baseVal.getItem(0).matrix.e),
            transformY: Number(g.elem.transform.baseVal.getItem(0).matrix.f),
            shipRotation: Number(g.elem.transform.baseVal.getItem(1).angle),
        }))
            .filter(({ key, keyCode }) => (key == " "))
            .subscribe(({ transformX, transformY, shipRotation }) => {
            const rotationRadians = shipRotation * (Math.PI / 180), bullCalculateX = Math.cos(rotationRadians - (90 * (Math.PI / 180))) * 1, bullCalculateY = Math.sin(rotationRadians - (90 * (Math.PI / 180))) * 1;
            let bulletShot = new Elem(svg, 'circle')
                .attr("style", "fill:#ffffff;stroke:#ffffff;stroke-width:2")
                .attr("cx", transformX)
                .attr("cy", transformY)
                .attr("r", 3)
                .attr("bulletDistanceX", bullCalculateX)
                .attr("bulletDistanceY", bullCalculateY);
            arrayOfBullets.push(bulletShot);
        });
    }
    function bulletMovementObservable() {
        mainAsteroidsObservable.subscribe(({ bulletArray }) => {
            bulletArray
                .map((bullet) => bullet
                .attr("cx", Number(bullet.attr("cx")) + Number(bullet.attr("bulletDistanceX")))
                .attr("cy", Number(bullet.attr("cy")) + Number(bullet.attr("bulletDistanceY"))))
                .filter((bull) => (Number(bull.attr("cx")) >= 600) || Number(bull.attr("cy")) >= 600 || Number(bull.attr("cy")) <= 0 || Number(bull.attr("cx")) <= 0)
                .forEach((bull) => {
                bull.elem.remove();
                arrayOfBullets.splice(arrayOfBullets.indexOf(bull), 1);
            });
        });
    }
    function checkBulletCollision(x1, x2, y1, y2, radius1, radius2) {
        return Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))) <= (radius1 + radius2);
    }
    function checkShipCollision(x1, x2, y1, y2, radius1, radius2, shipTransformX, shipTransformY, shipRotation) {
        let lineOfDistance = Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))), radiiSum = radius1 + radius2;
        if (lineOfDistance <= radiiSum) {
            g.attr("transform", `translate(300 300) rotate(300)`);
            lives--;
            updateHTMLElements(myScore, lives, bomb);
            return true;
        }
        return false;
    }
    function getRandomInt(min, max) {
        return (Math.random() + min) * Math.floor(max);
    }
    function asteroidMovementObservable() {
        mainAsteroidsObservable.subscribe(({ asteroidArray }) => {
            asteroidArray.forEach((asteroid) => {
                asteroid
                    .attr("cx", Number(asteroid.attr("directionX")) + Number(asteroid.attr("cx")))
                    .attr("cy", Number(asteroid.attr("directionY")) + Number(asteroid.attr("cy")));
            });
        });
    }
    function asteroidCreationObservable() {
        mainAsteroidsObservable
            .takeUntil(asteroidObservable.filter(timer => timer == 8))
            .subscribe(_ => {
            let asteroidRandomX = getRandomInt(0, 600), asteroidRandomY = getRandomInt(0, 600);
            let asteroid = new Elem(svg, "circle")
                .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
                .attr("cx", asteroidRandomX)
                .attr("cy", asteroidRandomY)
                .attr("r", 50)
                .attr("splitCounter", 3)
                .attr("directionX", getRandomInt(-1, 1))
                .attr("directionY", getRandomInt(-1, 1))
                .attr("id", "circleShape");
            arrayOfAsteroids.push(asteroid);
        });
    }
    function asteroidRespawnObservable() {
        mainAsteroidsObservable
            .filter(({ asteroidArray }) => asteroidArray.length == 0)
            .subscribe(({}) => {
            Observable.interval(10)
                .takeUntil(Observable.interval(15))
                .map(() => {
                let asteroidRandomX = getRandomInt(0, 600), asteroidRandomY = getRandomInt(0, 600), randomDirectionX = getRandomInt(-1, 1), randomDirectionY = getRandomInt(-1, 1);
                const asteroid = new Elem(svg, "circle")
                    .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
                    .attr("cx", asteroidRandomX)
                    .attr("cy", asteroidRandomY)
                    .attr("r", 30)
                    .attr("splitCounter", 3)
                    .attr("directionX", randomDirectionX)
                    .attr("directionY", randomDirectionY);
                arrayOfAsteroids.push(asteroid);
            }).subscribe(_ => { });
        });
    }
    function splitAsteroid(asteroid, asteroidX, asteroidY, asteroidRadius, asteroidSplitCounter) {
        if (asteroid.attr("splitCounter") != 0) {
            let asteroidChildrenOffset = 20, asteroidNewRadius = 10, randomDirectionX = getRandomInt(-1, 1), randomDirectionY = getRandomInt(-1, 1);
            let asteroid1 = new Elem(svg, "circle")
                .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
                .attr("cx", asteroidX + asteroidChildrenOffset)
                .attr("cy", asteroidY + asteroidChildrenOffset)
                .attr("r", asteroidRadius - asteroidNewRadius)
                .attr("splitCounter", asteroidSplitCounter = asteroidSplitCounter - 1)
                .attr("directionX", randomDirectionX)
                .attr("directionY", randomDirectionY);
            arrayOfAsteroids.push(asteroid1);
            let asteroid2 = new Elem(svg, "circle")
                .attr("style", "fill:#171846;stroke:#ffffff;stroke-width:2")
                .attr("cx", asteroidX - asteroidChildrenOffset)
                .attr("cy", asteroidY - asteroidChildrenOffset)
                .attr("r", asteroidRadius - asteroidNewRadius)
                .attr("splitCounter", asteroidSplitCounter = asteroidSplitCounter - 1)
                .attr("directionX", randomDirectionX)
                .attr("directionY", randomDirectionY);
            arrayOfAsteroids.push(asteroid2);
        }
    }
    function asteroidBulletCollisionObservable() {
        mainAsteroidsObservable
            .map(({ bulletArray, asteroidArray, shipTransformX, shipTransformY, shipRotation }) => {
            asteroidArray.forEach((asteroid) => {
                bulletArray.filter((bullet) => (checkBulletCollision(Number(asteroid.attr("cx")), Number(bullet.attr("cx")), Number(asteroid.attr("cy")), Number(bullet.attr("cy")), Number(bullet.attr("r")), Number(asteroid.attr("r")), shipTransformX, shipTransformY, shipRotation)))
                    .forEach((bullet) => {
                    bullet.elem.remove();
                    arrayOfBullets.splice(arrayOfBullets.indexOf(bullet), 1);
                    let scoreAccumulator = Observable.fromArray(myScore)
                        .scan(0, function (acc, x) {
                        return acc + x;
                    }).subscribe(function (x) { myScore = [x, 1]; });
                    updateHTMLElements(myScore, lives, bomb);
                    splitAsteroid(asteroid, Number(asteroid.attr("cx")), Number(asteroid.attr("cy")), Number(asteroid.attr("r")), Number(asteroid.attr("splitCounter")));
                    asteroid.elem.remove();
                    arrayOfAsteroids.splice(arrayOfAsteroids.indexOf(asteroid), 1);
                });
            });
        }).subscribe(_ => { });
    }
    function shipWrappingObservable() {
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
    }
    function asteroidWrappingObservable() {
        let asteroidWrappingState = mainAsteroidsObservable.map(({ asteroidArray }) => {
            return asteroidArray;
        });
        asteroidWrappingState.forEach((asteroid) => asteroid.filter((asteroid) => Number(asteroid.attr("cx")) >= 650)
            .map((asteroid) => asteroid.attr("cx", 0))).subscribe(_ => { });
        asteroidWrappingState.forEach((asteroid) => asteroid.filter((asteroid) => Number(asteroid.attr("cy")) >= 650)
            .map((asteroid) => asteroid.attr("cy", 0))).subscribe(() => { });
        asteroidWrappingState.forEach((asteroid) => asteroid.filter((asteroid) => Number(asteroid.attr("cx")) <= -50)
            .map((asteroid) => asteroid.attr("cx", 600))).subscribe(() => { });
        asteroidWrappingState.forEach((asteroid) => asteroid.filter((asteroid) => parseFloat(asteroid.attr("cy")) <= -50)
            .map((asteroid) => asteroid.attr("cy", 600))).subscribe(() => { });
    }
    function shipCollidingAsteroidObservable() {
        mainAsteroidsObservable.map(({ asteroidArray, shipTransformX, shipTransformY }) => {
            return ({
                asteroidArray: asteroidArray,
                shipTransformX: shipTransformX,
                shipTransformY: shipTransformY
            });
        }).forEach(({ asteroidArray, shipTransformX, shipTransformY, shipRotation }) => asteroidArray
            .filter((asteroid) => checkShipCollision(Number(shipTransformX), Number(asteroid.attr("cx")), Number(shipTransformY), Number(asteroid.attr("cy")), Number(asteroid.attr("r")), Number(polygonBBox.width - 15), shipTransformX, shipTransformY, shipRotation))
            .map(() => {
            return lives;
        }).filter((lives) => (lives == 0))
            .map(() => {
            showGameOver();
        })).subscribe(_ => { });
    }
    function removeCircleCanvas() {
        Array.prototype.slice.call(document.getElementsByTagName("circle")).forEach(function (item) {
            item.remove();
        });
    }
    function bombPowerupObservable() {
        keydown$.map(({ keyCode, repeat }) => {
            return ({
                keyCode,
                repeat
            });
        }).filter(({ keyCode, repeat }) => (keyCode == 80 && repeat == false && bomb != 0))
            .map(() => {
            return (arrayOfAsteroids);
        })
            .forEach((arrayOfAsteroids) => {
            arrayOfAsteroids.splice(0, arrayOfAsteroids.length);
            removeCircleCanvas();
            Observable.interval(15)
                .takeUntil(Observable.interval(200))
                .map(() => {
                const explosion = new Elem(svg, 'circle')
                    .attr("style", "fill:#ea3e58;stroke:#ea3e58;stroke-width:2")
                    .attr("fill-opacity", 0.1)
                    .attr("opacity", 0.2)
                    .attr("cx", 300)
                    .attr("cy", 300)
                    .attr("r", 350);
                Observable.interval(100)
                    .takeUntil(Observable.interval(150))
                    .map(() => {
                    explosion.elem.remove();
                }).subscribe(_ => { });
            }).subscribe(_ => { });
        }).subscribe(_ => {
            bomb--;
            updateHTMLElements(myScore, lives, bomb);
        });
    }
    function updateHTMLElements(score, lives, bomb) {
        document.getElementById("score").innerHTML = "Score: " + score[0];
        document.getElementById("lives").innerHTML = "Lives: " + lives;
        document.getElementById("bomb").innerHTML = "Bomb: " + bomb;
    }
    function showGameOver() {
        gameComplete = true;
        ship.attr("style", "fill:#FF0000;stroke:purple;stroke-width:1");
        const gameOverText = new Elem(svg, 'text')
            .attr('x', 150)
            .attr('y', 300)
            .attr('fill', '#ffffff')
            .attr('font-family', "monospace")
            .attr('font-size', 50)
            .attr("id", "gameOver");
        const scoreText = new Elem(svg, 'text')
            .attr('x', 220)
            .attr('y', 360)
            .attr('fill', '#ffffff')
            .attr('font-family', "monospace")
            .attr('font-size', 20)
            .attr("id", "showScore");
        document.getElementById("gameOver").innerHTML = "GAME OVER";
        document.getElementById("showScore").innerHTML = "YOUR SCORE: " + myScore[0];
    }
    shipPosObservable();
    bulletMovementObservable();
    asteroidMovementObservable();
    asteroidCreationObservable();
    asteroidRespawnObservable();
    asteroidBulletCollisionObservable();
    shipWrappingObservable();
    asteroidWrappingObservable();
    shipCollidingAsteroidObservable();
    bombPowerupObservable();
}
if (typeof window != 'undefined')
    window.onload = () => {
        asteroids();
    };
//# sourceMappingURL=asteroids.js.map