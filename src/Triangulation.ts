import { Canvas } from "./Canvas";
import { Utils } from "./Utils";

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

  private timer(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
}
