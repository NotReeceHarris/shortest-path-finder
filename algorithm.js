const algorithm = (points) => {

  const path = [];
  
  while (path.length < points.length) {
    const randomPoint = points[Math.floor(Math.random() * points.length)];

    if (path.includes(randomPoint)) {
      continue;
    } else {
    path.push(randomPoint);

    }
    console.log(path)
  }


  path.push(points[0]);
  console.log(path)
  return path;

}