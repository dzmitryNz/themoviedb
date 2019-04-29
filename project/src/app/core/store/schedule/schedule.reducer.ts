import * as _ from 'lodash';

import { ScheduleActionTypes, ScheduleActions } from './schedule.actions';
import { ScheduleState, InitialScheduleState } from './schedule.state';
import { Film } from '../../models';

export function scheduleReducer(
    state = InitialScheduleState,
    action: ScheduleActions
): ScheduleState {
    switch (action.type) {
        /**
         * add film to watch list
         */
        case ScheduleActionTypes.CREATE_FILM: {
            return _.assign(
                {},
                {
                    ...state,
                    loading: true
                }
            );
        }

        case ScheduleActionTypes.CREATE_FILM_SUCCESS: {
            const uid = (action.payload as Film).id;
            const filmInState = state.filmsToWatch.find(
                film => film.id === uid
            );
            if (!filmInState) {
                return _.assign({}, state, {
                    filmsToWatch: [
                        ...state.filmsToWatch,
                        _.assign({}, action.payload, {
                            inScheduleList: true
                        })
                    ],
                    loading: false,
                    loaded: true
                });
            }
            return _.assign(
                {},
                {
                    ...state,
                    loading: false,
                    loaded: true
                }
            );
        }

        case ScheduleActionTypes.CREATE_FILM_ERROR: {
            const error = action.payload;
            return _.assign(
                {},
                {
                    ...state,
                    loading: false,
                    loaded: false,
                    error
                }
            );
        }

        /**
         * delete film from watch list
         */
        case ScheduleActionTypes.DELETE_FILM: {
            return _.assign(
                {},
                {
                    ...state,
                    loading: true
                }
            );
        }

        case ScheduleActionTypes.DELETE_FILM_SUCCESS: {
            const uid = (action.payload as Film).id;
            return _.assign({}, state, {
                filmsToWatch: [
                    ...state.filmsToWatch.filter(film => film.id !== uid)
                ],
                loading: false,
                loaded: true
            });
        }

        case ScheduleActionTypes.DELETE_FILM_ERROR: {
            const error = action.payload;
            return _.assign(
                {},
                {
                    ...state,
                    loading: false,
                    loaded: false,
                    error
                }
            );
        }

        default: {
            return state;
        }
    }
}
