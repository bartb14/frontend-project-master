import {Component, ViewChild} from '@angular/core';
import {Service} from './models/service';
import {ConfirmationDialogConfig} from './components/confirmation-dialog/confirmation-dialog-config';
import {DataService} from './services/data.service';
import {DialogConfig, DialogField} from   './components/add-or-edit-dialog/dialog-config';
import {AddOrEditDialogComponent} from './components/add-or-edit-dialog/add-or-edit-dialog.component';
import {ConfirmationDialogComponent} from './components/confirmation-dialog/confirmation-dialog.component';
import {KeycloakEventType, KeycloakService} from "keycloak-angular";
import {Subscription} from "rxjs";
import {Term} from "./models/term";
import { TermDialogComponent } from './components/term-dialog/term-dialog.component';
import { TermDialogConfig } from './components/term-dialog/term-dialog-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('addOrEditDialog') addOrEditDialog: AddOrEditDialogComponent;
  @ViewChild('confirmationDialog') confirmationDialog: ConfirmationDialogComponent;
  @ViewChild('termDialog') termDialog: TermDialogComponent;

  confirmationDialogConfig: ConfirmationDialogConfig;
  $keycloakSubscriber: Subscription;
  $termsSubscriber: Subscription;

  terms: Term[] = null;

  constructor(private dataService: DataService, private readonly keycloakService: KeycloakService) {}

  ngOnInit() {
    this.$keycloakSubscriber = this.keycloakService.keycloakEvents$.subscribe(event => {
      switch (event.type) {
        case KeycloakEventType.OnAuthSuccess:
        case KeycloakEventType.OnAuthRefreshSuccess:
          this.dataService.userLoggedIn();
          break;
        case KeycloakEventType.OnAuthError:
        case KeycloakEventType.OnAuthLogout:
        case KeycloakEventType.OnAuthRefreshError:
        case KeycloakEventType.OnTokenExpired:
          this.dataService.userLoggedOut();
          break;
        case KeycloakEventType.OnReady:
          break;
      }
    })
    this.$termsSubscriber = this.dataService.terms.subscribe(terms => {
      this.terms = terms;
    })
  }

  ngOnDestroy() {
    this.$keycloakSubscriber.unsubscribe();
    this.$termsSubscriber.unsubscribe();
  }

  createAddOrEditDialogFields(): DialogField[] {
    return [
      {
        label: 'Nazwa',
        field: 'name',
        type: 'text'
      },
      {
        label: 'Opis',
        field: 'description',
        type: 'textarea'
      },
      {
        label: 'URL do zdjęcia',
        field: 'imageUrl',
        type: 'text'
      },
      {
        label: 'Cena',
        field: 'cost',
        type: 'number',
        step: 0.01,
        min: 0.01
      },
      {
        label: 'Czas trwania',
        field: 'duration',
        type: 'number',
        step: 1,
        min: 1
      },
    ];
  }

  prepareDeleteConfirmationDialog(): ConfirmationDialogConfig {
    return {
      title: 'Usuwanie usługi',
      message: 'Czy na pewno chcesz usunąć usługę?',
      acceptCallback: (item) => { this.dataService.deleteItem(item); }
    };
  }

  prepareEditDialog(): DialogConfig {
    return {
      title: 'Edytowanie usługi',
      fields: this.createAddOrEditDialogFields(),
      acceptCallback: (item) => {
        const serviceItem = item as Service;
        this.dataService.editItem(serviceItem);
      },
      acceptLabel: 'Zapisz',
      rejectLabel: 'Anuluj'
    };
  }

  prepareAddDialog(): DialogConfig {
    return {
      title: 'Dodawanie usługi',
      fields: this.createAddOrEditDialogFields(),
      acceptCallback: (item) => {
        const serviceItem = item as Service;
        this.dataService.addItem(serviceItem);
      },
      acceptLabel: 'Dodaj',
      rejectLabel: 'Anuluj'
    };
  }

  createOrderDialogFields() : DialogField[] {
    const reservedDates = [];
    const reservedHours = [];

    for (const term of this.terms) {
      const termSplit = term.dateOfExecution.split('T');
      reservedDates.push(termSplit[0]);
      reservedHours.push(+termSplit[1].split(':')[0]);
    }

    const currentDate = new Date();
    const options = [];

    let index = 0;
    for (let i = 0; i < 14; i++) {
      const currentDateSplit = currentDate.toISOString().split('T');
      const currentDateString = currentDateSplit[0];

      for (let k = 8; k < 17; k++) {
        if (this.terms != null && !(reservedDates.includes(currentDateString) && reservedHours.includes(k))) {
          let hour = k.toString();

          if (k < 10) {
            hour = `0${hour}`
          }

          options.push({ item_text: `${currentDateString} ${hour}:00`, item_id: index })
          index += 1;
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return [
      {
        label: 'Imię i Nazwisko',
        field: 'clientName',
        type: 'text'
      },
      {
        label: 'Data wykonania usługi',
        field: 'dateOfExecution',
        type: 'multiselect',
        options,
        multiselectSettings: {
          singleSelection: true,
          selectAllText: '',
          unSelectAllText: '',
          allowSearchFilter: false,
          searchPlaceholderText: '',
          placeholder: 'Wybierz godzinę',
          noDataAvailablePlaceholderText: 'Brak dat do wybrania',
          idField: 'item_id',
          textField: 'item_text'
        }
      }
    ];
  }

  prepareOrderDialog(serviceId: string): DialogConfig {
    return {
      title: 'Zamawianie usługi',
      fields: this.createOrderDialogFields(),
      acceptCallback: (item) => {
        item.dateOfExecution = item.dateOfExecution[0];
        const termItem = item as Term;
        termItem.serviceId = serviceId;
        termItem.dateOfExecution = termItem.dateOfExecution.replace(" ", "T");
        this.dataService.addTerm(termItem);
      },
      acceptLabel: 'Zamów',
      rejectLabel: 'Anuluj'
    }
  }

  prepareTermDialog(service: Service): TermDialogConfig {
    return {
      title: `Rezerwacje dla ${service.name}`,
      rejectLabel: 'Zamknij'
    }
  }

  onEdit(item: Service): void {
    const dialogConfig = this.prepareEditDialog();
    this.addOrEditDialog.showDialog(dialogConfig, item);
  }

  onDelete(item: Service): void {
    const dialogConfig = this.prepareDeleteConfirmationDialog();
    this.confirmationDialog.showDialog(dialogConfig, item);
  }

  onAdd(): void {
    const dialogConfig = this.prepareAddDialog();
    this.addOrEditDialog.showDialog(dialogConfig);
  }

  onOrder(item: Service): void {
    const dialogConfig = this.prepareOrderDialog(item.id);
    this.addOrEditDialog.showDialog(dialogConfig);
  }

  onShowTerms(service: Service): void {
    const dialogConfig = this.prepareTermDialog(service);
    const termsForService = this.terms.filter(term => term.serviceId === service.id);
    this.termDialog.showDialog(dialogConfig, termsForService);
  }
}
