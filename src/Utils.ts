import { SvgCircle, Point } from "./Canvas";
import { Circle } from "./Circle";
import { RealPoint } from "./RealPoint";

export class Utils {
  /**
   * Check if pointC is on left side of line going from pointA to pointB
   * @param pointA First point
   * @param pointB Second point
   * @param pointC Point that we are checking if is on left
   */
  public static isOnLeft(pointA: SvgCircle, pointB: SvgCircle, pointC: SvgCircle): boolean {
    const d =
      (Number(pointC.getAttribute("cx")) - Number(pointA.getAttribute("cx"))) *
        (Number(pointB.getAttribute("cy")) - Number(pointA.getAttribute("cy"))) -
      (Number(pointC.getAttribute("cy")) - Number(pointA.getAttribute("cy"))) *
        (Number(pointB.getAttribute("cx")) - Number(pointA.getAttribute("cx")));

    return d < 0;
  }

  /**
   * Check if pointC is on left side of line going from pointA to pointB
   * @param pointA First point
   * @param pointB Second point
   * @param pointC Point that we are checking if is on left
   */
  public static isOnLeftPoints(pointA: Point, pointB: Point, pointC: Point): boolean {
    const d = (pointC.x - pointA.x) * (pointB.y - pointA.y) - (pointC.y - pointA.y) * (pointB.x - pointA.x);
    return d > 0;
  }

  /**
   * Calculates squared distance of two points
   * @param point1
   * @param point2
   */
  public static DistanceSq(point1: Point, point2: Point): number {
    return Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2);
  }

  /**
   * Calculates distance of two points
   * @param point1
   * @param point2
   */
  public static Distance(point1: Point, point2: Point): number {
    return Math.sqrt(Utils.DistanceSq(point1, point2));
  }

  /**
   * Creates circle where 3 given points are lying on the circle
   * @param point1
   * @param point2
   * @param point3
   */
  public static CreateCircleFromPoints(p1: Point, p2: Point, p3: Point) {
    let center = Utils.GetCenterOfPoints(p1, p2, p3);
    let r = Math.sqrt(Utils.DistanceSq(center, p1));
    let c = new Circle(center, r);
    return c;
  }

  /**
   * Get center of three non-colinear points
   * @param p1
   * @param p2
   * @param p3
   */
  public static GetCenterOfPoints(p1: Point, p2: Point, p3: Point) {
    let cp = this.crossProduct(p1, p2, p3);
    if (cp !== 0) {
      let p1Sq = Math.pow(p1.x, 2) + Math.pow(p1.y, 2);
      let p2Sq = Math.pow(p2.x, 2) + Math.pow(p2.y, 2);
      let p3Sq = Math.pow(p3.x, 2) + Math.pow(p3.y, 2);
      let num = p1Sq * (p2.y - p3.y) + p2Sq * (p3.y - p1.y) + p3Sq * (p1.y - p2.y);
      let cx = num / (2.0 * cp);
      num = p1Sq * (p3.x - p2.x) + p2Sq * (p1.x - p3.x) + p3Sq * (p2.x - p1.x);
      let cy = num / (2.0 * cp);
      let center = new RealPoint(cx, cy, "black");
      return center;
    } else {
      return null;
    }
  }

  /**
   * Create crossproduct of three vertices
   * @param p1
   * @param p2
   * @param p3
   */
  private static crossProduct(p1: Point, p2: Point, p3: Point) {
    let u1 = p2.x - p1.x;
    let v1 = p2.y - p1.y;
    let u2 = p3.x - p1.x;
    let v2 = p3.y - p1.y;
    return u1 * v2 - v1 * u2;
  }
}
