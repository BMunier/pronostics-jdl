import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PronosticsTestModule } from '../../../test.module';
import { PronosticDetailComponent } from 'app/entities/pronostic/pronostic-detail.component';
import { Pronostic } from 'app/shared/model/pronostic.model';

describe('Component Tests', () => {
  describe('Pronostic Management Detail Component', () => {
    let comp: PronosticDetailComponent;
    let fixture: ComponentFixture<PronosticDetailComponent>;
    const route = ({ data: of({ pronostic: new Pronostic(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PronosticsTestModule],
        declarations: [PronosticDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(PronosticDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PronosticDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load pronostic on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.pronostic).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
