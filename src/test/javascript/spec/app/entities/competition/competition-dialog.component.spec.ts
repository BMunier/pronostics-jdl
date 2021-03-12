/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { PronosticsTestModule } from '../../../test.module';
import { CompetitionDialogComponent } from '../../../../../../main/webapp/app/entities/competition/competition-dialog.component';
import { CompetitionService } from '../../../../../../main/webapp/app/entities/competition/competition.service';
import { Competition } from '../../../../../../main/webapp/app/entities/competition/competition.model';
import { EquipeService } from '../../../../../../main/webapp/app/entities/equipe';
import { PaysService } from '../../../../../../main/webapp/app/entities/pays';
import { StadeService } from '../../../../../../main/webapp/app/entities/stade';

describe('Component Tests', () => {

    describe('Competition Management Dialog Component', () => {
        let comp: CompetitionDialogComponent;
        let fixture: ComponentFixture<CompetitionDialogComponent>;
        let service: CompetitionService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PronosticsTestModule],
                declarations: [CompetitionDialogComponent],
                providers: [
                    EquipeService,
                    PaysService,
                    StadeService,
                    CompetitionService
                ]
            })
            .overrideTemplate(CompetitionDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CompetitionDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CompetitionService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Competition(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.competition = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'competitionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Competition();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.competition = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'competitionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
