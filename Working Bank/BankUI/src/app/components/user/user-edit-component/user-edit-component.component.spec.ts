import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditComponentComponent } from './user-edit-component.component';

describe('UserEditComponentComponent', () => {
  let component: UserEditComponentComponent;
  let fixture: ComponentFixture<UserEditComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserEditComponentComponent]
    });
    fixture = TestBed.createComponent(UserEditComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
