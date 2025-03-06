import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class OwnedItemsService {
    private readonly KEY_V1 = 'ffxiv.fashionreport.items.owned';
    private readonly KEY_V2 = 'ffxiv.fashionreport.v2.items.owned';

    private readonly ownedItemsV2 = new Set<string>();

    constructor() {
        const rawV2 = window.localStorage.getItem(this.KEY_V2);

        if (rawV2) {
            const items: string[] = JSON.parse(rawV2);

            items.forEach(item => {
                this.ownedItemsV2.add(item);
            });
        }

        // If there are no items currently in the new format, check the old format
        // and import them if we can.
        if (!rawV2 || !rawV2.length) {
            const rawV1 = window.localStorage.getItem(this.KEY_V1);

            if (rawV1) {
                const items: string[] = JSON.parse(rawV1);

                items.forEach(item => {
                    // Be sure to trim off the "item" prefis - that was a silly decision from V1.
                    this.ownedItemsV2.add(this.makeId(item.substring(4)));
                    this.save();
                });
            }
        }
    }

    add(name: string) {
        this.ownedItemsV2.add(this.makeId(name));
        this.save();
    }

    remove(name: string) {
        this.ownedItemsV2.delete(this.makeId(name));
        this.save();
    }

    isOwned(name: string) {
        return this.ownedItemsV2.has(this.makeId(name));
    }

    private makeId(name: string) {
        return name.replace(/[\'\"\s/\(\)\.]/gi, '').toLocaleLowerCase();
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