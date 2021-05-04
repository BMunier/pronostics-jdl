import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PronosticsTestModule } from '../../../test.module';
import { StadeDetailComponent } from 'app/entities/stade/stade-detail.component';
import { Stade } from 'app/shared/model/stade.model';

describe('Component Tests', () => {
  describe('Stade Management Detail Component', () => {
    let comp: StadeDetailComponent;
    let fixture: ComponentFixture<StadeDetailComponent>;
    const route = ({ data: of({ stade: new Stade(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PronosticsTestModule],
        declarations: [StadeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(StadeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(StadeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load stade on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.stade).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
