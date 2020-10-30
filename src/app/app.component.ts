import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HexVisualizerComponent } from './hex-visualizer/hex-visualizer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('hexViz', {static: false}) hexVisualizer: HexVisualizerComponent
  title = 'CMPUT355-A4-HEX';
  gameControlsForm: FormGroup;
  running: boolean = false;

  constructor(private fb: FormBuilder,
              private messageSvc: NzMessageService) {}

  ngOnInit(): void {
    this.gameControlsForm = this.fb.group({
      rows: new FormControl(null, [Validators.required]),
      cols: new FormControl(null, [Validators.required]),
    })
  }

  startGame() {
    if (this.gameControlsForm.valid) {
      this.hexVisualizer.startGame(
        this.gameControlsForm.get("rows").value,
        this.gameControlsForm.get("cols").value,
      )
      this.running = true;
    } else {
      this.messageSvc.warning("please fill out all fields")
    }
  }

  stopGame() {
    this.hexVisualizer.stopGame()
    this.running = false;
  }
}
