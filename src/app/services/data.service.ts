import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Service } from '../models/service';
import { Term } from '../models/term';
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class DataService {

  constructor(private http: HttpClient) {
    this.loadServices().then(data => {
      this.servicesCopy = [...data];
      this._services.next(data)
    });
    this.loadTerms().then(data => this._terms.next(data));
  }

    private servicesCopy = null;
    private _services = new BehaviorSubject<Service[]>(null);
    readonly services = this._services.asObservable();

    private _terms = new BehaviorSubject<Term[]>(null);
    readonly terms = this._terms.asObservable();

    private _isLoggedIn = new BehaviorSubject<string>(localStorage.getItem("isLoggedIn"));
    readonly isLoggedIn = this._isLoggedIn.asObservable();

    private sortingType: SortingType = 'name';

    userLoggedIn() {
      this._isLoggedIn.next("true");
    }

    userLoggedOut() {
      this._isLoggedIn.next("false");
    }

  private loadServices() {
    return this.http.get<Service[]>("http://localhost:8090/services").toPromise();
  }

  private loadTerms() {
      return this.http.get<Term[]>("http://localhost:8090/terms").toPromise();
    }

    async deleteItem(item: Service) {
      await this.http.delete(`http://localhost:8090/services/${item.id}`).toPromise();
      this.loadServices().then(data => {
        this.servicesCopy = [...data];
        this._services.next(data)
      });
    }

    async addItem(item: Service) {
      await this.http.post("http://localhost:8090/services", item).toPromise();
      this.loadServices().then(data => {
        this.servicesCopy = [...data];
        this._services.next(data)
      });
    }

    async editItem(item: Service) {
      await this.http.put("http://localhost:8090/services", item).toPromise();
      this.loadServices().then(data => {
        this.servicesCopy = [...data];
        this._services.next(data)
      });
    }

    async addTerm(item: Term) {
      await this.http.post("http://localhost:8090/terms", item).toPromise();
      this.loadTerms().then(data => this._terms.next(data));
    }

    sortServicesBy(sortingType: SortingType) {
      this.sortingType = sortingType;
      const servicesCopy = [...this._services.value];

      if (sortingType === 'name') {
        servicesCopy.sort((o1, o2) => {
          return o1.name.localeCompare(o2.name);
        });
      } else if (sortingType === 'price') {
        servicesCopy.sort((o1, o2) => {
          return o1.cost - o2.cost;
        });
      } else if (sortingType === 'serviceTime') {
        servicesCopy.sort((o1, o2) => {
          return o1.duration - o2.duration;
        });
      }
      this._services.next(servicesCopy);
    }

    filterServicesPrice(fromPrice: number, toPrice: number) {
      const servicesCopy = [...this.servicesCopy];

      const filteredData = servicesCopy.filter(item => {
        if (fromPrice > 0) {
          if (item.cost < fromPrice) return false;
        }

        if (toPrice > 0) {
          if (item.cost > toPrice) return false;
        }

        return true;
      });

      this._services.next([...filteredData]);
    }
}

export type SortingType = 'name' | 'price' | 'serviceTime';
