import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AdminDashboardComponent } from 'src/app/components/admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from 'src/app/components/user/user-dashboard/user-dashboard.component';  // Import UserDashboardComponent
import { AuthGuard } from './auth/auth.guard';
import { TransactionListComponent } from 'src/app/components/transaction/transaction-list-component/transaction-list-component.component';
import { TransactionDetailComponent } from 'src/app/components/transaction/transaction-detail-component/transaction-detail-component.component';
import { TransactionCreateComponent } from 'src/app/components/transaction/transaction-create-component/transaction-create-component.component';
import { TransactionEditComponent } from 'src/app/components/transaction/transaction-edit-component/transaction-edit-component.component';
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
import { UserHomeComponent } from 'src/app/components/user/user-home/user-home.component';
import { AdminListComponent } from 'src/app/components/admin/admin-list/admin-list.component';
import { AdminCreateComponent } from 'src/app/components/admin/admin-create/admin-create.component';
import { AdminEditComponent } from 'src/app/components/admin/admin-edit/admin-edit.component';
import { ForgotPasswordComponent } from 'src/app/components/forgot-password/forgot-password.component';
import { ForgotUsernameComponent } from 'src/app/components/forgot-username/forgot-username.component';
import { PrivacyPolicyComponent } from 'src/app/about/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from 'src/app/about/terms-of-service/terms-of-service.component';
import { AboutUsComponent } from 'src/app/about/about-us/about-us.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'forgot-username', component: ForgotUsernameComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'about-us', component: AboutUsComponent },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
      { path: 'users/create', component: UserCreateComponent, canActivate: [AuthGuard] },
      { path: 'users/:userId', component: UserDetailComponent, canActivate: [AuthGuard] },
      { path: 'users/:userId/edit', component: UserEditComponent, canActivate: [AuthGuard] },

      { path: 'admins', component: AdminListComponent, canActivate: [AuthGuard] },
      { path: 'admins/create', component: AdminCreateComponent, canActivate: [AuthGuard] },
      { path: 'admins/edit/:adminid', component: AdminEditComponent, canActivate: [AuthGuard] },
      
      { path: 'credit-balance', component: CreditBalanceComponent, canActivate: [AuthGuard] },
      { path: 'transactions', component: TransactionListComponent, canActivate: [AuthGuard] },
      { path: 'transactions/create', component: TransactionCreateComponent, canActivate: [AuthGuard] },
      { path: 'transactions/:id', component: TransactionDetailComponent, canActivate: [AuthGuard] },
      { path: 'transactions/:id/edit', component: TransactionEditComponent, canActivate: [AuthGuard] },

      { path: 'accounts', component: AccountListComponent, canActivate: [AuthGuard] },
      { path: 'accounts/create', component: AccountCreateComponent, canActivate: [AuthGuard] },
      { path: 'accounts/:userId/edit', component: AccountEditComponent },


      { path: 'payees', component: PayeeListComponent, canActivate: [AuthGuard] },
      { path: 'payees/create', component: PayeeCreateComponent, canActivate: [AuthGuard] },
      { path: 'payees/:id', component: PayeeEditComponent, canActivate: [AuthGuard] },
      { path: 'payees/:id/edit', component: PayeeEditComponent, canActivate: [AuthGuard] }
    ]
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: UserHomeComponent, canActivate: [AuthGuard] },
      { path: 'add-account', component: AccountCreateComponent, canActivate: [AuthGuard] },
      { path: 'transactions', component: TransactionListComponent, canActivate: [AuthGuard] },
      { path: 'payees', component: PayeeListComponent, canActivate: [AuthGuard] },
      { path: 'payees/create', component: PayeeCreateComponent, canActivate: [AuthGuard] },
      { path: 'payees/:id', component: PayeeEditComponent, canActivate: [AuthGuard] },
      { path: 'payees/:id/edit', component: PayeeEditComponent, canActivate: [AuthGuard] },
      { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
      { path: 'users/:userId/edit', component: UserEditComponent, canActivate: [AuthGuard] },
      { path: 'users/:userId', component: UserDetailComponent, canActivate: [AuthGuard] },
      { path: 'transactions/create', component: TransactionCreateComponent, canActivate: [AuthGuard] },
      
    ]
  },
  { path: '**', redirectTo: '/login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
