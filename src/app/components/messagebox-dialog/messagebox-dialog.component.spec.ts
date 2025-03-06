import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageboxDialogComponent } from './messagebox-dialog.component';

describe('MessageboxDialogComponent', () => {
  let component: MessageboxDialogComponent;
  let fixture: ComponentFixture<MessageboxDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageboxDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageboxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
