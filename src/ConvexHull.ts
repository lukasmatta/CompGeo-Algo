import { SvgCircle, SvgInHtml, Canvas } from "./Canvas";

export class ConvexHull {
  canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  /**
   * Creates convex hull and paints convex hull points with green color
   * @param points array of points
   */
  public createConvexHull(): void {
    this.removeLines();
    const points = this.canvas.getPoints();
    console.log("points", points);
    const convexHull: SvgCircle[] = [];
    let leftmostPoint: SvgCircle = points[0];

    // Find the leftmost point
    points.slice(1).forEach((p: SvgCircle) => {
      if (Number(p.getAttribute("cx")) < Number(leftmostPoint.getAttribute("cx"))) {
        leftmostPoint = p;
      }
    });

    let pointOnHull: SvgCircle = leftmostPoint;
    let endpoint: SvgCircle;
    let i = 0;
    do {
      // pointOnHull.style.fill = "green";
      convexHull.push(pointOnHull);
      endpoint = points[0];

      for (let j = 0; j < points.length; j++) {
        if (this.isPointEqual(endpoint, pointOnHull) || this.isOnLeft(pointOnHull, endpoint, points[j])) {
          endpoint = points[j];
        }
      }
      if (endpoint) {
        this.makeLine(endpoint, pointOnHull);
      }
      pointOnHull = endpoint;
      i++;
    } while (!this.isPointEqual(endpoint, convexHull[0]) && i < 50);
    console.log(convexHull.length);
    // return convexHull;
  }

  /**
   * Check if pointC is on left side of line going from pointA to pointB
   * @param pointA First point
   * @param pointB Second point
   * @param pointC Point that we are checking if is on left
   */
  private isOnLeft(pointA: SvgCircle, pointB: SvgCircle, pointC: SvgCircle): boolean {
    const d =
      (Number(pointC.getAttribute("cx")) - Number(pointA.getAttribute("cx"))) *
        (Number(pointB.getAttribute("cy")) - Number(pointA.getAttribute("cy"))) -
      (Number(pointC.getAttribute("cy")) - Number(pointA.getAttribute("cy"))) *
        (Number(pointB.getAttribute("cx")) - Number(pointA.getAttribute("cx")));

    return d < 0;
  }

  /**
   * Detects if points are equal. Points are equal if their coordinates are equal
   * @param pointA first point
   * @param pointB second point
   */
  private isPointEqual(pointA: SvgCircle, pointB: SvgCircle) {
    if (
      Number(pointA.getAttribute("cx")) === Number(pointB.getAttribute("cx")) &&
      Number(pointA.getAttribute("cy")) === Number(pointB.getAttribute("cy"))
    ) {
      return true;
    }
    return false;
  }

  /**
   * Remove all lines which represents convex hull
   */
  private removeLines() {
    const canvas = this.canvas.getCanvas();
    let currentLines = canvas.getElementsByClassName("line");
    let currentLinesArray = Array.from(currentLines);
    currentLinesArray.forEach((line) => line.remove());
  }

  /**
   * Add line going from first to second point on canvas
   * @param pointA first point
   * @param pointB second point
   */
  private makeLine(pointA: SvgCircle, pointB: SvgCircle, id?: string) {
    var newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    if (id) {
      newLine.setAttribute("class", "id");
    }
    newLine.setAttribute("class", "line");
    newLine.setAttribute("x1", pointA.getAttribute("cx"));
    newLine.setAttribute("y1", pointA.getAttribute("cy"));
    newLine.setAttribute("x2", pointB.getAttribute("cx"));
    newLine.setAttribute("y2", pointB.getAttribute("cy"));
    newLine.setAttribute("stroke", "black");
    const canvas = this.canvas.getCanvas();
    canvas.appendChild(newLine);
  }
}
