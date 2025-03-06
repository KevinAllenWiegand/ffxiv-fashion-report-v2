import { Injectable } from "@angular/core";
import { MasterJsonService } from "./MasterJsonService";
import { Subscription } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OwnedItemsService {
    private readonly KEY_V1 = 'ffxiv.fashionreport.items.owned';
    private readonly KEY_V2 = 'ffxiv.fashionreport.v2.items.owned';

    private dataAvailableSubscription: Subscription | undefined;
    private readonly ownedItemsV2 = new Set<string>();

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
        }

        // Subscribe to the master json event so we can attempt to migrate.
        if (rawV2Count === 0) {
            this.dataAvailableSubscription = masterJsonService.onDataAvailable.subscribe(() => {
                this.migrateV1ToV2();
            });
        }
    }

    ngOnDestroy(): void {
        if (this.dataAvailableSubscription) {
            this.dataAvailableSubscription.unsubscribe();
        }
    }

    add(name: string) {
        this.ownedItemsV2.add(name);
        this.save();
    }

    remove(name: string) {
        this.ownedItemsV2.delete(name);
        this.save();
    }

    isOwned(name: string) {
        return this.ownedItemsV2.has(name);
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
        const items: string[] = [];

        this.ownedItemsV2.forEach(item => {
            items.push(item);
        });

        items.sort();

        window.localStorage.setItem(this.KEY_V2, JSON.stringify(items));
    }
}