import { Canvas, Point } from "./Canvas";
import { Utils } from "./Utils";
import { RealPoint } from "./RealPoint";
import { Edge } from "./Edge";

export class Triangulation {
  canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  /**
   * Creates triangulation using sweeping line algorithm
   */
  public async SweepingLine(): Promise<SVGLineElement[]> {
    const polygon = this.canvas.getPolygon();
    if (polygon == null || polygon.points.length == 0) {
      alert("You have to create a polygon.");
      return;
    }
    const pointsSorted = [...polygon.points];
    const points = [...polygon.points];
    // Sort points lexicographically (primary top to down, secondary left to right)
    pointsSorted.sort((a, b) => {
      if (Number(a.getAttribute("cy")) > Number(b.getAttribute("cy"))) {
        return -1;
      } else if (Number(a.getAttribute("cy")) === Number(b.getAttribute("cy"))) {
        if (Number(a.getAttribute("cx")) < Number(b.getAttribute("cx"))) {
          return -1;
        } else {
          return 1;
        }
      } else {
        return 1;
      }
    });
    pointsSorted[0].style.fill = "green";
    pointsSorted[pointsSorted.length - 1].style.fill = "red";

    // Split points based on which line they lay
    const firstIndex = (points.indexOf(pointsSorted[0]) + 1) % points.length;
    let i = points.length - 1;
    let currentIndex = firstIndex;
    let firstPath = [];
    let secondPath = [];
    let currentPath = firstPath;
    let currentColor = "yellow";

    while (i > 0) {
      if (points[currentIndex] == pointsSorted[pointsSorted.length - 1]) {
        currentPath = secondPath;
        currentColor = "white";
      } else {
        points[currentIndex].style.fill = currentColor;
        currentPath.push(points[currentIndex]);
      }
      currentIndex = (currentIndex + 1) % points.length;
      i--;
    }

    // Iterate
    let stack = [];
    stack.push(pointsSorted[0]);
    stack.push(pointsSorted[1]);

    for (let i = 2; i < pointsSorted.length; i++) {
      // if v_i and the top of the stack lie on the same path (left or right)
      if (
        (firstPath.includes(pointsSorted[i]) && firstPath.includes(stack[stack.length - 1])) ||
        (secondPath.includes(pointsSorted[i]) && secondPath.includes(stack[stack.length - 1]))
      ) {
        while (stack.length > 1) {
          if (
            (firstPath.includes(pointsSorted[i]) &&
              Utils.isOnLeft(pointsSorted[i], stack[stack.length - 2], stack[stack.length - 1])) ||
            (secondPath.includes(pointsSorted[i]) &&
              !Utils.isOnLeft(pointsSorted[i], stack[stack.length - 2], stack[stack.length - 1]))
          ) {
            this.canvas.makeLine(pointsSorted[i], stack[stack.length - 2], "blue");
            stack.pop();
          } else {
            break;
          }
        }
        stack.push(pointsSorted[i]);
      } else {
        const top = stack[stack.length - 1];
        while (stack.length > 0) {
          this.canvas.makeLine(pointsSorted[i], stack.pop(), "red");
        }
        stack.push(top);
        stack.push(pointsSorted[i]);
      }
      await this.timer(500);
    }

    return;
  }

  public Delaunay(voronoi: boolean = false): Edge[][] {
    const triangulationEdges: Edge[] = [];
    let triangles: Edge[][] = [];
    const ael = new AEL(triangulationEdges);

    let points = [...this.canvas.getSimplePoints()];

    if (voronoi) {
      // Add invisible triangle so voronoi will be nicer
      let pBottomLeft = new RealPoint(-this.canvas.getCanvas().clientWidth, this.canvas.getCanvas().clientHeight * 2);
      let pBottomRight = new RealPoint(
        this.canvas.getCanvas().clientWidth * 2,
        this.canvas.getCanvas().clientHeight * 2
      );
      let pTopCenter = new RealPoint(this.canvas.getCanvas().clientWidth / 2, -this.canvas.getCanvas().clientHeight);
      points = [...points, pBottomLeft, pBottomRight, pTopCenter];
    }

    const randomPoint = points[0];
    const closestPoint = points
      .slice(1)
      .map((p: Point) => ({ point: p, distance: Utils.Distance(randomPoint, p) }))
      .sort(
        (a: { point: Point; distance: number }, b: { point: Point; distance: number }) => a.distance - b.distance
      )[0].point;

    let pointsOnLeft = points.filter((p) => Utils.isOnLeftPoints(randomPoint, closestPoint, p));
    let pointsOnRight = points.filter((p) => Utils.isOnLeftPoints(closestPoint, randomPoint, p));
    let e: Edge;
    let e2: Edge;
    let e3: Edge;

    if (pointsOnLeft.length > 0) {
      e = new Edge(randomPoint, closestPoint);
      let p: Point = pointsOnLeft.sort((p1, p2) => this.delaunayDistance(p1, e) - this.delaunayDistance(p2, e))[0];
      e2 = new Edge(closestPoint, p);
      e3 = new Edge(p, randomPoint);
    } else {
      e = new Edge(closestPoint, randomPoint);
      let p: Point = pointsOnRight.sort((p1, p2) => this.delaunayDistance(p1, e) - this.delaunayDistance(p2, e))[0];
      e2 = new Edge(randomPoint, p);
      e3 = new Edge(p, closestPoint);
    }

    ael.add(e);
    ael.add(e2);
    ael.add(e3);
    triangles.push([e, e2, e3]);

    while (!ael.isEmpty()) {
      let e = ael.firstEdge();

      let p1 = e.pointA;
      let p2 = e.pointB;
      let reversedE = new Edge(e.pointB, e.pointA);
      let pointsLeftOfReversedEdge = points.filter((p) => Utils.isOnLeftPoints(p2, p1, p));

      if (pointsLeftOfReversedEdge.length > 0) {
        let p: Point = pointsLeftOfReversedEdge
          .filter((p) => this.delaunayDistance(p, reversedE) != null)
          .sort((p1, p2) => this.delaunayDistance(p1, reversedE) - this.delaunayDistance(p2, reversedE))[0];
        let e2 = new Edge(p1, p);
        let e3 = new Edge(p, p2);

        if (
          ael.edges.filter((e) => e.pointA == e2.pointA && e.pointB == e2.pointB).length == 0 &&
          ael.edges.filter((e) => e.pointA == e2.pointB && e.pointB == e2.pointA).length == 0 &&
          ael.dt.filter((e) => e.pointA == e2.pointA && e.pointB == e2.pointB).length == 0 &&
          ael.dt.filter((e) => e.pointA == e2.pointB && e.pointB == e2.pointA).length == 0
        ) {
          ael.add(e2);
        }

        if (
          ael.edges.filter((e) => e.pointA == e3.pointA && e.pointB == e3.pointB).length == 0 &&
          ael.edges.filter((e) => e.pointA == e3.pointB && e.pointB == e3.pointA).length == 0 &&
          ael.dt.filter((e) => e.pointA == e3.pointA && e.pointB == e3.pointB).length == 0 &&
          ael.dt.filter((e) => e.pointA == e3.pointB && e.pointB == e3.pointA).length == 0
        ) {
          ael.add(e3);
        }
        triangles.push([e, e2, e3]);
      }
      ael.removeEdge(e);
    }
    if (!voronoi) {
      triangles.forEach((t) => {
        this.canvas.makeLinePoints(t[0].pointA, t[0].pointB, "black");
        this.canvas.makeLinePoints(t[1].pointA, t[1].pointB, "black");
        this.canvas.makeLinePoints(t[2].pointA, t[2].pointB, "black");
      });
    }

    return triangles;
  }

  private delaunayDistance(point: Point, edge: Edge) {
    let a = edge.pointA;
    let b = edge.pointB;

    let c = Utils.GetCenterOfPoints(a, b, point);

    // this.canvas.addPoint(c.x, c.y, "orange");

    if (c == null) {
      return null;
    }

    let r = Math.sqrt((c.x - point.x) ** 2 + (c.y - point.y) ** 2);
    // this.canvas.addCircle(c, r, "orange");

    // this.canvas.addCircle(c, r);

    if (
      (Utils.isOnLeftPoints(a, b, c) && Utils.isOnLeftPoints(a, b, point)) ||
      (!Utils.isOnLeftPoints(a, b, c) && !Utils.isOnLeftPoints(a, b, point))
    ) {
      return r;
    } else {
      return -r;
    }
  }

  private timer(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  private getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

class AEL {
  public edges: Edge[] = [];
  public constructor(public dt: Edge[]) {}

  public add(edge: Edge) {
    let a = edge.pointA;
    let b = edge.pointB;

    if (this.edges.filter((e) => e.pointA == b && e.pointB == a).length > 0) {
      this.edges = this.edges.filter((e) => e.pointA !== a || e.pointB !== b);
    } else {
      this.edges.push(edge);
    }
    this.dt.push(edge);
  }

  public isEmpty() {
    return this.edges.length == 0;
  }

  public removeEdge(edge: Edge) {
    this.edges = this.edges.filter((e) => e.pointA !== edge.pointA || e.pointB !== edge.pointB);
  }

  public firstEdge() {
    return this.edges[0];
  }
}
