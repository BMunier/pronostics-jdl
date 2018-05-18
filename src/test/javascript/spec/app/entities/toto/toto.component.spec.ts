/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PronosticsTestModule } from '../../../test.module';
import { TotoComponent } from '../../../../../../main/webapp/app/entities/toto/toto.component';
import { TotoService } from '../../../../../../main/webapp/app/entities/toto/toto.service';
import { Toto } from '../../../../../../main/webapp/app/entities/toto/toto.model';

describe('Component Tests', () => {

    describe('Toto Management Component', () => {
        let comp: TotoComponent;
        let fixture: ComponentFixture<TotoComponent>;
        let service: TotoService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [TotoComponent],
                providers: [
                    TotoService
                ]
            })
            .overrideTemplate(TotoComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TotoComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TotoService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Toto(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.totos[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
