import { Component, Input } from '@angular/core';
import { Term } from 'src/app/models/term';
import { TermDialogConfig } from './term-dialog-config';

declare var $: any;

@Component({
    selector: 'app-term-dialog',
    templateUrl: './term-dialog.component.html',
    styleUrls: ['./term-dialog.component.scss']
})
export class TermDialogComponent {
    config: TermDialogConfig;
    terms: Term[];

    showDialog(config: TermDialogConfig, terms: Term[]): void {
        this.config = config;
        this.terms = terms;
        $('#term-dialog').modal();
    }

    closeDialog(): void {
        this.terms = null;
        $('#term-dialog').modal('hide');
    }

    getFormattedDate(date: string) {
      const dateSplit = date.split('T');
      return `${dateSplit[0]} ${dateSplit[1]}`
    }

}
