import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HintSearchComponent } from './hint-search.component';

describe('HomeComponent', () => {
    let component: HintSearchComponent;
    let fixture: ComponentFixture<HintSearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HintSearchComponent]
        })
        .compileComponents();

        fixture = TestBed.createComponent(HintSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
