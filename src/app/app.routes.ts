import { Routes } from '@angular/router';
import { HintSearchComponent } from './components/hint-search/hint-search.component';
import { ItemSearchComponent } from './components/item-search/item-search.component';
import { MyItemsComponent } from './components/my-items/my-items.component';

export const routes: Routes = [
    { path: '', component: HintSearchComponent },
    { path: 'hintsearch', component: HintSearchComponent },
    { path: 'itemsearch', component: ItemSearchComponent },
    { path: 'myitems', component: MyItemsComponent }
];
