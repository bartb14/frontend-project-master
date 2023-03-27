import {RouterModule, Routes} from "@angular/router";
import {AppComponent} from "./app.component";
import {AuthGuard} from "./guard/auth.guard";
import {NgModule} from "@angular/core";

const routes: Routes = [
  { path: '', component: AppComponent , canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
