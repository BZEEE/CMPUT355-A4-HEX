import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GameSettingsSingleton } from '../hex-visualizer/GameSettingsSingleton';

// Creates a MatDialog component to be used as a modal for the tutorial UI.
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ModalComponent>) { }
  gameSettings: GameSettingsSingleton;
  ngOnInit(): void {
    // Get a handle on the current settings of the game to access gameSettings.tutorialDone
    this.gameSettings = GameSettingsSingleton.getInstance();
  }

  closeModal() {
    this.dialogRef.close();
  }

}
