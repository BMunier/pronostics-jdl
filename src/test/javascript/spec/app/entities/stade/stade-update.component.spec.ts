import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { PronosticsTestModule } from '../../../test.module';
import { StadeUpdateComponent } from 'app/entities/stade/stade-update.component';
import { StadeService } from 'app/entities/stade/stade.service';
import { Stade } from 'app/shared/model/stade.model';

describe('Component Tests', () => {
  describe('Stade Management Update Component', () => {
    let comp: StadeUpdateComponent;
    let fixture: ComponentFixture<StadeUpdateComponent>;
    let service: StadeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PronosticsTestModule],
        declarations: [StadeUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(StadeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StadeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(StadeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Stade(123);
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
        const entity = new Stade();
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
