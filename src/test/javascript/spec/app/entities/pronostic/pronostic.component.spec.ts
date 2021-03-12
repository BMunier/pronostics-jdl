/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PronosticsTestModule } from '../../../test.module';
import { PronosticComponent } from '../../../../../../main/webapp/app/entities/pronostic/pronostic.component';
import { PronosticService } from '../../../../../../main/webapp/app/entities/pronostic/pronostic.service';
import { Pronostic } from '../../../../../../main/webapp/app/entities/pronostic/pronostic.model';

describe('Component Tests', () => {

    describe('Pronostic Management Component', () => {
        let comp: PronosticComponent;
        let fixture: ComponentFixture<PronosticComponent>;
        let service: PronosticService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [PronosticComponent],
                providers: [
                    PronosticService
                ]
            })
            .overrideTemplate(PronosticComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PronosticComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PronosticService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Pronostic(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.pronostics[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
