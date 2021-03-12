/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PronosticsTestModule } from '../../../test.module';
import { PaysComponent } from '../../../../../../main/webapp/app/entities/pays/pays.component';
import { PaysService } from '../../../../../../main/webapp/app/entities/pays/pays.service';
import { Pays } from '../../../../../../main/webapp/app/entities/pays/pays.model';

describe('Component Tests', () => {

    describe('Pays Management Component', () => {
        let comp: PaysComponent;
        let fixture: ComponentFixture<PaysComponent>;
        let service: PaysService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [PaysComponent],
                providers: [
                    PaysService
                ]
            })
            .overrideTemplate(PaysComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaysComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaysService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Pays(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.pays[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
