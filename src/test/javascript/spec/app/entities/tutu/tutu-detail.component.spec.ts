/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { PronosticsTestModule } from '../../../test.module';
import { TutuDetailComponent } from '../../../../../../main/webapp/app/entities/tutu/tutu-detail.component';
import { TutuService } from '../../../../../../main/webapp/app/entities/tutu/tutu.service';
import { Tutu } from '../../../../../../main/webapp/app/entities/tutu/tutu.model';

describe('Component Tests', () => {

    describe('Tutu Management Detail Component', () => {
        let comp: TutuDetailComponent;
        let fixture: ComponentFixture<TutuDetailComponent>;
        let service: TutuService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [TutuDetailComponent],
                providers: [
                    TutuService
                ]
            })
            .overrideTemplate(TutuDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TutuDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TutuService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Tutu(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.tutu).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
