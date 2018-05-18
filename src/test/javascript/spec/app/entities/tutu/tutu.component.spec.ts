/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PronosticsTestModule } from '../../../test.module';
import { TutuComponent } from '../../../../../../main/webapp/app/entities/tutu/tutu.component';
import { TutuService } from '../../../../../../main/webapp/app/entities/tutu/tutu.service';
import { Tutu } from '../../../../../../main/webapp/app/entities/tutu/tutu.model';

describe('Component Tests', () => {

    describe('Tutu Management Component', () => {
        let comp: TutuComponent;
        let fixture: ComponentFixture<TutuComponent>;
        let service: TutuService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [TutuComponent],
                providers: [
                    TutuService
                ]
            })
            .overrideTemplate(TutuComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TutuComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TutuService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Tutu(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.tutus[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
