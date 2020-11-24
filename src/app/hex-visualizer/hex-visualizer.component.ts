import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {CanvasSingleton} from './board/CanvasSingleton';
import {HexGrid} from './board/HexGrid';
import {NzMessageService} from 'ng-zorro-antd';
import {GamePieceColor} from './board/GamePieceColor';

@Component({
    selector: 'app-hex-visualizer',
    templateUrl: './hex-visualizer.component.html',
    styleUrls: ['./hex-visualizer.component.css']
})
export class HexVisualizerComponent implements OnInit {
    @ViewChild('canvas', {static: true}) canvasRef: ElementRef<HTMLCanvasElement>;
    hexGrid: HexGrid;
    animationId: number;

    constructor(private messageSvc: NzMessageService) {
    }

    ngOnInit(): void {
        // set Canvas Singleton
        CanvasSingleton.getInstance().setContext(this.canvasRef.nativeElement);
        CanvasSingleton.getInstance().getCanvas().width = Math.round(window.innerWidth * 0.8);
        CanvasSingleton.getInstance().getCanvas().height = window.innerHeight;
        CanvasSingleton.getInstance().getCanvas().style.backgroundColor = '#db591d';
    }

    startGame() {
        this.hexGrid = new HexGrid();

        // Force a check so that GameResult gets updated.
        this.checkWinState();

        this.animationLoop();
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
        this.animationId = window.requestAnimationFrame(this.animationLoop.bind(this));

    }

    mouseClickOnCanvas(clickEvent: MouseEvent) {
        // get x, y coordinates of click relative to canvas coordinate system (0, 0) = top-left corner
        this.hexGrid.checkMouseClick(clickEvent.offsetX, clickEvent.offsetY);

        // check for win state after previous input, only if the game is running.
        if (this.hexGrid.gameSettingsSingleton.running) {
            this.checkWinState();
        }
    }

    /**
     * A middle man between the actual hex visualizer's checkWinState() method and this component. This checks the win state and displays a message if it has been solved.
     */
    checkWinState() {
        if (this.hexGrid.checkWinState()) {
            this.notifyWon(this.hexGrid.gameSettingsSingleton.currentGameResult.winner);
        }
    }

    /**
     * Display a message saying that a color has won.
     * @param color The color to include in the message.
     */
    notifyWon(color: GamePieceColor) {
        this.messageSvc.success(color + ' has won the game!', {nzDuration: 5000});
    }

    startTutorial() {
      this.checkWinState();
      this.animationLoop();
      }
  
}
