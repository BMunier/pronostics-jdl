import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { PronosticsTestModule } from '../../../test.module';
import { EquipeUpdateComponent } from 'app/entities/equipe/equipe-update.component';
import { EquipeService } from 'app/entities/equipe/equipe.service';
import { Equipe } from 'app/shared/model/equipe.model';

describe('Component Tests', () => {
  describe('Equipe Management Update Component', () => {
    let comp: EquipeUpdateComponent;
    let fixture: ComponentFixture<EquipeUpdateComponent>;
    let service: EquipeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PronosticsTestModule],
        declarations: [EquipeUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(EquipeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EquipeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EquipeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Equipe(123);
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
        const entity = new Equipe();
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
