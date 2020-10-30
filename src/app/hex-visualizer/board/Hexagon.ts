import { MathHelper } from '../MathHelper';
import { CanvasSingleton } from "./CanvasSingleton";
import { Point } from './Point';
import * as d3 from 'd3-polygon';
import { HexagonColorInstruction } from './HexagonColorInstruction';


export class Hexagon {
    public origin: Point;
    public radius: number;
    public vertices: Point[]
    public colorInstruction: HexagonColorInstruction;

    public constructor(origin: Point, radius: number, colorInstruction: HexagonColorInstruction) {
        this.origin = origin;
        this.radius = radius;
        this.vertices = [];
        this.colorInstruction = colorInstruction;

        this.generateVertices(this.origin, this.radius);
    }

    public static getWidth (radius: number): number {
        return Math.sqrt(3) * radius;
    }

    public static getHeight(radius: number) {
        // 3 / 2 * radius
        return 1.5 * radius;
    }

    public getVertices(): Point[] {
        return this.vertices
    }

    private generateVertices(origin: Point, radius: number): void {
        let angleOffset: number = 60;
        for (let currentAngle: number = 30; currentAngle <= 360.0; currentAngle += angleOffset) {
            let x: number = origin.x + (Math.cos(MathHelper.toRadians(currentAngle)) * radius);
            let y: number = origin.y + (Math.sin(MathHelper.toRadians(currentAngle)) * radius);
            this.vertices.push(new Point(x, y));
        }
    }

    public containsPoint(targetPoint: Point): boolean {
        // https://www.npmjs.com/package/robust-point-in-polygon
        let points: Array<[number, number]> = []
        this.vertices.forEach((v: Point) => {
            points.push([v.x, v.y])
        }) 
        return d3.polygonContains(points, [targetPoint.x, targetPoint.y])
    }

    render() {
        let ctx = CanvasSingleton.getInstance().getContext();
        ctx.beginPath();
        for(let i = 0; i < this.vertices.length; i++) {
            if (i === 0) {
                ctx.moveTo(this.vertices[i].x, this.vertices[i].y);
            } else {
                ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
            }
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'green';
            ctx.stroke();         
        }
        // finish line back to start point
        ctx.lineTo(this.vertices[0].x, this.vertices[0].y);
        ctx.stroke();
    }
}