import { SvgCircle, SvgInHtml, Canvas, SVG_NAMESPACE } from "./Canvas";

export class ConvexHull {
  canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  /**
   * Creates convex hull using Jarvis March algorithm
   * @param points array of points
   */
  public async JarvisMarch(): Promise<SvgCircle[]> {
    this.canvas.removeLines();
    const points = this.canvas.getPoints();
    this.colorPointsBlack(points);
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
      pointOnHull.style.fill = "red";
      convexHull.push(pointOnHull);
      endpoint = points[0];
      let currentLine: SVGLineElement;

      for (let j = 0; j < points.length; j++) {
        currentLine = this.makeLine(points[j], pointOnHull, "green");
        if (this.isPointEqual(endpoint, pointOnHull) || this.isOnLeft(pointOnHull, endpoint, points[j])) {
          endpoint = points[j];
        }
        await this.timer(5);
        currentLine?.remove();
      }
      if (endpoint) {
        this.makeLine(endpoint, pointOnHull, "red");
        endpoint.style.fill = "red";
      }
      pointOnHull = endpoint;
      i++;
    } while (!this.isPointEqual(endpoint, convexHull[0]) && i < 50);
    return new Promise((res) => res(convexHull));
  }

  /**
   * Colors are points with black color
   * @param points list of points
   */
  colorPointsBlack(points: SvgCircle[]): void {
    points.forEach((point) => (point.style.fill = "black"));
  }

  /**
   * Creates convex hull using Graham Scan algorithm
   * @param points array of points
   */
  public async GrahamScan(): Promise<SvgCircle[]> {
    this.canvas.removeLines();
    const points = this.canvas.getPoints();
    this.colorPointsBlack(points);
    let stack: SvgCircle[] = [];

    // Leftmost point (if two points are equally leftmost, than the point that is lower is selected)
    let leftmostPoint: SvgCircle = points[0];

    // Find the leftmost point
    points.slice(1).forEach((p: SvgCircle) => {
      if (Number(p.getAttribute("cx")) < Number(leftmostPoint.getAttribute("cx"))) {
        leftmostPoint = p;
      }

      if (Number(p.getAttribute("cx")) === Number(leftmostPoint.getAttribute("cx"))) {
        if (Number(p.getAttribute("cy")) < Number(leftmostPoint.getAttribute("cy"))) {
          leftmostPoint = p;
        }
      }
    });

    // Sort points by the angle they and leftmost point make with x-axis
    points.sort((a, b) => (this.isOnLeft(leftmostPoint, a, b) ? -1 : 1));

    let lines: SVGLineElement[] = [];

    for (let i = 0; i < points.length; i++) {
      let point = points[i];

      while (stack.length > 1 && this.isOnLeft(stack[stack.length - 2], point, stack[stack.length - 1])) {
        stack.pop().style.fill = "black";
        lines.pop().remove();
      }

      if (stack.length >= 1) {
        lines.push(this.makeLine(stack[stack.length - 1], point, "red"));
      }

      stack.push(point);
      point.style.fill = "red";
      await this.timer(200);
    }

    // this.makeLine(stack[0], stack[stack.length - 1], "red");
    lines.push(this.makeLine(stack[stack.length - 1], stack[0], "red"));

    return new Promise((res) => res(stack));
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
   * Add line going from first to second point on canvas
   * @param pointA first point
   * @param pointB second point
   */
  private makeLine(pointA: SvgCircle, pointB: SvgCircle, color?: string, id?: string): SVGLineElement {
    var newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    if (id) {
      newLine.setAttribute("id", id);
    }
    newLine.setAttribute("class", "line");
    newLine.setAttribute("x1", pointA.getAttribute("cx"));
    newLine.setAttribute("y1", pointA.getAttribute("cy"));
    newLine.setAttribute("x2", pointB.getAttribute("cx"));
    newLine.setAttribute("y2", pointB.getAttribute("cy"));
    newLine.setAttribute("stroke", color || "black");
    const canvas = this.canvas.getCanvas();
    const line = canvas.appendChild(newLine);
    return line;
  }

  private timer(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
}
