import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSearchReportsPanelComponent } from './item-search-reports-panel.component';

describe('ItemSearchReportsPanelComponent', () => {
  let component: ItemSearchReportsPanelComponent;
  let fixture: ComponentFixture<ItemSearchReportsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSearchReportsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSearchReportsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
