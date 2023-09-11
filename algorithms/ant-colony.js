const ants = [];
const dstPower = 2;


function extractPheromoneLines(antPaths, points) {
    var pheromoneLines = {}

    for (let path = 0; path < antPaths.length; path++) {
        for (let p = 0; p < antPaths[path].length-1; p++) {
            const pathName = [`${antPaths[path][p]}-${antPaths[path][p+1]}`, `${antPaths[path][p+1]}-${antPaths[path][p]}`]
            if (pathName[0] in pheromoneLines) {
                pheromoneLines[pathName[0]].count += 1 
            } else {
                if (pathName[1] in pheromoneLines) {
                    pheromoneLines[pathName[1]].count += 1 
                } else {
                    pheromoneLines[pathName[0]] = {
                        path: [antPaths[path][p], antPaths[path][p+1]],
                        count: 1
                    }
                }
            }
        }
    }

    const dataArray = Object.entries(pheromoneLines);
    dataArray.sort((a, b) => b[1].count - a[1].count);

    pheromoneLines = [];

    dataArray.slice(0, points.length).forEach((path) => {
        pheromoneLines.push(path[1].path)
    });

    return pheromoneLines

}

const antColonyAlgorithm = (points, w, h) => {

    ants.length = 0;
    const path = [];

    while (ants.length != nomOfAnts) {
        const ant = [Math.random() * w, Math.random() * h];
        ants.push(ant);
    }

    const calculateDistance = (point1, point2) => {
        return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
    };

    for (let a = 0; a < nomOfAnts; a++) {
        const visitedPoints = [];
        var ant = ants[a];
        var antPath = [];

        for (let loops = 0; loops < points.length; loops++) {
            var desirabilityPoints = [];
        
            for (let p = 0; p < points.length; p++) {
                if (visitedPoints.includes(points[p])) continue;
                const desirability = Math.pow(1 / calculateDistance(ant, points[p]), dstPower);
                if (desirability > 0.000007) desirabilityPoints.push({ point: points[p], desirability: desirability });
            }

            if (desirabilityPoints.length == 0) {
                var closestPoint = []
                var closestPointDistance = null
                for (let p = 0; p < points.length; p++) {
                    if (visitedPoints.includes(points[p])) continue;
                    const distance = calculateDistance(ant, points[p]);
                    if (closestPointDistance == null || distance < closestPointDistance) {
                        closestPointDistance = distance;
                        closestPoint = points[p];
                    }
                }
                desirabilityPoints.push({ point: closestPoint, desirability: 1 });
            }
            
            const chosenPoint = desirabilityPoints[Math.floor(Math.random() * desirabilityPoints.length)].point
            antPath.push([ant, chosenPoint])

            visitedPoints.push(chosenPoint);
            ant = chosenPoint;
        }
        antPath.push([antPath[antPath.length-1][1], antPath[0][1]])

        path.push(...antPath);
    }
    return path;
}

const antColonyAlgorithmEvaluation = (paths, points) => {

    const splitArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
          result.push(arr.slice(i, i + size));
        }
      
        return result;
      }
    
    const antPaths = [];

    for (let p = 0; p < paths.length; p++) {
        for (let a = 0; a < nomOfAnts; a++) {
            const pathTaken = splitArray(paths[p], paths[p].length/nomOfAnts)
            for (let pt = 0; pt < pathTaken.length; pt++) {
                pathTaken[pt].shift()
            }
            antPaths.push(pathTaken)
        }
    }

    const formattedAntPath = [];

    for (let ps = 0; ps < antPaths.length; ps++) {
        for (let p = 0; p < antPaths[ps].length; p++) {
            const steps = [];
            for (let st = 0; st < antPaths[ps][p].length; st++) {
                steps.push(antPaths[ps][p][st][0])
                if (st+1 === antPaths[ps][p].length) steps.push(antPaths[ps][p][st][1]);
            }
            formattedAntPath.push(steps)
        }
    }
    
    return extractPheromoneLines(formattedAntPath, points)
} 