import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmListComponent } from './film-list.component';

describe('FilmListComponent', () => {
    let component: FilmListComponent;
    let fixture: ComponentFixture<FilmListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FilmListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FilmListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit `onClick`', () => {
        const spy = spyOn(component.onFilmClick, 'emit');
        component.onClick('click');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should return value', () => {
        const value = 'click';
        const spy = spyOn(component.onFilmClick, 'emit').and.returnValue(value);
        component.onClick('click');
        expect(spy).toHaveBeenCalledWith(value);
    });
});
