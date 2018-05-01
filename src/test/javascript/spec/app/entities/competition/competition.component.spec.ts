/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PronosticsTestModule } from '../../../test.module';
import { CompetitionComponent } from '../../../../../../main/webapp/app/entities/competition/competition.component';
import { CompetitionService } from '../../../../../../main/webapp/app/entities/competition/competition.service';
import { Competition } from '../../../../../../main/webapp/app/entities/competition/competition.model';

describe('Component Tests', () => {

    describe('Competition Management Component', () => {
        let comp: CompetitionComponent;
        let fixture: ComponentFixture<CompetitionComponent>;
        let service: CompetitionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [CompetitionComponent],
                providers: [
                    CompetitionService
                ]
            })
            .overrideTemplate(CompetitionComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CompetitionComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CompetitionService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Competition(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.competitions[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
