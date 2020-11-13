import { SvgCircle } from "./Canvas";

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
}
