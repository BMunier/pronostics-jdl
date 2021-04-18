import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EquipeService } from 'app/entities/equipe/equipe.service';
import { IEquipe, Equipe } from 'app/shared/model/equipe.model';

describe('Service Tests', () => {
  describe('Equipe Service', () => {
    let injector: TestBed;
    let service: EquipeService;
    let httpMock: HttpTestingController;
    let elemDefault: IEquipe;
    let expectedResult: IEquipe | IEquipe[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(EquipeService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new Equipe(0, 'AAAAAAA', 'AAAAAAA', 0, 'image/png', 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Equipe', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Equipe()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Equipe', () => {
        const returnedFromService = Object.assign(
          {
            codeEquipe: 'BBBBBB',
            nomEquipe: 'BBBBBB',
            rangFifa: 1,
            ecusson: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Equipe', () => {
        const returnedFromService = Object.assign(
          {
            codeEquipe: 'BBBBBB',
            nomEquipe: 'BBBBBB',
            rangFifa: 1,
            ecusson: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Equipe', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
