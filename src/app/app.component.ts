import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HexVisualizerComponent } from './hex-visualizer/hex-visualizer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CMPUT355-A4-HEX';
  gameControlsForm: FormGroup;
  @ViewChild('hexViz', {static: false}) hexVisualizer: HexVisualizerComponent

  constructor(private fb: FormBuilder) {}

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
    } else {
      console.log("please fill out all fields")
    }
  }
}
