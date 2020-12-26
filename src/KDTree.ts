import { Canvas, Point } from "./Canvas";

export class KDTree {
  canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  public buildKDTree(
    points: Point[],
    depth: number,
    leftX: number = 0,
    rightX: number = Number(this.canvas.getCanvas().clientWidth),
    topY: number = 0,
    bottomY: number = Number(this.canvas.getCanvas().clientHeight)
  ): KDNode {
    if (points.length == 1) {
      return new KDNode(2, 1, points[0], null, null, null);
    }
    let p1: Point[];
    let p2: Point[];
    let medianPoint: Point;
    let v_left: KDNode;
    let v_right: KDNode;
    if (!(depth % 2)) {
      // Vertical
      const sortedPointsByX = this.sortPoints(points, "x");
      medianPoint = this.selectMedianPoint(sortedPointsByX);
      this.drawLine(bottomY, topY, medianPoint.x, "x");
      [p1, p2] = this.splitByMedianPoint(sortedPointsByX);
      v_left = this.buildKDTree(p1, depth + 1, leftX, medianPoint.x, topY, bottomY);
      v_right = this.buildKDTree(p2, depth + 1, medianPoint.x, rightX, topY, bottomY);
    } else {
      // Horizontal
      const sortedPointsByY = this.sortPoints(points, "y");
      medianPoint = this.selectMedianPoint(sortedPointsByY);
      this.drawLine(leftX, rightX, medianPoint.y, "y");
      [p1, p2] = this.splitByMedianPoint(sortedPointsByY);
      v_left = this.buildKDTree(p1, depth + 1, leftX, rightX, topY, medianPoint.y);
      v_right = this.buildKDTree(p2, depth + 1, leftX, rightX, medianPoint.y, bottomY);
    }

    const newNode = new KDNode(2, depth, medianPoint, null, v_left, v_right);

    v_left.setParent(newNode);
    v_right.setParent(newNode);

    return newNode;
  }

  private sortPoints(points: Point[], axis: "x" | "y") {
    const sortedPoints = points.sort((a: Point, b: Point) => {
      if (axis == "x") {
        return a.x - b.x;
      } else if (axis == "y") {
        return a.y - b.y;
      }
    });
    return sortedPoints;
  }

  private splitByMedianPoint(points: Point[]): [Point[], Point[]] {
    const firstHalf = points.slice(0, Math.floor(points.length / 2));
    const secondHalf = points.slice(Math.floor(points.length / 2));
    return [firstHalf, secondHalf];
  }

  private selectMedianPoint(points: Point[]): Point {
    return points[Math.floor(points.length / 2)];
  }

  private drawLine(start: number, end: number, coord: number, axis: "x" | "y") {
    //   Vertical (red)
    if (axis == "x") {
      this.canvas.makeLinePoints({ x: coord, y: start, color: "" }, { x: coord, y: end, color: "" }, "red");
      //   Horizontal (blue)
    } else {
      this.canvas.makeLinePoints({ x: start, y: coord, color: "" }, { x: end, y: coord, color: "" }, "blue");
    }
  }
}

export class KDNode {
  private k: number;
  private depth: number;
  private point: Point;
  private parent: KDNode;
  private lesser: KDNode;
  private greater: KDNode;

  public constructor(k: number, depth: number, point: Point, parent: KDNode, lesser: KDNode, greater: KDNode) {
    this.k = k;
    this.depth = depth;
    this.point = point;
    this.parent = parent;
    this.lesser = lesser;
    this.greater = greater;
  }

  public setParent(p: KDNode) {
    this.parent = p;
  }
}
