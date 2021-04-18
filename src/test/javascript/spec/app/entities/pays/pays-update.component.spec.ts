import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { PronosticsTestModule } from '../../../test.module';
import { PaysUpdateComponent } from 'app/entities/pays/pays-update.component';
import { PaysService } from 'app/entities/pays/pays.service';
import { Pays } from 'app/shared/model/pays.model';

describe('Component Tests', () => {
  describe('Pays Management Update Component', () => {
    let comp: PaysUpdateComponent;
    let fixture: ComponentFixture<PaysUpdateComponent>;
    let service: PaysService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PronosticsTestModule],
        declarations: [PaysUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(PaysUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PaysUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PaysService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Pays(123);
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
        const entity = new Pays();
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
