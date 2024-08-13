import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDetailComponentComponent } from './transaction-detail-component.component';

describe('TransactionDetailComponentComponent', () => {
  let component: TransactionDetailComponentComponent;
  let fixture: ComponentFixture<TransactionDetailComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionDetailComponentComponent]
    });
    fixture = TestBed.createComponent(TransactionDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
