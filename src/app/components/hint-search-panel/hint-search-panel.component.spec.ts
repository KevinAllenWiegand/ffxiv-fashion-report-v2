import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HintSearchPanelComponent } from './hint-search-panel.component';

describe('HintSearchPanelComponent', () => {
  let component: HintSearchPanelComponent;
  let fixture: ComponentFixture<HintSearchPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HintSearchPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HintSearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
