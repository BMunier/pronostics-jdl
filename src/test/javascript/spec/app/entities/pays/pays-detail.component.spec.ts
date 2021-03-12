/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { PronosticsTestModule } from '../../../test.module';
import { PaysDetailComponent } from '../../../../../../main/webapp/app/entities/pays/pays-detail.component';
import { PaysService } from '../../../../../../main/webapp/app/entities/pays/pays.service';
import { Pays } from '../../../../../../main/webapp/app/entities/pays/pays.model';

describe('Component Tests', () => {

    describe('Pays Management Detail Component', () => {
        let comp: PaysDetailComponent;
        let fixture: ComponentFixture<PaysDetailComponent>;
        let service: PaysService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [PaysDetailComponent],
                providers: [
                    PaysService
                ]
            })
            .overrideTemplate(PaysDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaysDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaysService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Pays(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.pays).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
