const ants = [];
const dstPower = 2;

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