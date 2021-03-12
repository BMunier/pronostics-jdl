/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PronosticsTestModule } from '../../../test.module';
import { MatchComponent } from '../../../../../../main/webapp/app/entities/match/match.component';
import { MatchService } from '../../../../../../main/webapp/app/entities/match/match.service';
import { Match } from '../../../../../../main/webapp/app/entities/match/match.model';

describe('Component Tests', () => {

    describe('Match Management Component', () => {
        let comp: MatchComponent;
        let fixture: ComponentFixture<MatchComponent>;
        let service: MatchService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [MatchComponent],
                providers: [
                    MatchService
                ]
            })
            .overrideTemplate(MatchComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MatchComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MatchService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Match(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.matches[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
