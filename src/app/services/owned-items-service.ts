import { EventEmitter, Injectable } from "@angular/core";
import { MasterJsonService } from "./master-json-service";
import { Subscription } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OwnedItemsService {
    private readonly KEY_V1 = 'ffxiv.fashionreport.items.owned';
    private readonly KEY_V2 = 'ffxiv.fashionreport.v2.items.owned';

    private dataAvailableSubscription: Subscription | undefined;
    private readonly ownedItemsV2 = new Set<string>();

    onDataAvailable = new EventEmitter<void>();

    constructor(
        private readonly masterJsonService: MasterJsonService
    ) {
        const rawV2 = window.localStorage.getItem(this.KEY_V2);
        let rawV2Count = 0;

        if (rawV2) {
            const items: string[] = JSON.parse(rawV2);

            rawV2Count = items.length;
            items.forEach(item => {
                this.ownedItemsV2.add(item);
            });

            this.onDataAvailable.emit();
        }

        // Subscribe to the master json event so we can attempt to migrate.
        if (rawV2Count === 0) {
            this.dataAvailableSubscription = masterJsonService.onDataAvailable.subscribe(() => {
                this.dataAvailableSubscription?.unsubscribe();
                this.migrateV1ToV2();
            });
        }
    }

    ngOnDestroy(): void {
        this.dataAvailableSubscription?.unsubscribe();
    }

    add(name: string) {
        this.ownedItemsV2.add(name);
        this.save();
    }

    restore(names: string[]) {
        this.ownedItemsV2.clear();

        names.forEach(name => {
            let effectiveName = name;
            
            // Migrate from V1 if necessary
            if (effectiveName.startsWith('item')) {
                effectiveName = this.findItemNameFromV1Id(effectiveName.substring(4));
            }

            if (effectiveName) {
                this.ownedItemsV2.add(effectiveName);
            }
        });
        this.save();
    }

    remove(name: string) {
        this.ownedItemsV2.delete(name);
        this.save();
    }

    clear() {
        this.ownedItemsV2.clear();
        this.save();
    }

    isOwned(name: string) {
        return this.ownedItemsV2.has(name);
    }

    getOwnedItems() {
        const items: string[] = [];

        this.ownedItemsV2.forEach(item => {
            items.push(item);
        });

        items.sort();

        return items;
    }

    private migrateV1ToV2() {
        const rawV1 = window.localStorage.getItem(this.KEY_V1);

        if (rawV1) {
            const ids: string[] = JSON.parse(rawV1);

            ids.forEach(id => {
                // Find the item from the V1 ID.
                // Be sure to trim off the "item" prefix - that was a silly decision from V1.
                const name = this.findItemNameFromV1Id(id.substring(4));

                if (name) {
                    this.ownedItemsV2.add(name);
                }
            });

            this.save();
            this.onDataAvailable.emit();
        }
    }

    private findItemNameFromV1Id(id: string) {
        let name = '';
        const slotCount = this.masterJsonService.masterData?.slots.length || 0;

        for (let slotIndex = 0; slotIndex < slotCount; slotIndex++) {
            const items = this.masterJsonService.masterData?.slots[slotIndex].items;

            if (!items || !items.length) { continue; }

            for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                const item = items[itemIndex];
                const itemId = this.makeId(item.name);

                if (id.toLowerCase() === itemId.toLowerCase()) {
                    name = item.name;
                    break;
                }
            }
        }

        return name;
    }

    private makeId(name: string) {
        return name.replace(/[\'\"\s/\(\)\.]/gi, '');
    }

    private save() {
        const items = this.getOwnedItems();
        window.localStorage.setItem(this.KEY_V2, JSON.stringify(items));
    }
}