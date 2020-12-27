import { Point } from "./Canvas";
import { Utils } from "./Utils";

export class Circle {
  public constructor(private center: Point, private radius: number) {}

  public isInside(point: Point) {
    if (Utils.DistanceSq(this.center, point) < Math.pow(this.radius, 2)) {
      return true;
    }
    return false;
  }
}
