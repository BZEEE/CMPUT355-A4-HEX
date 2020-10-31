import { Point } from "./Point";
import { HexagonSide } from  './HexagonSide';


export class HexagonVertex {
    point: Point
    edgeName: HexagonSide;

    constructor(point: Point, edgeName: HexagonSide) {
        this.point = point;
        this.edgeName = edgeName;
    }
}