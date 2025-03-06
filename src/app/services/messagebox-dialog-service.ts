import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MessageboxDialogComponent } from "../components/messagebox-dialog/messagebox-dialog.component";

@Injectable({
    providedIn: 'root'
})
export class MessageBoxDialogService {
    constructor(
        private readonly modalService: NgbModal
    ) {
    }

    show(message: string) {
        const modalReference = this.modalService.open(MessageboxDialogComponent);

        modalReference.componentInstance.message = message;

        return modalReference.result.catch(_ => false);
    }
}