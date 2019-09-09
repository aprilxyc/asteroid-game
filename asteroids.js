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
    let asteroid2 = new Elem(svg, "circle")
        .attr("style", "fill:#9bd5bd;stroke:#9bd5bd;stroke-width:2")
        .attr("cx", 400)
        .attr("cy", 200)
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
        .filter((key) => (key == "ArrowUp"))
        .subscribe(() => {
        const rotationRadians = rotation * (Math.PI / 180);
        const distanceX = Math.cos(rotationRadians - (90 * (Math.PI / 180))) * 10;
        const distanceY = Math.sin(rotationRadians - (90 * (Math.PI / 180))) * 10;
        g.attr("transform", `translate(${translateX = translateX + distanceX} ${translateY = translateY + distanceY}) rotate(${rotation})`);
    });
    let bulletsArray = [];
    keydown$
        .map(({ key }) => {
        return key;
    })
        .filter((key) => (key == " "))
        .subscribe((e) => {
        console.log(e);
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
        return e.bulletArray.forEach((bullet) => {
            let asteroidXCircle = Number(e.currAsteroid.attr("cx"));
            let asteroidYCircle = Number(e.currAsteroid.attr("cy"));
            let asteroidRadius = Number(e.currAsteroid.attr("r"));
            let bulletXCircle = Number(bullet.attr("cx"));
            let bulletYCircle = Number(bullet.attr("cy"));
            let bulletRadius = Number(bullet.attr("r"));
            let lineDistance = Math.sqrt(Math.pow((asteroidXCircle - bulletXCircle), 2) + Math.pow((asteroidYCircle - bulletYCircle), 2));
            return bulletXCircle;
        });
    }).subscribe((bulletXCircle) => console.log(bulletXCircle));
}
if (typeof window != 'undefined')
    window.onload = () => {
        asteroids();
    };
//# sourceMappingURL=asteroids.js.map