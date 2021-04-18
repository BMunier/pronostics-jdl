import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { JhiDataUtils } from 'ng-jhipster';

import { PronosticsTestModule } from '../../../test.module';
import { PaysDetailComponent } from 'app/entities/pays/pays-detail.component';
import { Pays } from 'app/shared/model/pays.model';

describe('Component Tests', () => {
  describe('Pays Management Detail Component', () => {
    let comp: PaysDetailComponent;
    let fixture: ComponentFixture<PaysDetailComponent>;
    let dataUtils: JhiDataUtils;
    const route = ({ data: of({ pays: new Pays(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PronosticsTestModule],
        declarations: [PaysDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(PaysDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PaysDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = fixture.debugElement.injector.get(JhiDataUtils);
    });

    describe('OnInit', () => {
      it('Should load pays on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.pays).toEqual(jasmine.objectContaining({ id: 123 }));
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
