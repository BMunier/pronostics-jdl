import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PronosticsTestModule } from '../../../test.module';
import { CompetitionComponent } from 'app/entities/competition/competition.component';
import { CompetitionService } from 'app/entities/competition/competition.service';
import { Competition } from 'app/shared/model/competition.model';

describe('Component Tests', () => {
  describe('Competition Management Component', () => {
    let comp: CompetitionComponent;
    let fixture: ComponentFixture<CompetitionComponent>;
    let service: CompetitionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PronosticsTestModule],
        declarations: [CompetitionComponent],
      })
        .overrideTemplate(CompetitionComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CompetitionComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CompetitionService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Competition(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.competitions && comp.competitions[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
