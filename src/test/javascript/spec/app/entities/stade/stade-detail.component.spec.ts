/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { PronosticsTestModule } from '../../../test.module';
import { StadeDetailComponent } from '../../../../../../main/webapp/app/entities/stade/stade-detail.component';
import { StadeService } from '../../../../../../main/webapp/app/entities/stade/stade.service';
import { Stade } from '../../../../../../main/webapp/app/entities/stade/stade.model';

describe('Component Tests', () => {

    describe('Stade Management Detail Component', () => {
        let comp: StadeDetailComponent;
        let fixture: ComponentFixture<StadeDetailComponent>;
        let service: StadeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [StadeDetailComponent],
                providers: [
                    StadeService
                ]
            })
            .overrideTemplate(StadeDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(StadeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(StadeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Stade(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.stade).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
