
import { Injectable } from '@angular/core';

import {
    fakeAsync,
    inject,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import {
    HttpModule, Http, ResponseOptions,
    Response,
    BaseRequestOptions,
    ConnectionBackend
} from '@angular/http';

import { MockBackend, MockConnection } from '@angular/http/testing';
import { assert, expect } from 'chai';

import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

declare var jQuery: any;

import { AppComponent } from '../app.component';
import { GridComponent } from './grid.component';
import { Puzzle } from '../models/puzzle';
import { RestApiProxyService } from '../services/rest-api-proxy.service';
import { GridManagerService } from '../services/grid-manager.service';
import { FAKE_PUZZLE_FEED, INITIAL_PUZZLE_SEED } from '../services/mock-data';
import { PuzzleEventManagerService } from '../services/puzzle-event-manager.service';

// Mock the REST API Service to give a fake result after a request.
@Injectable()
class MockRestApiService extends RestApiProxyService {
    _newPuzzleUrl: 'http://localhost:3002/api/puzzle';

    getNewPuzzle(): Observable<Puzzle> {
        return Observable.of(new Puzzle(FAKE_PUZZLE_FEED));
    }
}

describe('GridComponent', () => {

    let comp: GridComponent;
    let fixture: ComponentFixture<GridComponent>;

    const FAKE_INITIAL_PUZZLE = new Puzzle(INITIAL_PUZZLE_SEED);
    const FAKE_PUZZLE = new Puzzle(FAKE_PUZZLE_FEED);

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [GridComponent, AppComponent], // declare the test component
            imports: [FormsModule, HttpModule],
            providers: [
                {   // Import the necessary providers
                    provide: Http,

                    // Add a factory for the backend
                    useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
                { provide: RestApiProxyService, useClass: MockRestApiService },
                { provide: GridManagerService, PuzzleEventManagerService },
                MockBackend,
                MockRestApiService,
                BaseRequestOptions
            ]
        })
            .compileComponents()  // compile template and css;
            .then(() => {
                fixture = TestBed.createComponent(GridComponent);
                comp = fixture.componentInstance;
            });

    });

    beforeEach(inject([RestApiProxyService, MockBackend],
        fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {

            mockBackend.connections.subscribe((connection: MockConnection) => {
                // Send a fake data to the caller
                connection.mockRespond(new Response(new ResponseOptions({ body: FAKE_PUZZLE_FEED })));
            });

            fixture = TestBed.createComponent(GridComponent);
            comp = fixture.componentInstance;
        })));

    // //Testing the method InitializeCurrentGrid by giving an empty grid.
    it("initializeCurrentGrid should throw a null argument error", () => {
        comp._newPuzzle = null;
        assert.throws(() => comp.initializeCurrentGrid(), Error, "The initial grid cannot be null");
    });

    // Testing the method InitializeCurrentGrid by using a valid grid.
    it("initializeCurrentGrid should reset the current grid",
        inject([GridManagerService], (gridManagerService: GridManagerService) => {

            // Must be completed
            comp._newPuzzle = FAKE_PUZZLE;
            comp.initializeCurrentGrid();

            // Check the expected result
            expect(comp._newPuzzle).to.deep.equal(FAKE_INITIAL_PUZZLE);
        }));

    //test the method extractThenewPuzzle of the component with a null argument.
    it('extractTheNewPuzzle should throw a null argument error', () => {
        assert.throws(() => comp.extractTheNewPuzzle(null), Error, "The parameter cannot be null");
    });

    //test the method extractThenewPuzzle of the component with a valid grid.
    it("extractTheNewPuzzle should return a valid puzzle",
        inject([GridManagerService], (gridManagerService: GridManagerService) => {
            let newPuzzle = comp.extractTheNewPuzzle(FAKE_INITIAL_PUZZLE)._puzzle;
            expect(newPuzzle).to.deep.equal(INITIAL_PUZZLE_SEED);
        }));

    it("validateInputValue, should throw a null argument error", () => {
        assert.throws(() => comp.validateInputValue(null), Error, "No event source is provided.");
    });

    it("validateInputValue, should return false", () => {
        // TODO: Must be completed, remove the next lines after a clean debug

        // var event = jQuery.Event("keyup");
        // event.keyCode = 72;
        // jQuery("#12").trigger(event);

        // let h1 = de.nativeElement;

        // expect(h1.innerText).to.match(/Sudoku/i,
        //     '<h1> should say something about "Angular"');

        // // Create a new jQuery.Event object with specified event properties.
        // var fakeEvent = jQuery.Event("keydown", { keyCode: 64 });

        // // trigger an artificial keydown event with keyCode 64
        // //jQuery("body").trigger(fakeEvent);

        // //fakeEvent.target.dispatchEvent(fakeEvent)

        // console.log(jQuery("#cell12").val(), "id");
    });
});