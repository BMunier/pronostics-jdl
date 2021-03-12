/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PronosticsTestModule } from '../../../test.module';
import { StadeComponent } from '../../../../../../main/webapp/app/entities/stade/stade.component';
import { StadeService } from '../../../../../../main/webapp/app/entities/stade/stade.service';
import { Stade } from '../../../../../../main/webapp/app/entities/stade/stade.model';

describe('Component Tests', () => {

    describe('Stade Management Component', () => {
        let comp: StadeComponent;
        let fixture: ComponentFixture<StadeComponent>;
        let service: StadeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [StadeComponent],
                providers: [
                    StadeService
                ]
            })
            .overrideTemplate(StadeComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(StadeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(StadeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Stade(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.stades[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
