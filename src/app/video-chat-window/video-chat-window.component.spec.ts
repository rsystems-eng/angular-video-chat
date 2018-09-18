import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoChatWindowComponent } from './video-chat-window.component';

describe('VideoChatWindowComponent', () => {
  let component: VideoChatWindowComponent;
  let fixture: ComponentFixture<VideoChatWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoChatWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoChatWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
