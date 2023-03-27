import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddOrEditDialogComponent } from './add-or-edit-dialog/add-or-edit-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DataListComponent } from './data-list/data-list.component';
import { TermDialogComponent } from './term-dialog/term-dialog.component';

@NgModule({
    declarations: [
        DataListComponent,
        AddOrEditDialogComponent,
        ConfirmationDialogComponent,
        TermDialogComponent
    ],
    imports: [
        CommonModule,
        NgMultiSelectDropDownModule,
        FormsModule
    ],
    exports: [
        DataListComponent,
        AddOrEditDialogComponent,
        ConfirmationDialogComponent,
        TermDialogComponent
    ]
})
export class ComponentsModule {}
