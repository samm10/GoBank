import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailComponentComponent } from './user-detail-component.component';

describe('UserDetailComponentComponent', () => {
  let component: UserDetailComponentComponent;
  let fixture: ComponentFixture<UserDetailComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDetailComponentComponent]
    });
    fixture = TestBed.createComponent(UserDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
