/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { PronosticsTestModule } from '../../../test.module';
import { MatchDetailComponent } from '../../../../../../main/webapp/app/entities/match/match-detail.component';
import { MatchService } from '../../../../../../main/webapp/app/entities/match/match.service';
import { Match } from '../../../../../../main/webapp/app/entities/match/match.model';

describe('Component Tests', () => {

    describe('Match Management Detail Component', () => {
        let comp: MatchDetailComponent;
        let fixture: ComponentFixture<MatchDetailComponent>;
        let service: MatchService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [MatchDetailComponent],
                providers: [
                    MatchService
                ]
            })
            .overrideTemplate(MatchDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MatchDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MatchService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Match(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.match).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
