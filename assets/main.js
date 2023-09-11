const start = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const canvas = document.getElementById('canvas');
const solutionsBtn = document.getElementById("solutions");
const antCount = document.getElementById("ant-count");
const pointsInp = document.getElementById("points")
const durationElem = document.getElementById("duration");
const algorithmElem = document.getElementById("algorithm");
const searchedElem = document.getElementById("searched");
const progressElem = document.getElementById("progress");
const distanceElem = document.getElementById("disatance");
const bestDistanceElem = document.getElementById("best-disatance");

var radius = 0;
var stroke = 0;

if (window.innerWidth >= 768) {
    canvas.style.width = canvas.getBoundingClientRect().height + 'px';
    radius = 10;
    stroke = 3;
} else {
    canvas.style.height = canvas.getBoundingClientRect().width + 'px';
    radius = 20;
    stroke = 6;
}

canvas.width = 2000;
canvas.height = 2000;

var pointsCount = pointsInp.value;
var points = setup(canvas.width, canvas.height, pointsCount);

var path = [];
var bestPath = [];

var startTime;
var runTime;
var solutions = factorialize(pointsCount - 1) / 2;
var algorithm = algorithmElem.value;
var nomOfAnts = antCount.value;

var refresh = true;
var running = false;
var allowRun = true;
const ctx = canvas.getContext('2d');

(() => {
    solutionsBtn.textContent = solutions;

    pointsInp.addEventListener("change", (e) => {
        // Get the new value of the "points" input element and store it in the "pointsCount" variable.
        pointsCount = e.target.value;
    
        // Calculate the number of possible solutions based on the number of points and update the HTML element "solutions" accordingly.
        solutions = factorialize(pointsCount - 1) / 2;
        solutionsBtn.textContent = solutions;
    
        // Generate a new set of random points on the canvas with the specified count and update the "points" variable.
        points = setup(canvas.width, canvas.height, pointsCount);
    
        // Reset the "path" variable to an empty array.
        path = [];
    
        // Plot the newly generated points on the canvas.
        plot(points);
    });

    antCount.addEventListener("change", (e) => {
        // Get the new value of the "antCount" input element and store it in the "nomOfAnts" variable.
        nomOfAnts = e.target.value;
    });

    algorithmElem.addEventListener('change', (e) => {
        // Reset the "path" variable to an empty array.
        path = [];
    
        // Clear the "ants" array (if applicable) by setting its length to 0.
        ants.length = 0;
    
        // Set the "refresh" flag to true, indicating that the canvas needs to be refreshed.
        refresh = true;
    
        // Update the "algorithm" variable with the selected algorithm value.
        algorithm = e.target.value;
    });

    pointsInp.addEventListener("change", (e) => {
        // Get the new value of the "pointsInp" input element and store it in the "pointsCount" variable.
        pointsCount = e.target.value;
    
        // Calculate the number of possible solutions based on the new number of points and update the "solutionsBtn" text content.
        solutions = factorialize(pointsCount - 1) / 2;
        solutionsBtn.textContent = solutions;
    
        // Generate a new set of random points on the canvas with the specified count and update the "points" variable.
        points = setup(canvas.width, canvas.height, pointsCount);
    
        // Reset the "path" variable to an empty array.
        path = [];
    
        // Plot the newly generated points on the canvas.
        plot(points);
    });
    

    start.addEventListener('click', async () => {
        // Clear the console for a clean display.
        console.clear();

        // Check if there are fewer than 3 points, which is the minimum required to run the algorithm.
        if (points.length < 3) {
            alert('You need at least 3 points to run the algorithm');
            return;
        }

        // Set the "running" and "allowRun" flags to true to indicate that the algorithm is running and can continue.
        running = true;
        allowRun = true;

        // Hide the "start" button and show the "stop" button.
        start.classList.add('hidden');
        stopBtn.classList.remove('hidden');

        // Initialize variables to measure the algorithm's runtime.
        runTime = null;
        startTime = performance.now();

        // Depending on the selected algorithm, execute the corresponding algorithm.
        if (algorithm == 'lucky-path') {
            for (let i = 0; i < solutions; i++) {
                if (!allowRun) break;
                searchedElem.textContent = (i + 1);
                progressElem.textContent = ((i + 1) / solutions * 100).toFixed(2) + ' %';
                // Introduce a small delay for visual progress updates.
                await new Promise(r => setTimeout(r, 0.01));
                // Execute the luckyPathAlgorithm and update the "path" variable.
                path = luckyPathAlgorithm(points);
                refresh = true;
            }
        } else if (algorithm == 'ant-colony') {
            for (let i = 0; i < solutions; i++) {
                if (!allowRun) break;
                // Introduce a small delay for visual progress updates.
                await new Promise(r => setTimeout(r, 1));
                // Clear the "path" array and execute the antColonyAlgorithm to update the "path" variable.
                path.length = 0;
                path = antColonyAlgorithm(points, canvas.width, canvas.height);
                refresh = true;
            }
        }

        // Set the "running" flag to false to indicate that the algorithm has finished.
        running = false;

        // If a bestPath exists, update the "path" variable with it.
        if (bestPath.length != 0) path = bestPath;

        // Calculate and display the total runtime of the algorithm.
        runTime = ((performance.now() - startTime) / 1000).toFixed(2);

        // Hide the "stop" button and show the "start" button.
        start.classList.remove('hidden');
        stopBtn.classList.add('hidden');
    });

    stopBtn.addEventListener('click', () => {
        // Set the "allowRun" flag to false, indicating that the algorithm should stop.
        allowRun = false;

        // Hide the "stopBtn" and show the "start" button to allow restarting the algorithm.
        start.classList.remove('hidden');
        stopBtn.classList.add('hidden');
    });


    setInterval(function() {
        // Check if the algorithm is currently running and update the duration element accordingly.
        if (running) {
            // If the algorithm is running and the start time is defined but the runTime is not, calculate and display the elapsed time.
            durationElem.textContent = (startTime != null && runTime == null) ? ((performance.now() - startTime) / 1000).toFixed(2) + ' s' : runTime + ' s';
        }

        // Toggle the visibility of the antCount element based on the selected algorithm.
        if (algorithm == 'ant-colony') {
            // If the selected algorithm is 'ant-colony', show the antCount element.
            antCount.parentElement.classList.remove('hidden');
        } else {
            // Otherwise, hide the antCount element.
            antCount.parentElement.classList.add('hidden');
        }

        // Check if there are points to plot and if a refresh is needed.
        if (points.length > 0 && refresh) {
            // Plot the points, path, and ants (if available) on the canvas and reset the refresh flag.
            plot(points, path, ants);
            refresh = false;
        }
    }, 1);

})();

function setup(w, h, p, minDistance = 50) {
    // Initialize an empty array to store the generated points.
    const points = [];
    
    // Function to calculate the distance between two points.
    const calculateDistance = (point1, point2) => {
        const dx = point1[0] - point2[0];
        const dy = point1[1] - point2[1];
        return Math.sqrt(dx * dx + dy * dy);
    };
    
    // Function to check if a new point is too close to any existing points.
    const isTooClose = (newPoint, existingPoints, minDistance) => {
        for (const existingPoint of existingPoints) {
            if (calculateDistance(newPoint, existingPoint) < minDistance) {
                return true;
            }
        }
        return false;
    };
    
    // Function to check if a new point is too close to the edge of the canvas.
    const isTooCloseToEdge = (newPoint, w, h, minDistance) => {
        const [x, y] = newPoint;
        return x < minDistance || x > w - minDistance || y < minDistance || y > h - minDistance;
    };
    
    // Function to generate a random integer between min and max values.
    const randomPoint = (min, max) => {  
        return Math.floor(
          Math.random() * (max - min) + min
        );
    };

    // Generate 'p' random points while ensuring they meet the criteria.
    while (points.length < p) {
        const newPoint = [randomPoint(0, w), randomPoint(0, h)];
        if (!isTooClose(newPoint, points, minDistance) && !isTooCloseToEdge(newPoint, w, h, minDistance)) {
            points.push(newPoint);
        }
    }
    
    // Log the generated points to the console for debugging or visualization.
    console.log(points);
    
    // Return the array of generated points.
    return points;
};

function findTotalDistance(path) {
    // Initialize a variable to keep track of the total distance.
    let totalDistance = 0;
    
    // Iterate through each point in the path, except for the last point.
    for (let i = 0; i < path.length - 1; i++) {
        // Calculate the distance between the current point and the next point in the path
        // using the Euclidean distance formula (Pythagorean theorem).
        // The formula calculates the length of the straight line between two points in 2D space.
        const deltaX = path[i + 1][0] - path[i][0]; // Horizontal distance
        const deltaY = path[i + 1][1] - path[i][1]; // Vertical distance
        const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        
        // Add the calculated distance to the total distance.
        totalDistance += distance;
    }
    
    // Round the total distance to the nearest whole number (assumes distance is in km).
    return Math.round(totalDistance);
};

function plot(points, path=[], antPos=[]) {


    const plotPoint = (x, y, color) => {
        // Calculate the aspect ratio of the canvas to ensure a circular shape.
        const canvasAspect = ctx.canvas.width / ctx.canvas.height;
        
        // Define the radius of the circle along the X and Y axes.
        const circleRadiusX = radius;
        const circleRadiusY = radius / canvasAspect;
        
        // Begin drawing a path on the canvas.
        ctx.beginPath();
        
        // Draw an ellipse (circle) at the specified coordinates (x, y) with the given radii.
        ctx.ellipse(x, y, circleRadiusX, circleRadiusY, 0, 0, Math.PI * 2);
        
        // Set the fill color to the provided color.
        ctx.fillStyle = color;
        
        // Fill the ellipse (circle) with the specified color.
        ctx.fill();
    };

    const plotPath = (points) => {
        // Begin drawing a path on the canvas.
        ctx.beginPath();
        
        // Move the drawing pen to the starting point of the path.
        ctx.moveTo(points[0][0], points[0][1]);
        
        // Iterate through the points and draw lines connecting them.
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        
        // Set the line width to the specified stroke value.
        ctx.lineWidth = stroke;
        
        // Set the line color to blue (#9ca3af).
        ctx.strokeStyle = '#9ca3af';
        
        // Stroke (draw) the path on the canvas.
        ctx.stroke();
    };

    // Clear the canvas to remove any previous drawings.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Check if the selected algorithm is 'ant-colony'.
    if (algorithm == 'ant-colony') {
        // If 'ant-colony' algorithm is selected, plot each path separately.
        for (let p = 0; p < path.length; p++) {
            plotPath(path[p]);
        }
    } else {
        // If a different algorithm is selected:
        
        // Check if there is a path to plot.
        if (path.length > 0) {
            // Update the displayed total distance based on the current path.
            distanceElem.textContent = findTotalDistance(path) + ' km';
            // Plot the current path.
            plotPath(path);
        };

        // Check if there is no best path yet or if the current path is better than the best.
        if (bestPath.length == 0 || findTotalDistance(path) < findTotalDistance(bestPath)) {
            // Update the best path with the current path.
            bestPath = path;
            // Update the displayed best distance.
            bestDistanceElem.textContent = findTotalDistance(bestPath) + ' km';
        }
    }

    // Plot each point in white color.
    for (var i = 0; i < points.length; i++) {
        plotPoint(points[i][0], points[i][1], 'white');
    }

    // Plot each ant position in red color (if provided).
    for (var i = 0; i < antPos.length; i++) {
        plotPoint(antPos[i][0], antPos[i][1], 'red');
    }
};

function factorialize(num) {
    // Check if the input number is less than 0 (invalid input).
    if (num < 0) {
        return -1;
    } 
    // Base case: If the input number is 0, the factorial is 1.
    else if (num === 0) {
        return 1;
    } 
    // Recursive case: Calculate the factorial by multiplying the number with the factorial of (num - 1).
    else {
        return num * factorialize(num - 1);
    }
}