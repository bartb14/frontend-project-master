import { Component } from '@angular/core';
import { DialogConfig } from './dialog-config';

declare var $: any;

@Component({
    selector: 'app-add-or-edit-dialog',
    templateUrl: './add-or-edit-dialog.component.html',
    styleUrls: ['./add-or-edit-dialog.component.scss']
})
export class AddOrEditDialogComponent {
    config: DialogConfig;
    editedItem: any = {};

    multiselectSelections = {};

    showDialog(config: DialogConfig, editedItem: any = null): void {
        this.config = config;

        if (editedItem != null) {
            this.editedItem = Object.assign({}, editedItem);
            this.createMultiselectInitialSelections();
        } else this.prepareItem();
        $('#add-or-edit-dialog').modal();
    }

    createMultiselectInitialSelections(): void {
        for (const field of this.config.fields) {
            if (field.type === 'multiselect') {
                if (this.editedItem[field.field] != null && Array.isArray(this.editedItem[field.field])) {
                    this.multiselectSelections[field.field] = [];

                    for (const selection of this.editedItem[field.field]) {
                        const item = field.options.find(option => option.item_text === selection);
                        this.multiselectSelections[field.field].push(item);
                    }
                }
            }
        }
    }

    prepareItem(): void {
        for (const field of this.config.fields) {
            this.editedItem[field.field] = '';
        }
    }

    submitForm(form: HTMLFormElement): void {
        const isValid = form.reportValidity();

        if (isValid) {
            for (const key of Object.keys(this.multiselectSelections)) {
                const selections = this.multiselectSelections[key];
                if (selections != null) this.editedItem[key] = selections.map(selection => selection.item_text);
            }
            this.config.acceptCallback(this.editedItem);
            $('#add-or-edit-dialog').modal('hide');
            this.clearForm();
        }
    }

    clearForm(): void {
        this.editedItem = {};
        this.multiselectSelections = {};
    }
}
