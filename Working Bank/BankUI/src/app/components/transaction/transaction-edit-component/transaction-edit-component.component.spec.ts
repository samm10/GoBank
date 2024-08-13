import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionEditComponentComponent } from './transaction-edit-component.component';

describe('TransactionEditComponentComponent', () => {
  let component: TransactionEditComponentComponent;
  let fixture: ComponentFixture<TransactionEditComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionEditComponentComponent]
    });
    fixture = TestBed.createComponent(TransactionEditComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
