"use strict";
function asteroids() {
    const svg = document.getElementById("canvas");
    let gameTimer = 150, gameComplete = false;
    const gameObservable = Observable.interval(gameTimer).filter(() => !gameComplete);
    const keydown$ = Observable.fromEvent(document, 'keydown');
    const keyup$ = Observable.fromEvent(document, 'keyup');
    let g = new Elem(svg, 'g')
        .attr("transform", "translate(300 300) rotate(300)");
    let shipMove = /translate\((\d+) (\d+)\) rotate\((\d+)\)/.exec(g.attr("transform"));
    let ship = new Elem(svg, 'polygon', g.elem)
        .attr("points", "-15,20 15,20 0,-30")
        .attr("style", "fill:#f4e46c;stroke:#f4e46c;stroke-width:1");
    let asteroid = new Elem(svg, "circle")
        .attr("style", "fill:#9bd5bd;stroke:#9bd5bd;stroke-width:2")
        .attr("cx", 300)
        .attr("cy", 20)
        .attr("r", 50);
    let translateX = Number(shipMove[1]);
    let translateY = Number(shipMove[2]);
    let rotation = Number(shipMove[3]);
    function getRandomInt(min, max) {
        return Math.floor((Math.random() + min) * Math.floor(max));
    }
    function getDirection() {
        return getRandomInt(0, 2) === 0 ? -1 : 1;
    }
    let directionX = getDirection();
    let directionY = getDirection();
    let velocityX = getRandomInt(1, 8);
    let velocityY = getRandomInt(1, 8);
    gameObservable.subscribe(() => {
        asteroid.attr("cx", directionX * velocityX + Number(asteroid.attr("cx")));
        asteroid.attr("cy", directionY * velocityY + Number(asteroid.attr("cy")));
    });
    gameObservable
        .map(() => ({
        asteroidX: Number(asteroid.attr("cx")),
        asteroidY: Number(asteroid.attr("cy")),
        asteroidR: Number(asteroid.attr("r"))
    }))
        .filter(({ asteroidX }) => ((asteroidX > 600 + 10)))
        .subscribe(() => {
        asteroid.attr("cx", -10);
    });
    gameObservable
        .map(() => ({
        asteroidX: Number(asteroid.attr("cx")),
        asteroidY: Number(asteroid.attr("cy")),
        asteroidR: Number(asteroid.attr("r"))
    }))
        .filter(({ asteroidX }) => ((asteroidX < -10)))
        .subscribe(() => {
        asteroid.attr("cx", 600 + 10);
    });
    gameObservable
        .map(() => ({
        asteroidX: Number(asteroid.attr("cx")),
        asteroidY: Number(asteroid.attr("cy")),
        asteroidR: Number(asteroid.attr("r"))
    }))
        .filter(({ asteroidY }) => ((asteroidY > 600 + 10)))
        .subscribe(() => {
        asteroid.attr("cy", -10);
    });
    gameObservable
        .map(() => ({
        asteroidX: Number(asteroid.attr("cx")),
        asteroidY: Number(asteroid.attr("cy")),
        asteroidR: Number(asteroid.attr("r"))
    }))
        .filter(({ asteroidX }) => ((asteroidX < -10)))
        .subscribe(() => {
        asteroid.attr("cy", 600 + 10);
    });
    keydown$
        .map(({ key }) => {
        return key;
    })
        .filter((key) => (key == "ArrowLeft"))
        .subscribe(() => {
        g.attr("transform", `translate(${translateX} ${translateY}) rotate(${rotation = rotation - 10})`);
    });
    keydown$
        .map(({ key }) => {
        return key;
    })
        .filter((key) => (key == "ArrowRight"))
        .subscribe(() => {
        g.attr("transform", `translate(${translateX} ${translateY}) rotate(${rotation = rotation + 10})`);
    });
    keydown$
        .map(({ key }) => {
        return key;
    })
        .filter((key) => key == "ArrowUp")
        .map((key) => ({ vx: Math.cos(Math.PI * (rotation - 90) / 180), vy: Math.sin(Math.PI * (rotation - 90) / 180) }))
        .flatMap(({ vx, vy }) => Observable.interval(50)
        .map(t => ({ x: 300 * vx / t, y: 300 * vy / t })))
        .subscribe(({ x, y }) => {
        g.attr("transform", `translate(${translateX = translateX + x} ${translateY = translateY + y}) rotate(${rotation})`);
    });
    let bulletsArray = [];
    keydown$
        .map(({ key }) => {
        return key;
    })
        .filter((key) => (key == " "))
        .subscribe((e) => {
        const rotationRadians = rotation * (Math.PI / 180);
        const bulletDistanceX = Math.cos(rotationRadians - (90 * (Math.PI / 180))) * 10;
        const bulletDistanceY = Math.sin(rotationRadians - (90 * (Math.PI / 180))) * 10;
        let bulletShot = new Elem(svg, 'circle')
            .attr("style", "fill:#ffffff;stroke:#ffffff;stroke-width:2")
            .attr("cx", translateX)
            .attr("cy", translateY)
            .attr("r", 5);
        bulletsArray.push(bulletShot);
        let currentState = Observable.interval(100).map(x => ({ x, currBullet: bulletShot }));
        currentState
            .filter((currBullet) => Number(currBullet.currBullet.attr("cx")) > 600 || (Number(currBullet.currBullet.attr("cy")) > 600) || (Number(currBullet.currBullet.attr("cy")) < 0) || Number(currBullet.currBullet.attr("cx")) < 0)
            .subscribe((currBullet) => {
            currBullet.currBullet.elem.remove();
        });
        currentState
            .filter((currBullet) => Number(currBullet.currBullet.attr("cx")) <= 600 && (Number(currBullet.currBullet.attr("cy")) <= 600) && (Number(currBullet.currBullet.attr("cy")) >= 0) && Number(currBullet.currBullet.attr("cx")) >= 0)
            .subscribe((currBullet) => {
            let bulletX = Number(currBullet.currBullet.attr("cx"));
            let bulletY = Number(currBullet.currBullet.attr("cy"));
            currBullet.currBullet.attr("cx", bulletDistanceX + bulletX);
            currBullet.currBullet.attr("cy", bulletDistanceY + bulletY);
        });
    });
    function checkCollision(x1, x2, y1, y2, radius1, radius2) {
        let lineOfDistance = Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)));
        let sumOfRadii = (radius1 + radius2);
        console.log(lineOfDistance <= sumOfRadii);
        return lineOfDistance <= sumOfRadii;
    }
    gameObservable.map((x) => ({
        time: x,
        bulletArray: bulletsArray
    })).map((e) => {
        return e.bulletArray.filter((bulletArray) => (Number(bulletArray.attr("cx")) <= 600 && (Number(bulletArray.attr("cy")) <= 600) && (Number(bulletArray.attr("cy")) >= 0) && Number(bulletArray.attr("cx")) >= 0));
    }).subscribe(array => {
        bulletsArray = array;
    });
    gameObservable.map(x => ({
        x,
        currAsteroid: asteroid,
        bulletArray: bulletsArray
    })).map((e) => {
        let asteroidXCircle = Number(e.currAsteroid.attr("cx"));
        let asteroidYCircle = Number(e.currAsteroid.attr("cy"));
        let asteroidRadius = Number(e.currAsteroid.attr("r"));
        return e.bulletArray.filter((bullet) => (checkCollision(Number(bullet.attr("cx")), asteroidXCircle, Number(bullet.attr("cy")), asteroidYCircle, asteroidRadius, Number(bullet.attr("r")))));
    })
        .subscribe((returnArray) => {
        returnArray.forEach((element) => element.elem.remove());
        console.log(returnArray);
    });
}
if (typeof window != 'undefined')
    window.onload = () => {
        asteroids();
    };
//# sourceMappingURL=asteroids.js.map