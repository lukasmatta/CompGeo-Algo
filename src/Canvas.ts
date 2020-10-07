interface Point {
  x: number;
  y: number;
  color: string;
}

type SvgInHtml = HTMLElement & SVGElement;
type SvgCircle = HTMLElement & SVGCircleElement;

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export class Canvas {
  private points: SvgCircle[] = [];
  private canvas: SvgInHtml;
  private draggingObject: SvgCircle;
  private dragging = false;

  constructor(canvasId: string) {
    this.canvas = <SvgInHtml>document.getElementById(canvasId);
    this.canvas.addEventListener("mousemove", this.drag.bind(this));
    this.canvas.addEventListener("mouseup", this.endDrag.bind(this));
    this.canvas.addEventListener("mouseleave", this.endDrag.bind(this));
    this.canvas.addEventListener("dblclick", this.addPointOnClick.bind(this));
  }

  /**
   * Adds point to canvas
   * @param x x coordinate
   * @param y y coordinate
   * @param color color of point
   */
  public addPoint(x: number, y: number, color?: string): void {
    const circle: SvgCircle = <SvgCircle>document.createElementNS(SVG_NAMESPACE, "circle");
    circle.setAttributeNS(null, "cx", x.toString());
    circle.setAttributeNS(null, "cy", y.toString());
    circle.setAttributeNS(null, "r", "5");
    circle.setAttributeNS(
      null,
      "style",
      `fill: ${color || "black"}; stroke: ${color || "black"}; stroke-width: 1px; cursor: move;`
    );
    circle.addEventListener("mousedown", this.startDrag.bind(this));

    this.points.push(circle);
    this.canvas.appendChild(circle);
  }

  /**
   * Adds point on click
   * @param event click event
   */
  private addPointOnClick(event: MouseEvent) {
    this.addPoint(event.offsetX, event.offsetY);
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
}
