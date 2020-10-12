import { SvgCircle } from "./Canvas";

export class ConvexHull {
  constructor() {}

  /**
   * Creates convex hull and paints convex hull points with green color
   * @param points array of points
   */
  public createConvexHull(points: SvgCircle[]): SvgCircle[] {
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
      pointOnHull.style.fill = "green";
      convexHull.push(pointOnHull);
      endpoint = points[0];

      for (let j = 0; j < points.length; j++) {
        if (this.isPointEqual(endpoint, pointOnHull) || this.isOnLeft(pointOnHull, endpoint, points[j])) {
          endpoint = points[j];
        }
      }
      pointOnHull = endpoint;
      i++;
    } while (!this.isPointEqual(endpoint, convexHull[0]) && i < 50);
    return convexHull;
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

  private isPointEqual(pointA: SvgCircle, pointB: SvgCircle) {
    if (
      Number(pointA.getAttribute("cx")) === Number(pointB.getAttribute("cx")) &&
      Number(pointA.getAttribute("cy")) === Number(pointB.getAttribute("cy"))
    ) {
      return true;
    }
    return false;
  }
}
