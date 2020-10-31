import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CanvasSingleton } from './board/CanvasSingleton';
import { HexGrid } from './board/HexGrid';

@Component({
  selector: 'app-hex-visualizer',
  templateUrl: './hex-visualizer.component.html',
  styleUrls: ['./hex-visualizer.component.css']
})
export class HexVisualizerComponent implements OnInit {
  @ViewChild('canvas', {static: true}) canvasRef: ElementRef<HTMLCanvasElement>;
  hexGrid: HexGrid;
  animationId: number;

  constructor() { }

  ngOnInit(): void {
    // set Canvas Singleton
    CanvasSingleton.getInstance().setContext(this.canvasRef.nativeElement);
    CanvasSingleton.getInstance().getCanvas().width = Math.round(window.innerWidth * 0.8)
    CanvasSingleton.getInstance().getCanvas().height = window.innerHeight;
    CanvasSingleton.getInstance().getCanvas().style.backgroundColor = "#db591d"; 
  }

  startGame() {
    this.hexGrid = new HexGrid();
    this.animationLoop()
  }

  stopGame() {
    let canvas = CanvasSingleton.getInstance().getCanvas();
    CanvasSingleton.getInstance().getContext().clearRect(0, 0, canvas.width, canvas.height);
    window.cancelAnimationFrame(this.animationId);
  } 

  animationLoop() {
    // clear the canvas
    let canvas = CanvasSingleton.getInstance().getCanvas();
    CanvasSingleton.getInstance().getContext().clearRect(0, 0, canvas.width, canvas.height);
    // render the hex grid
    this.hexGrid.renderGrid();
    // call next animation loop
    this.animationId = window.requestAnimationFrame(this.animationLoop.bind(this))
    
  }

  mousClickOnCanvas(clickEvent: MouseEvent) {
    // get x, y coordinates of click relative to canvas coordinate system (0, 0) = top-left corner
    this.hexGrid.checkMouseClick(clickEvent.offsetX, clickEvent.offsetY);
    // check for win state after previous input
    this.hexGrid.checkWinState();
  }

}
