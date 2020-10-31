import { MathHelper } from '../MathHelper';
import { CanvasSingleton } from "./CanvasSingleton";
import { Point } from './Point';
import * as d3 from 'd3-polygon';
import { HexagonSide } from './HexagonSide'
import { HexagonVertex } from './HexagonVertex';


export class Hexagon {
    public origin: Point;
    public radius: number;
    public vertices: HexagonVertex[]

    public constructor(origin: Point, radius: number) {
        this.origin = origin;
        this.radius = radius;
        this.vertices = [];

        this.generateVertices(this.origin, this.radius);
    }

    public static getWidth (radius: number): number {
        return Math.sqrt(3) * radius;
    }

    public static getHeight(radius: number) {
        // 3 / 2 * radius
        return 1.5 * radius;
    }

    public getVertices(): HexagonVertex[] {
        return this.vertices
    }

    public getVertexBasedOnSide(side: HexagonSide): HexagonVertex {
        for (let i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i].edgeName === side) {
                return this.vertices[i]
            }
        }
        return null;
    }

    private generateVertices(origin: Point, radius: number): void {
        let angleOffset: number = 60;
        let i = 0
        for (let currentAngle: number = 30; currentAngle <= 360.0; currentAngle += angleOffset) {
            let x: number = origin.x + (Math.cos(MathHelper.toRadians(currentAngle)) * radius);
            let y: number = origin.y + (Math.sin(MathHelper.toRadians(currentAngle)) * radius);
            this.vertices.push(new HexagonVertex(new Point(x, y), i));
            i += 1
        }
    }

    public containsPoint(targetPoint: Point): boolean {
        // https://www.npmjs.com/package/robust-point-in-polygon
        let points: Array<[number, number]> = []
        this.vertices.forEach((v: HexagonVertex) => {
            points.push([v.point.x, v.point.y])
        }) 
        return d3.polygonContains(points, [targetPoint.x, targetPoint.y])
    }

    render() {
        let ctx = CanvasSingleton.getInstance().getContext();
        ctx.beginPath();
        for(let i = 0; i < this.vertices.length; i++) {
            if (i === 0) {
                ctx.moveTo(this.vertices[i].point.x, this.vertices[i].point.y);
            } else {
                ctx.lineTo(this.vertices[i].point.x, this.vertices[i].point.y);
            }
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'green';
            ctx.stroke();         
        }
        // finish line back to start point
        ctx.lineTo(this.vertices[0].point.x, this.vertices[0].point.y);
        ctx.stroke();
    }
}