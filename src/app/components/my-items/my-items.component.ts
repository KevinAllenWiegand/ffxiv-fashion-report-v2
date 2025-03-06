import { Component } from '@angular/core';
import { OwnedItemsService } from '../../services/OwnedItemsService';
import { Subscription } from 'rxjs';
import { GlobalEventService } from '../../services/GlobalEventService';
import { MessageBoxDialogService } from '../../services/MessageBoxDialogService';

@Component({
  selector: 'app-my-items',
  standalone: true,
  imports: [],
  templateUrl: './my-items.component.html',
  styleUrl: './my-items.component.css'
})
export class MyItemsComponent {
    private dataAvailableSubscription: Subscription | undefined;
    private restoreFileInputElement: HTMLInputElement | null = null;
    private restoreFile: any;

    ownedItems: string[] = [];
    
    constructor(
        private readonly ownedItemsService: OwnedItemsService,
        private readonly globalEventService: GlobalEventService,
        private readonly messageBoxDialogService: MessageBoxDialogService
    ) {
        this.ownedItems = ownedItemsService.getOwnedItems();

        if (this.ownedItems.length === 0) {
            this.dataAvailableSubscription = ownedItemsService.onDataAvailable.subscribe(() => {
                this.dataAvailableSubscription?.unsubscribe();
                this.ownedItems = ownedItemsService.getOwnedItems();
            });
        }
    }

    ngOnDestroy(): void {
        this.dataAvailableSubscription?.unsubscribe();
    }

    backupItems() {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.ownedItems)));
        element.setAttribute('download', 'ffxiv-fashion-report-v2-myitems.json');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    onRestoreFileSelected(event: any) {
        this.restoreFile = event.target.files[0];
        this.restoreFileInputElement = event.target;
    }

    restoreItems() {
        const filename = this.restoreFile?.name;

        if (!filename) {
            this.messageBoxDialogService.show('Please select a file first.');
            return;
        }

        if (filename.length < 6 || !filename.endsWith('.json')) {
            this.messageBoxDialogService.show('The selected file is invalid. Please select a different file.');
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = () => {
            const items = fileReader.result;

            if (items) {
                try {
                    var itemsArray = JSON.parse(items.toString());

                    this.ownedItemsService.restore(itemsArray);
                    this.ownedItems = this.ownedItemsService.getOwnedItems();
                    this.globalEventService.onLoadReportSlot.emit();

                    if (this.restoreFileInputElement) {
                        this.restoreFileInputElement.value = '';
                    }

                    this.restoreFile = null;
                    this.restoreFileInputElement = null;
                    this.messageBoxDialogService.show('Your items have been restored.');
                } catch (error) {
                }
            }
        };

        if (this.restoreFile) {
            fileReader.readAsText(this.restoreFile);
        }
    }
}
