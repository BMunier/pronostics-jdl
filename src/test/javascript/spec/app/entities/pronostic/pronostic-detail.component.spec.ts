/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { PronosticsTestModule } from '../../../test.module';
import { PronosticDetailComponent } from '../../../../../../main/webapp/app/entities/pronostic/pronostic-detail.component';
import { PronosticService } from '../../../../../../main/webapp/app/entities/pronostic/pronostic.service';
import { Pronostic } from '../../../../../../main/webapp/app/entities/pronostic/pronostic.model';

describe('Component Tests', () => {

    describe('Pronostic Management Detail Component', () => {
        let comp: PronosticDetailComponent;
        let fixture: ComponentFixture<PronosticDetailComponent>;
        let service: PronosticService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [PronosticDetailComponent],
                providers: [
                    PronosticService
                ]
            })
            .overrideTemplate(PronosticDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PronosticDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PronosticService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Pronostic(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.pronostic).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
