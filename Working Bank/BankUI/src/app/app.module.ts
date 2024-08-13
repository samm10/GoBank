import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AdminDashboardComponent } from 'src/app/components/admin/admin-dashboard/admin-dashboard.component';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionListComponent } from 'src/app/components/transaction/transaction-list-component/transaction-list-component.component';
import { TransactionDetailComponent } from 'src/app/components/transaction/transaction-detail-component/transaction-detail-component.component';
import { TransactionEditComponent } from 'src/app/components/transaction/transaction-edit-component/transaction-edit-component.component';
import { TransactionCreateComponent } from 'src/app/components/transaction/transaction-create-component/transaction-create-component.component';
import { AccountListComponent } from './components/accounts/account-list-component/account-list-component.component';
import { AccountCreateComponent } from './components/accounts/account-create-component/account-create-component.component';
import { AccountEditComponent } from './components/accounts/account-edit-component/account-edit-component.component';
import { PayeeListComponent } from './components/payees/payee-list-component/payee-list-component.component';
import { PayeeCreateComponent } from './components/payees/payee-create-component/payee-create-component.component';
import { PayeeEditComponent } from './components/payees/payee-edit-component/payee-edit-component.component';
import { UserListComponent } from 'src/app/components/user/user-list-component/user-list-component.component';
import { UserDetailComponent } from 'src/app/components/user/user-detail-component/user-detail-component.component';
import { UserCreateComponent } from 'src/app/components/user/user-create-component/user-create-component.component';
import { UserEditComponent } from 'src/app/components/user/user-edit-component/user-edit-component.component';
import { CreditBalanceComponent } from 'src/app/components/credit-balance/credit-balance.component';
import { UserDashboardComponent } from 'src/app/components/user/user-dashboard/user-dashboard.component';
import { UserHomeComponent } from 'src/app/components/user/user-home/user-home.component';
import { AdminListComponent } from 'src/app/components/admin/admin-list/admin-list.component';
import { AdminCreateComponent } from 'src/app/components/admin/admin-create/admin-create.component';
import { AdminEditComponent } from 'src/app/components/admin/admin-edit/admin-edit.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { ForgotPasswordComponent } from 'src/app/components/forgot-password/forgot-password.component';
import { ForgotUsernameComponent } from 'src/app/components/forgot-username/forgot-username.component';
import { PrivacyPolicyComponent } from 'src/app/about/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from 'src/app/about/terms-of-service/terms-of-service.component';
import { AboutUsComponent } from 'src/app/about/about-us/about-us.component';
import { NavbarComponent } from './about/navbar/navbar.component';
import { FooterComponent } from './about/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    AdminDashboardComponent,
    TransactionListComponent,
    TransactionDetailComponent,
    TransactionEditComponent,
    TransactionCreateComponent,
    AccountListComponent,
    AccountCreateComponent,
    AccountEditComponent,
    PayeeListComponent,
    PayeeCreateComponent,
    PayeeEditComponent,
    UserListComponent,
    UserDetailComponent,
    UserCreateComponent,
    UserEditComponent,
    CreditBalanceComponent,
    UserDashboardComponent,
    UserHomeComponent,
    AdminListComponent,
    AdminCreateComponent,
    AdminEditComponent,
    ForgotPasswordComponent,
    ForgotUsernameComponent,
    PrivacyPolicyComponent,
    TermsOfServiceComponent,
    AboutUsComponent,
    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule, 
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTableModule,
    MatSelectModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
