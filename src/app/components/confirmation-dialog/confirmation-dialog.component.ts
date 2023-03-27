import { Component, Input } from '@angular/core';
import { ConfirmationDialogConfig } from './confirmation-dialog-config';

declare var $: any;

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
    config: ConfirmationDialogConfig;
    itemToDelete: any;

    showDialog(config: ConfirmationDialogConfig, itemToDelete: any): void {
        this.config = config;
        this.itemToDelete = itemToDelete;
        $('#confirmation-dialog').modal();
    }

    closeDialog(): void {
        this.itemToDelete = null;
        $('#confirmation-dialog').modal('hide');
    }

    onAcceptClicked(): void {
        this.config.acceptCallback(this.itemToDelete);
        this.closeDialog();
    }

}