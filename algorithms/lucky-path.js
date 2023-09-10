const luckyPathAlgorithm = (points) => {

  const path = [points[0]];
  
  while (path.length < points.length) {
    const randomPoint = points[Math.floor(Math.random() * points.length)];

    if (path.includes(randomPoint)) {
      continue;
    } else {
    path.push(randomPoint);

    }
  }

  path.push(points[0]);
  return path;
}