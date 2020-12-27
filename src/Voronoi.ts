import { Canvas, Point } from "./Canvas";
import { Edge } from "./Edge";
import { RealPoint } from "./RealPoint";
import { Triangulation } from "./Triangulation";
import { Utils } from "./Utils";

export class Voronoi {
  private canvas: Canvas;
  private triangles: Edge[][];
  private centres: Point;

  public constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.triangles = new Triangulation(canvas).Delaunay(true);

    let trianglesWithcentres = this.triangles.map((t) => {
      return { edges: [...t], center: Utils.GetCenterOfPoints(t[0].pointA, t[0].pointB, t[1].pointB) };
    });

    trianglesWithcentres.forEach((p) => {
      this.canvas.addPoint(p.center.x, p.center.y, "red");
    });

    trianglesWithcentres.forEach((t1) => {
      trianglesWithcentres.forEach((t2) => {
        if (this.areAdjacent(t1.edges, t2.edges)) {
          this.canvas.makeLinePoints(t1.center, t2.center, "red");
        }
      });
    });
  }

  private areAdjacent(t1: Edge[], t2: Edge[]) {
    let are = false;
    t1.forEach((edge) => {
      if (are) {
        return;
      }
      t2.forEach((edge2) => {
        if (
          (edge.pointA == edge2.pointA && edge.pointB == edge2.pointB) ||
          (edge.pointB == edge2.pointA && edge.pointA == edge2.pointB)
        ) {
          are = true;
          return;
        }
      });
    });
    return are;
  }

  public createVoronoiDiagram() {}
}
