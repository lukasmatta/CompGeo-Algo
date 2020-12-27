import { SvgCircle, SvgInHtml, Canvas, SVG_NAMESPACE } from "./Canvas";
import { Utils } from "./Utils";

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
        currentLine = this.canvas.makeLine(points[j], pointOnHull, "green");
        if (this.isPointEqual(endpoint, pointOnHull) || Utils.isOnLeft(pointOnHull, endpoint, points[j])) {
          endpoint = points[j];
        }
        await this.timer(5);
        currentLine?.remove();
      }
      if (endpoint) {
        this.canvas.makeLine(endpoint, pointOnHull, "red");
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

    // Find the leftmost point
    let leftmostPoint: SvgCircle = points
      .sort((p1, p2) => Number(p1.getAttribute("cy")) - Number(p2.getAttribute("cy")))
      .sort((p1, p2) => Number(p1.getAttribute("cx")) - Number(p2.getAttribute("cx")))[0];

    // Sort points by the angle they and leftmost point make with x-axis
    points.sort((a, b) => (Utils.isOnLeft(leftmostPoint, a, b) ? -1 : 1));

    let lines: SVGLineElement[] = [];

    for (let i = 0; i < points.length; i++) {
      let point = points[i];

      while (stack.length > 1 && Utils.isOnLeft(stack[stack.length - 2], point, stack[stack.length - 1])) {
        stack.pop().style.fill = "black";
        lines.pop().remove();
      }

      if (stack.length >= 1) {
        lines.push(this.canvas.makeLine(stack[stack.length - 1], point, "red"));
      }

      stack.push(point);
      point.style.fill = "red";
      await this.timer(200);
    }

    // this.makeLine(stack[0], stack[stack.length - 1], "red");
    lines.push(this.canvas.makeLine(stack[stack.length - 1], stack[0], "red"));

    return new Promise((res) => res(stack));
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

  private timer(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
}
