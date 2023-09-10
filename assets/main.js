document.getElementById('canvas').style.width = document.getElementById('canvas').getBoundingClientRect().height + 'px'

const start = document.getElementById("start");
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var pointsCount = document.getElementById("points").value;
var points = setup(canvas.width, canvas.height, pointsCount);
var solutions = factorialize(pointsCount - 1) / 2
var path = [];
var bestPath = [];
var startTime;
var runTime;
var refresh = true;
var running = false;
var allowRun = true;
var algorithm = document.getElementById("algorithm").value;
var nomOfAnts = document.getElementById("ant-count").value;

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setup(w, h, p, minDistance = 30) {
    // This code has no impact on the path algorithms its just for visual purposes to make sure the points are not too close to each other or the edge of the canvas
    const points = [];
    const calculateDistance = (point1, point2) => {
        const dx = point1[0] - point2[0];
        const dy = point1[1] - point2[1];
        return Math.sqrt(dx * dx + dy * dy);
    };
    const isTooClose = (newPoint, existingPoints, minDistance) => {
        for (const existingPoint of existingPoints) {
            if (calculateDistance(newPoint, existingPoint) < minDistance) {
                return true;
            }
        }
        return false;
    };
    const isTooCloseToEdge = (newPoint, w, h, minDistance) => {
        const [x, y] = newPoint;
        return x < minDistance || x > w - minDistance || y < minDistance || y > h - minDistance;
    };
    while (points.length < p) {
        const newPoint = [Math.random() * w, Math.random() * h];
        if (!isTooClose(newPoint, points, minDistance) && !isTooCloseToEdge(newPoint, w, h, minDistance)) {
            points.push(newPoint);
        }
    }
    return points;
};

function plotPath(points) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#9ca3af'; // Set the line color to blue
    ctx.stroke();
}

function plotPoint(x, y, color) {
    const radius = 12;
    const canvasAspect = ctx.canvas.width / ctx.canvas.height;
    const circleRadiusX = radius;
    const circleRadiusY = radius / canvasAspect;
    ctx.beginPath();
    ctx.ellipse(x, y, circleRadiusX, circleRadiusY, 0, 0, Math.PI * 2);
    ctx.fillStyle = color; // Set the point color to red
    ctx.fill();
}

function findTotalDistance(path) {

    const calculateDistance = (point1, point2) => {
        return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
    };

    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        totalDistance += calculateDistance(path[i], path[i + 1]);
    }
    return Math.round(totalDistance);
};

function plot(points, path, antPos=[]) {
    clearCanvas()

    if (algorithm == 'ant-colony') {
        for (let p = 0; p < path.length; p++) {
            plotPath(path[p])
        }
    } else {
        if (path.length > 0) {
            document.getElementById("disatance").textContent = findTotalDistance(path) + ' km'
            plotPath(path)
        };
    
        if (bestPath.length == 0 || findTotalDistance(path) < findTotalDistance(bestPath)) {
            bestPath = path;
            document.getElementById("best-disatance").textContent = findTotalDistance(bestPath) + ' km'
        }
    }

    for (var i = 0; i < points.length; i++) {
        plotPoint(points[i][0], points[i][1], 'white');
    }

    for (var i = 0; i < antPos.length; i++) {
        plotPoint(antPos[i][0], antPos[i][1], 'red');
    }
}

function factorialize(num) {
    if (num < 0) return -1;
    else if (num == 0) return 1;
    else return (num * factorialize(num - 1));
}

document.getElementById("points").addEventListener("change", (e) => {
    pointsCount = e.target.value;

    solutions = factorialize(pointsCount - 1) / 2;
    document.getElementById("solutions").textContent = solutions;

    points = setup(canvas.width, canvas.height, pointsCount);
    path = [];
    plot(points, path);
});

document.getElementById("ant-count").addEventListener("change", (e) => {
    nomOfAnts = e.target.value;
});

document.getElementById('algorithm').addEventListener('change', () => {
    path = [];
    ants.length = 0;
    refresh = true;
    algorithm = document.getElementById("algorithm").value;
})

document.getElementById("points").addEventListener("change", (e) => {
    pointsCount = e.target.value;

    solutions = factorialize(pointsCount - 1) / 2;
    document.getElementById("solutions").textContent = solutions;

    points = setup(canvas.width, canvas.height, pointsCount);
    path = [];
    plot(points, path);
});

document.getElementById("solutions").textContent = solutions;

document.getElementById("start").addEventListener('click', async() => {

    console.clear();

    if (points.length < 3) {
        alert('You need at least 3 points to run the algorithm');
        return;
    }

    running = true;
    allowRun = true;

    document.getElementById("start").classList.add('hidden');
    document.getElementById("stop").classList.remove('hidden');

    runTime = null;
    startTime = performance.now();

    if (algorithm == 'lucky-path') {
        for (let i = 0; i < solutions; i++) {
            if (!allowRun) break;
            await new Promise(r => setTimeout(r, 0.01));
            document.getElementById("searched").textContent = (i + 1) + '/' + solutions;
            document.getElementById("progress").textContent = ((i + 1) / solutions * 100).toFixed(2) + ' %';
            path = luckyPathAlgorithm(points);
            refresh = true;
        }
    } else if (algorithm == 'ant-colony') {

        for (let i = 0; i < solutions; i++) {
            if (!allowRun) break;
            await new Promise(r => setTimeout(r, 1));
            path.length = 0;
            path = antColonyAlgorithm(points, canvas.width, canvas.height);
            refresh = true;
        }
    }
    running = false;

    if (bestPath.length != 0) path = bestPath;
    runTime = ((performance.now() - startTime) / 1000).toFixed(2);

    document.getElementById("start").classList.remove('hidden');
    document.getElementById("stop").classList.add('hidden');
})

document.getElementById("stop").addEventListener('click', () => {
    allowRun = false;
    document.getElementById("start").classList.remove('hidden');
    document.getElementById("stop").classList.add('hidden');
})

setInterval(function() {
    if (running) {
        document.getElementById("duration").textContent = (startTime != null && runTime == null) ? ((performance.now() - startTime) / 1000).toFixed(2) + ' s' : runTime + ' s'
    }

    if (algorithm == 'ant-colony' ) {
        document.getElementById('ant-count').parentElement.classList.remove('hidden');
    } else {
        document.getElementById('ant-count').parentElement.classList.add('hidden');
    }

    if (points.length > 0 && refresh) {
        plot(points, path, ants);
        refresh = false;
    }
}, 1);