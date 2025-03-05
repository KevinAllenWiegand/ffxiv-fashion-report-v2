import { Routes } from '@angular/router';
import { HintSearchComponent } from './components/hint-search/hint-search.component';
import { ItemSearchComponent } from './components/item-search/item-search.component';
import { MyItemsComponent } from './components/my-items/my-items.component';

export const routes: Routes = [
    { path: '', component: HintSearchComponent, data: { storeRoute: true } },
    { path: 'hintsearch', component: HintSearchComponent, data: { storeRoute: true } },
    { path: 'itemsearch', component: ItemSearchComponent, data: { storeRoute: true } },
    { path: 'myitems', component: MyItemsComponent },
    { path: "**", redirectTo: "" }
];
