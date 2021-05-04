import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { JhiDataUtils } from 'ng-jhipster';

import { PronosticsTestModule } from '../../../test.module';
import { EquipeDetailComponent } from 'app/entities/equipe/equipe-detail.component';
import { Equipe } from 'app/shared/model/equipe.model';

describe('Component Tests', () => {
  describe('Equipe Management Detail Component', () => {
    let comp: EquipeDetailComponent;
    let fixture: ComponentFixture<EquipeDetailComponent>;
    let dataUtils: JhiDataUtils;
    const route = ({ data: of({ equipe: new Equipe(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PronosticsTestModule],
        declarations: [EquipeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(EquipeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EquipeDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = fixture.debugElement.injector.get(JhiDataUtils);
    });

    describe('OnInit', () => {
      it('Should load equipe on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.equipe).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });

    describe('byteSize', () => {
      it('Should call byteSize from JhiDataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'byteSize');
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.byteSize(fakeBase64);

        // THEN
        expect(dataUtils.byteSize).toBeCalledWith(fakeBase64);
      });
    });

    describe('openFile', () => {
      it('Should call openFile from JhiDataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'openFile');
        const fakeContentType = 'fake content type';
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.openFile(fakeContentType, fakeBase64);

        // THEN
        expect(dataUtils.openFile).toBeCalledWith(fakeContentType, fakeBase64);
      });
    });
  });
});
