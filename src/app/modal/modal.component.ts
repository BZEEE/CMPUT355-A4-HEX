import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GameSettingsSingleton } from '../hex-visualizer/GameSettingsSingleton';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalComponent>) { }
  gameSettings: GameSettingsSingleton;
  ngOnInit(): void {
    this.gameSettings = GameSettingsSingleton.getInstance();
  }

  closeModal() {
    this.dialogRef.close();
  }

}
