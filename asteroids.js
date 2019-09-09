"use strict";
function asteroids() {
    const svg = document.getElementById("canvas");
    let gameTimer = 150, gameComplete = false;
    const gameObservable = Observable.interval(gameTimer).filter(() => !gameComplete);
    const asteroidObservable = Observable.interval(1);
    const asteroidsScores = {
        score: 0
    };
    const keydown$ = Observable.fromEvent(document, 'keydown');
    const keyup$ = Observable.fromEvent(document, 'keyup');
    let g = new Elem(svg, 'g')
        .attr("transform", "translate(300 300) rotate(300)");
    let shipMove = /translate\((\d+) (\d+)\) rotate\((\d+)\)/.exec(g.attr("transform"));
    let translateX = Number(shipMove[1]);
    let translateY = Number(shipMove[2]);
    let rotation = Number(shipMove[3]);
    let ship = new Elem(svg, 'polygon', g.elem)
        .attr("points", "-15,20 15,20 0,-30")
        .attr("style", "fill:#f4e46c;stroke:#f4e46c;stroke-width:1");
    let asteroidArray = [];
    let asteroidIndex = 0;
    asteroidObservable
        .takeUntil(asteroidObservable.filter(i => i == 5))
        .subscribe((e) => {
        let asteroidRandomX = getRandomInt(0, 250);
        let asteroidRandomY = getRandomInt(0, 400);
        let asteroid = new Elem(svg, "circle")
            .attr("style", "fill:#9bd5bd;stroke:#9bd5bd;stroke-width:2")
            .attr("cx", asteroidRandomX)
            .attr("cy", asteroidRandomY)
            .attr("r", 50)
            .attr("index", asteroidIndex++);
        asteroidArray.push(asteroid);
    });
    function getRandomInt(min, max) {
        return Math.floor((Math.random() + min) * Math.floor(max));
    }
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
            .attr("r", 4);
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
        let lineOfDistance = Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))), sumOfRadii = (radius1 + radius2);
        return lineOfDistance <= sumOfRadii;
    }
    gameObservable.map((x) => ({
        time: x,
        bulletArray: bulletsArray
    })).map((e) => {
        return e.bulletArray.filter((bulletArray) => (Number(bulletArray.attr("cx")) <= 600 && (Number(bulletArray.attr("cy")) <= 600) && (Number(bulletArray.attr("cy")) >= 0) && Number(bulletArray.attr("cx")) >= 0));
    }).subscribe(array => (bulletsArray = array));
    gameObservable.map(x => ({
        x,
        myBulletArray: bulletsArray,
        myAsteroidArray: asteroidArray
    })).map(({ x, myBulletArray, myAsteroidArray }) => (myAsteroidArray.filter(asteroid => (myBulletArray.filter(bullet => (checkCollision(Number(bullet.attr("cx")), Number(asteroid.attr("cx")), Number(bullet.attr("cy")), Number(asteroid.attr("cy")), Number(asteroid.attr("r")), Number(bullet.attr("r")))))
        .map(bullet => (bullet.elem.remove()))))))
        .subscribe((returnArray) => (console.log));
    gameObservable.map(x => ({
        x,
        myBulletArray: bulletsArray,
        myAsteroidArray: asteroidArray
    })).map(({ x, myBulletArray, myAsteroidArray }) => (myBulletArray.filter(bullet => (myAsteroidArray.filter(asteroid => (checkCollision(Number(bullet.attr("cx")), Number(asteroid.attr("cx")), Number(bullet.attr("cy")), Number(asteroid.attr("cy")), Number(asteroid.attr("r")), Number(bullet.attr("r")))))
        .map(asteroid => (asteroidArray.splice(asteroid.attr("index"), 1) && asteroid.elem.remove()))))))
        .subscribe((returnArray) => (console.log(asteroidArray)));
}
if (typeof window != 'undefined')
    window.onload = () => {
        asteroids();
    };
//# sourceMappingURL=asteroids.js.map