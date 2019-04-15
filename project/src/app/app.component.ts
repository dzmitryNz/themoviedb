import { Component } from '@angular/core';
import { FilmService } from './services/film.service';
import { FilmInterface } from './interfaces/film.interface';
import { noop, Subscription } from 'rxjs';

import { params } from './services/film.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    inputFocusActive = false;
    selectedFilm?: FilmInterface;
    filmList?: FilmInterface[];
    title = 'Movie';
    subscriptionOnFilmList: Subscription;

    constructor(private filmService: FilmService) {}

    onInputFocus(): void {
        this.inputFocusActive = true;
    }

    onInputBlur(): void {
        this.inputFocusActive = false;
    }

    onInputChange(value: string) {
        this.filmService.count = 0;
        if (value && value.length > 2) {
            this.subscriptionOnFilmList = this.filmService
                .getFilmList(value)
                .subscribe(
                    stream => {
                        this.filmList = stream;
                        this.selectedFilm = this.filmList[0];
                    },
                    noop,
                    this.subscriptionOnFilmList
                        ? () => this.subscriptionOnFilmList.unsubscribe()
                        : noop
                );
        }
    }

    buttonClick($event: MouseEvent) {
        const { resultsOnPage } = params;
        this.filmService.count += resultsOnPage;
        if (this.filmService.count <= 20) {
            this.subscriptionOnFilmList = this.filmService
                .getPartialFilmList()
                .subscribe(
                    stream => {
                        this.filmList = stream;
                        this.selectedFilm = this.filmList[0];
                    },
                    noop,
                    this.subscriptionOnFilmList
                        ? () => this.subscriptionOnFilmList.unsubscribe()
                        : noop
                );
        }
    }

    onFilmListClick($event: MouseEvent): void {
        const { id } = $event.currentTarget as HTMLInputElement;
        const filmWithDescription = this.filmList.find(
            film => film.id.toString() === id
        );
        if (filmWithDescription) {
            this.selectedFilm = filmWithDescription;
        }
    }
}
