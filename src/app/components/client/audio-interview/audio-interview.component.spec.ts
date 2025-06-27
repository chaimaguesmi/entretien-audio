import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioInterviewComponent } from './audio-interview.component';

describe('AudioInterviewComponent', () => {
  let component: AudioInterviewComponent;
  let fixture: ComponentFixture<AudioInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioInterviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudioInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
