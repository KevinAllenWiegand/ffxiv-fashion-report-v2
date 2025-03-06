import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSearchItemsPanelComponent } from './item-search-items-panel.component';

describe('ItemSearchItemsPanelComponent', () => {
  let component: ItemSearchItemsPanelComponent;
  let fixture: ComponentFixture<ItemSearchItemsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSearchItemsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSearchItemsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
