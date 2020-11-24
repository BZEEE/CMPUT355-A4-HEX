import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {GamePieceColor} from './hex-visualizer/board/GamePieceColor';
import {GameSettingsSingleton} from './hex-visualizer/GameSettingsSingleton';
import {HexVisualizerComponent} from './hex-visualizer/hex-visualizer.component';
import {MoveManager} from './hex-visualizer/moves/MoveManager';
import {FormValidatorService} from './services/form-validator.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    @ViewChild('hexViz', {static: false}) hexVisualizer: HexVisualizerComponent;
    title = 'CMPUT355-A4-HEX';
    gameControlsForm: FormGroup;
    playerOptions: string[];
    gameSettings: GameSettingsSingleton;
    moveManager: MoveManager;

    constructor(private fb: FormBuilder,
                private messageSvc: NzMessageService,
                private formValidatorSvc: FormValidatorService) {
    }

    ngOnInit(): void {
        this.gameSettings = GameSettingsSingleton.getInstance();
        this.playerOptions = Object.values(GamePieceColor);
        this.moveManager = MoveManager.getInstance();
        this.gameControlsForm = this.fb.group({
            rows: new FormControl(null, [Validators.required, Validators.min(2), Validators.max(19)]),
            cols: new FormControl(null, [Validators.required, Validators.min(2), Validators.max(19)]),
            startingPlayer: new FormControl(null, [Validators.required]),
            tileSize: new FormControl(null, [Validators.required]),
        });
        // set default value
        this.gameControlsForm.get('startingPlayer').setValue(this.gameSettings.COLOR_LEFT_RIGHT);
        this.gameControlsForm.get('tileSize').setValue(20);
    }

    startGame() {
        if (this.formValidatorSvc.validateForm(this.gameControlsForm)) {
            this.gameSettings.rows = this.gameControlsForm.get('rows').value;
            this.gameSettings.cols = this.gameControlsForm.get('cols').value;
            this.gameSettings.currentTurn = this.gameControlsForm.get('startingPlayer').value;

            // Disable form when game is running
            this.gameControlsForm.disable();

            this.gameSettings.setRadius(this.gameControlsForm.get('tileSize').value);
            this.gameSettings.running = true;
            this.hexVisualizer.startGame();
        } else {
            this.messageSvc.warning('please fill out all fields');
        }
    }

    stopGame() {
        this.hexVisualizer.stopGame();
        this.gameSettings.running = false;
        this.moveManager.reset();

        // Enable form when game is not running
        this.gameControlsForm.enable();

    }

    undoMove() {
        this.moveManager.undo();

        // Force a check so that GameResult gets updated.
        this.hexVisualizer.checkWinState();
    }

    redoMove() {
        this.moveManager.redo();

        // Force a check so that GameResult gets updated.
        this.hexVisualizer.checkWinState();
    }

    startTutorial() {
        this.gameSettings.rows = 3;
        this.gameSettings.cols = 3;
        this.gameSettings.currentTurn = "black";
        
    }
}
