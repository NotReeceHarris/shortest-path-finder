function calcDistance(point1, point2) {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  function algorithm(points) {
    if (points.length <= 1) {
      return points;
    }
  
    let shortestRoute = points.slice(); // Copy the array to avoid modifying the original
    let shortestDistance = calculateTotalDistance(shortestRoute);
  
    function calculateTotalDistance(route) {
      let totalDistance = 0;
      for (let i = 0; i < route.length - 1; i++) {
        totalDistance += calcDistance(route[i], route[i + 1]);
      }
      return totalDistance;
    }
  
    function permuteRoute(route, startIndex) {
      if (startIndex === route.length - 1) {
        const currentDistance = calculateTotalDistance(route);
        if (currentDistance < shortestDistance) {
            shortestDistance = currentDistance;
            shortestRoute = route.slice();
        }
        return;
    }

    for (let i = startIndex; i < route.length; i++) {
        [route[startIndex], route[i]] = [route[i], route[startIndex]]; // Swap elements
        permuteRoute(route, startIndex + 1);
        [route[startIndex], route[i]] = [route[i], route[startIndex]]; // Restore the original order
        }
    }
  
    permuteRoute(shortestRoute, 0);

    shortestRoute.push(shortestRoute[0]); // Add the first point to the end of the array to complete the route

    return shortestRoute;
  }