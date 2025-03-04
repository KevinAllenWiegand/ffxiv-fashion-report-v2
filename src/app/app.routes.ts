import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ItemSearchComponent } from './home/item-search.component';
import { MyItemsComponent } from './home/my-items.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'itemsearch', component: ItemSearchComponent },
    { path: 'myitems', component: MyItemsComponent }
];
