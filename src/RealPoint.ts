import { Point } from "./Canvas";

export class RealPoint implements Point {
  public constructor(public x: number, public y: number, public color: string = "black") {}
}
