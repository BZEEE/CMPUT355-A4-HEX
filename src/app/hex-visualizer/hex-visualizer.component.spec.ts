import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HexVisualizerComponent } from './hex-visualizer.component';

describe('HexVisualizerComponent', () => {
  let component: HexVisualizerComponent;
  let fixture: ComponentFixture<HexVisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HexVisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HexVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
