import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidenavComponent],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with isOpen as true and isFixed as false', () => {
    expect(component.isOpen).toBe(true);
    expect(component.isFixed).toBe(false);
  });

  it('should toggle isOpen when toggle() is called', () => {
    const initialState = component.isOpen;
    component.toggle();
    expect(component.isOpen).toBe(!initialState);
    
    component.toggle();
    expect(component.isOpen).toBe(initialState);
  });

  it('should set isOpen to false and isFixed to true when window width is below 1280px', () => {
    component['changeToResponsiveViewIfNeed'](1000);
    expect(component.isOpen).toBe(false);
    expect(component.isFixed).toBe(true);
  });

  it('should set isOpen to true and isFixed to false when window width is above 1280px', () => {
    component['changeToResponsiveViewIfNeed'](1500);
    expect(component.isOpen).toBe(true);
    expect(component.isFixed).toBe(false);
  });

  it('should set isOpen to false and isFixed to true when window width equals 1280px', () => {
    component['changeToResponsiveViewIfNeed'](1280);
    expect(component.isOpen).toBe(false);
    expect(component.isFixed).toBe(true);
  });

  it('should call changeToResponsiveViewIfNeed on window resize', () => {
    spyOn<any>(component, 'changeToResponsiveViewIfNeed');
    const event = { target: { innerWidth: 1000 } };
    component.onResize(event);
    expect(component['changeToResponsiveViewIfNeed']).toHaveBeenCalledWith(1000);
  });

  it('should call changeToResponsiveViewIfNeed and setMenusExperienceScripts on ngAfterViewInit', () => {
    spyOn<any>(component, 'changeToResponsiveViewIfNeed');
    spyOn(component, 'setMenusExperienceScripts');
    
    component.ngAfterViewInit();
    
    expect(component['changeToResponsiveViewIfNeed']).toHaveBeenCalled();
    expect(component.setMenusExperienceScripts).toHaveBeenCalled();
  });
});
