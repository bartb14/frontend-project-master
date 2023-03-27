import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Service } from '../../models/service';
import { DataService, SortingType } from '../../services/data.service';
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit, OnDestroy {

  @Output() editClicked = new EventEmitter<Service>();
  @Output() deleteClicked = new EventEmitter<Service>();
  @Output() orderClicked = new EventEmitter<Service>();
  @Output() showTermsClicked = new EventEmitter<Service>();

  $dataSub: Subscription;
  $isLoggedIn: Subscription;
  data: Service[] = [];
  sortingType: SortingType = 'name';
  //isAdmin: boolean;
  userRoles: string[];

  constructor(
    private dataService: DataService,
    private keycloakService: KeycloakService
  ) { }

  ngOnInit(): void {
    this.$dataSub = this.dataService.services.subscribe(data => {
      this.data = data;
    });
    this.$isLoggedIn = this.dataService.isLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.userRoles = this.keycloakService.getUserRoles(true);
      }
    })
  }

  ngOnDestroy(): void {
    this.$dataSub.unsubscribe();
    this.$isLoggedIn.unsubscribe();
  }

  onEdit(item: Service): void {
    this.editClicked.emit(item);
  }

  onDelete(item: Service): void {
    this.deleteClicked.emit(item);
  }

  onOrder(item: Service): void {
    this.orderClicked.emit(item);
  }

  onShowTerms(item: Service): void {
    this.showTermsClicked.emit(item);
  }

  onSortingChanged(sortingType: SortingType): void {
    this.sortingType = sortingType;
    this.dataService.sortServicesBy(sortingType);
  }

  onFilterClicked(fromEl, toEl): void {
    let fromPrice = fromEl.value;
    let toPrice = toEl.value;

    if (fromPrice == null || fromPrice == '') fromPrice = 0;
    if (toPrice == null || toPrice == '') toPrice = 0;

    this.dataService.filterServicesPrice(fromPrice, toPrice);
  }
}
