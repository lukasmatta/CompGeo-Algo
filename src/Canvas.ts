export interface Point {
  x: number;
  y: number;
  color: string;
}

export type SvgInHtml = HTMLElement & SVGElement;
export type SvgCircle = HTMLElement & SVGCircleElement;
export type SvgLine = HTMLElement & SVGLineElement;

export const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export interface Polygon {
  points: SvgCircle[];
  lines: SvgLine[];
}

export class Canvas {
  private points: SvgCircle[] = [];
  private canvas: SvgInHtml;
  private draggingObject: SvgCircle;
  private dragging = false;
  private polygon: Polygon = { points: [], lines: [] };
  private creatingPolygon = false;

  constructor(canvasId: string) {
    this.canvas = <SvgInHtml>document.getElementById(canvasId);
    this.canvas.addEventListener("mousemove", this.drag.bind(this));
    this.canvas.addEventListener("mouseup", this.endDrag.bind(this));
    this.canvas.addEventListener("mouseleave", this.endDrag.bind(this));
    this.canvas.addEventListener("dblclick", this.addPointOnClick.bind(this));
    this.canvas.addEventListener("click", this.addPolygonPoint.bind(this));

    this.addPoint(232, 156, "black");
    this.addPoint(212, 253, "black");

    this.addPoint(295, 57, "black");
    this.addPoint(446, 107, "black");
    this.addPoint(341, 141, "black");
    this.addPoint(392, 273, "black");
  }

  /**
   * Returns points in canvas
   */
  public getPoints(): SvgCircle[] {
    return this.points;
  }

  /**
   * Returns svg canvas
   */
  public getCanvas(): SvgInHtml {
    return this.canvas;
  }

  /**
   * Adds point to canvas
   * @param x x coordinate
   * @param y y coordinate
   * @param color color of point
   */
  public addPoint(x: number, y: number, color?: string): SvgCircle {
    const circle: SvgCircle = <SvgCircle>document.createElementNS(SVG_NAMESPACE, "circle");
    circle.setAttributeNS(null, "cx", x.toString());
    circle.setAttributeNS(null, "cy", y.toString());
    circle.setAttributeNS(null, "r", "3");
    circle.setAttributeNS(
      null,
      "style",
      `fill: ${color || "black"}; stroke: ${color || "black"}; stroke-width: 1px; cursor: move;`
    );
    circle.addEventListener("mousedown", this.startDrag.bind(this));

    this.points.push(circle);
    this.canvas.appendChild(circle);
    return circle;
  }

  /**
   * Adds point on click
   * @param event click event
   */
  private addPointOnClick(event: MouseEvent): SvgCircle {
    return this.addPoint(event.offsetX, event.offsetY);
  }

  /**
   * Sets background color of canvas
   * @param color
   */
  public setBackgroundColor(color: string) {
    this.canvas.style.backgroundColor = color;
  }

  /**
   * Starts dragging point on click
   * @param event mousedown event
   */
  private startDrag(event: MouseEvent) {
    this.draggingObject = <SvgCircle>event.target;
    this.draggingObject.style.fill = "red";
    this.dragging = true;
  }

  /**
   * Drags element while mouse is clicked
   * @param event mousemove event
   */
  private drag(event: MouseEvent) {
    if (this.dragging && this.draggingObject) {
      this.draggingObject.setAttributeNS(null, "cx", event.offsetX.toString());
      this.draggingObject.setAttributeNS(null, "cy", event.offsetY.toString());
    }
  }

  /**
   * Stops dragging element
   * @param event mouseup event
   */
  private endDrag(_: MouseEvent) {
    if (this.dragging) {
      this.dragging = false;
      this.draggingObject.style.fill = "black";
      this.draggingObject = null;
    }
  }

  /**
   * Remove all lines from canvas
   */
  public removeLines() {
    let currentLines = this.canvas.getElementsByClassName("line");
    let currentLinesArray = Array.from(currentLines);
    currentLinesArray.forEach((line) => line.remove());
  }

  /**
   * Remove all points from canvas
   */
  public removePoints() {
    this.points.forEach((p) => p.remove());
    this.points = [];
  }

  /**
   * Remove lines and points from canvas
   */
  public clearCanvas() {
    this.removeLines();
    this.removePoints();
    this.polygon = { points: [], lines: [] };
  }

  /**
   * Adds polygon point
   * @param event
   */
  private addPolygonPoint(event: MouseEvent) {
    if (this.creatingPolygon) {
      const point = this.addPointOnClick(event);
      this.polygon.points.push(point);

      if (this.polygon.points.length > 1) {
        const secondLastPoint = this.polygon.points[this.polygon.points.length - 2];
        const line = this.makeLine(point, secondLastPoint);
        this.polygon.lines.push(line);
      }

      if (this.polygon.points.length > 2) {
        if (this.polygon.points.length > 3) {
          this.polygon.lines.splice(this.polygon.lines.length - 2, 1)[0].remove();
        }
        const firstPoint = this.polygon.points[0];
        const line = this.makeLine(firstPoint, point);
        this.polygon.lines.push(line);
      }
    }
  }

  /**
   * Add line going from first to second point on canvas
   * @param pointA first point
   * @param pointB second point
   */
  public makeLine(pointA: SvgCircle, pointB: SvgCircle, color?: string, id?: string): SvgLine {
    let newLine: SvgLine = <SvgLine>document.createElementNS("http://www.w3.org/2000/svg", "line");
    if (id) {
      newLine.setAttribute("id", id);
    }
    newLine.setAttribute("class", "line");
    newLine.setAttribute("x1", pointA.getAttribute("cx"));
    newLine.setAttribute("y1", pointA.getAttribute("cy"));
    newLine.setAttribute("x2", pointB.getAttribute("cx"));
    newLine.setAttribute("y2", pointB.getAttribute("cy"));
    newLine.setAttribute("stroke", color || "black");
    const canvas = this.canvas;
    const line = canvas.appendChild(newLine);
    return line;
  }

  /**
   * Add line going from first to second point on canvas
   * @param pointA first point
   * @param pointB second point
   */
  public makeLinePoints(pointA: Point, pointB: Point, color?: string, id?: string): SvgLine {
    let newLine: SvgLine = <SvgLine>document.createElementNS("http://www.w3.org/2000/svg", "line");
    if (id) {
      newLine.setAttribute("id", id);
    }
    newLine.setAttribute("class", "line");
    newLine.setAttribute("x1", pointA.x.toString());
    newLine.setAttribute("y1", pointA.y.toString());
    newLine.setAttribute("x2", pointB.x.toString());
    newLine.setAttribute("y2", pointB.y.toString());
    newLine.setAttribute("stroke", color || "black");
    const canvas = this.canvas;
    const line = canvas.appendChild(newLine);
    return line;
  }

  /**
   * Returns polygon that is on plane
   */
  public getPolygon(): Polygon {
    return this.polygon;
  }

  public startCreatingPolygon(): void {
    this.clearCanvas();
    this.creatingPolygon = true;
  }

  public stopCreatingPolygon(): void {
    this.creatingPolygon = false;
  }

  /**
   * Adds n points at random locations
   * @param n number of points to add
   */
  public addRandomPoints(n: number) {
    for (let i = 0; i < n; i++) {
      // 50 is padding around edge where we dont want to add points
      let x = Math.random() * (this.canvas.clientWidth - 50 - 50) + 50;
      let y = Math.random() * (this.canvas.clientHeight - 50 - 50) + 50;
      this.addPoint(x, y);
    }
  }

  /**
   * Gets points of canvas in simple format
   */
  public getSimplePoints(): Point[] {
    const simplePoints = this.points.map((point: SvgCircle) => ({
      x: Number(point.getAttribute("cx")),
      y: Number(point.getAttribute("cy")),
      color: "black",
    }));

    return simplePoints;
  }

  /**
   * Adds circle with with center and given perimeter
   * @param center
   * @param r
   * @param color
   */
  public addCircle(center: Point, r: number, color: string = "black") {
    const circle: SvgCircle = <SvgCircle>document.createElementNS(SVG_NAMESPACE, "circle");
    circle.setAttributeNS(null, "cx", center.x.toString());
    circle.setAttributeNS(null, "cy", center.y.toString());
    circle.setAttributeNS(null, "r", r.toString());
    circle.setAttributeNS(null, "style", `fill: none; stroke: ${color}; stroke-width: 1px; cursor: move;`);
    this.canvas.appendChild(circle);
    return circle;
  }
}
