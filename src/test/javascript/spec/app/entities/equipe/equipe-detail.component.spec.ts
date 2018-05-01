/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { PronosticsTestModule } from '../../../test.module';
import { EquipeDetailComponent } from '../../../../../../main/webapp/app/entities/equipe/equipe-detail.component';
import { EquipeService } from '../../../../../../main/webapp/app/entities/equipe/equipe.service';
import { Equipe } from '../../../../../../main/webapp/app/entities/equipe/equipe.model';

describe('Component Tests', () => {

    describe('Equipe Management Detail Component', () => {
        let comp: EquipeDetailComponent;
        let fixture: ComponentFixture<EquipeDetailComponent>;
        let service: EquipeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [EquipeDetailComponent],
                providers: [
                    EquipeService
                ]
            })
            .overrideTemplate(EquipeDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EquipeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EquipeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Equipe(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.equipe).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
