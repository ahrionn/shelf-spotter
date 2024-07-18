import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasListasComponent } from './minhas-listas.component';

describe('MinhasListasComponent', () => {
  let component: MinhasListasComponent;
  let fixture: ComponentFixture<MinhasListasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MinhasListasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinhasListasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
