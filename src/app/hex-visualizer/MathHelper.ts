import { Point } from './board/Point';

export class MathHelper {
    // Converts from degrees to radians.
    public static toRadians = function(degrees: number) {
        return degrees * Math.PI / 180;
    };
   
    // Converts from radians to degrees.
    public static toDegrees = function(radians: number) {
        return radians * 180 / Math.PI;
    };
}