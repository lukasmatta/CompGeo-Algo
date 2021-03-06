// if the module has no dependencies, the above pattern can be simplified to
(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals (root is window)
        root.$ = factory();
  }
    }(this, function () {
    let noPolygonMessage = "double click to add a vertex";
    let polygonMessage = "click to add polygon vertex";
    let drawingPolygon = false;

    document.getElementsByClassName("hint")[0].innerHTML = noPolygonMessage;

    let svgPlane = new svgLibrary.Canvas("myCanvas");
    svgPlane.setBackgroundColor("pink");

    let convexHull = new svgLibrary.ConvexHull(svgPlane);

    function JarvisMarch() {
    convexHull.JarvisMarch();
    }

    function GrahamScan() {
    convexHull.GrahamScan();
    }

    var triangulation = new svgLibrary.Triangulation(svgPlane);

    function SweepingLine() {
    triangulation.SweepingLine();
    }

    function Delaunay() {
        triangulation.Delaunay();
    }

    function ClearCanvas() {
    svgPlane.clearCanvas();
    }

    function StartPolygon() {
        document.getElementsByClassName("hint")[0].innerHTML = polygonMessage;
        svgPlane.startCreatingPolygon();
        drawingPolygon = true;
        document.getElementById("polygon-state").innerHTML = "Stop";
    }

    function StopPolygon() {
        document.getElementsByClassName("hint")[0].innerHTML = noPolygonMessage;
        svgPlane.stopCreatingPolygon();
        drawingPolygon = false;
        document.getElementById("polygon-state").innerHTML = "Start";
    }

    function BuildKDTree() {
        let kdTree = new svgLibrary.KDTree(svgPlane);
        kdTree.buildKDTree(svgPlane.getSimplePoints(), 0);
    }

    function Voronoi() {
        let voronoi = new svgLibrary.Voronoi(svgPlane);
    }

    function TogglePolygon() {
        if(drawingPolygon) {
            StopPolygon();
        } else {
            StartPolygon();
        }
    }

    function AddRandomPoints() {
        svgPlane.addRandomPoints(10);
    }

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return {
        JarvisMarch, 
        GrahamScan, 
        SweepingLine, 
        ClearCanvas, 
        StartPolygon, 
        AddRandomPoints, 
        StopPolygon, 
        TogglePolygon, 
        BuildKDTree, 
        Delaunay,
        Voronoi};
}));
