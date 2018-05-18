/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { PronosticsTestModule } from '../../../test.module';
import { TotoDetailComponent } from '../../../../../../main/webapp/app/entities/toto/toto-detail.component';
import { TotoService } from '../../../../../../main/webapp/app/entities/toto/toto.service';
import { Toto } from '../../../../../../main/webapp/app/entities/toto/toto.model';

describe('Component Tests', () => {

    describe('Toto Management Detail Component', () => {
        let comp: TotoDetailComponent;
        let fixture: ComponentFixture<TotoDetailComponent>;
        let service: TotoService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [TotoDetailComponent],
                providers: [
                    TotoService
                ]
            })
            .overrideTemplate(TotoDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TotoDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TotoService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Toto(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.toto).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
