import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { PronosticsTestModule } from '../../../test.module';
import { PronosticUpdateComponent } from 'app/entities/pronostic/pronostic-update.component';
import { PronosticService } from 'app/entities/pronostic/pronostic.service';
import { Pronostic } from 'app/shared/model/pronostic.model';

describe('Component Tests', () => {
  describe('Pronostic Management Update Component', () => {
    let comp: PronosticUpdateComponent;
    let fixture: ComponentFixture<PronosticUpdateComponent>;
    let service: PronosticService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PronosticsTestModule],
        declarations: [PronosticUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(PronosticUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PronosticUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PronosticService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Pronostic(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Pronostic();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
