import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {CanvasSingleton} from './board/CanvasSingleton';
import {HexGrid} from './board/HexGrid';
import {NzMessageService} from 'ng-zorro-antd';
import {GamePieceColor} from './board/GamePieceColor';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ModalComponent} from '../modal/modal.component';
import {GameSettingsSingleton} from './GameSettingsSingleton';

@Component({
    selector: 'app-hex-visualizer',
    templateUrl: './hex-visualizer.component.html',
    styleUrls: ['./hex-visualizer.component.css']
})
export class HexVisualizerComponent implements OnInit {
    @ViewChild('canvas', {static: true}) canvasRef: ElementRef<HTMLCanvasElement>;
    hexGrid: HexGrid;
    animationId: number;
    gameSettingsSingleton: GameSettingsSingleton;

    constructor(private messageSvc: NzMessageService, public matDialog: MatDialog) {
    }

    ngOnInit(): void {
        // set Canvas Singleton
        CanvasSingleton.getInstance().setContext(this.canvasRef.nativeElement);
        CanvasSingleton.getInstance().getCanvas().width = Math.round(window.innerWidth * 0.8);
        CanvasSingleton.getInstance().getCanvas().height = window.innerHeight;
        CanvasSingleton.getInstance().getCanvas().style.backgroundColor = '#db591d';
        this.gameSettingsSingleton = GameSettingsSingleton.getInstance();
    }

    startGame() {
        this.hexGrid = new HexGrid(this.messageSvc);

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

            // Only display this when the game hasn't been won AND the game is in tutorial mode
            if (!this.gameSettingsSingleton.currentGameResult.hasWon && this.gameSettingsSingleton.tutorialMode) {
                this.messageSvc.info(this.gameSettingsSingleton.currentTurn + ' must now make a move');
            }
        }
    }

    /**
     * A middle man between the actual hex visualizer's checkWinState() method and this component. This checks the win state and displays a message if it has been solved.
     */
    checkWinState() {
        if (this.hexGrid.checkWinState()) {
            this.notifyWon(this.hexGrid.gameSettingsSingleton.currentGameResult.winner);
            if (this.hexGrid.gameSettingsSingleton.tutorialMode) {
                this.hexGrid.gameSettingsSingleton.tutorialDone = true;
                // start the tutorial dialog
                const dialogConfig = new MatDialogConfig();
                dialogConfig.id = 'modal-component';
                dialogConfig.height = '350px';
                dialogConfig.width = '600px';
                // https://material.angular.io/components/dialog/overview
                this.matDialog.open(ModalComponent, dialogConfig);
            }
        }
    }

    /**
     * Display a message saying that a color has won.
     * @param color The color to include in the message.
     */
    notifyWon(color: GamePieceColor) {

        // Only display when the win state has changed, because if it hasn't, then we'd just redisplay the same toast. It's also not possible to make the other player win in one move, as you'd have to undo, flipping the state of the variable.
        if (this.hexGrid.gameSettingsSingleton.winStateHasChanged) {
            this.messageSvc.success(color + ' has won the game!', {nzDuration: 5000});
        }

    }
}
