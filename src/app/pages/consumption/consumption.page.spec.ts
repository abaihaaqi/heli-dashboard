import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionPage } from './consumption.page';

describe('ConsumptionPage', () => {
  let component: ConsumptionPage;
  let fixture: ComponentFixture<ConsumptionPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ConsumptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
