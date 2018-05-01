/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PronosticsTestModule } from '../../../test.module';
import { EquipeComponent } from '../../../../../../main/webapp/app/entities/equipe/equipe.component';
import { EquipeService } from '../../../../../../main/webapp/app/entities/equipe/equipe.service';
import { Equipe } from '../../../../../../main/webapp/app/entities/equipe/equipe.model';

describe('Component Tests', () => {

    describe('Equipe Management Component', () => {
        let comp: EquipeComponent;
        let fixture: ComponentFixture<EquipeComponent>;
        let service: EquipeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [EquipeComponent],
                providers: [
                    EquipeService
                ]
            })
            .overrideTemplate(EquipeComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EquipeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EquipeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Equipe(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.equipes[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
