import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-messagebox-dialog',
  standalone: true,
  imports: [],
  templateUrl: './messagebox-dialog.component.html',
  styleUrl: './messagebox-dialog.component.css'
})
export class MessageboxDialogComponent {
    @Input()
    message: string = '';

    constructor(
        private activeModal: NgbActiveModal
    ) {
    }

    close() {
        this.activeModal.close();
    }
}
