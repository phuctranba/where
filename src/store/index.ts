import {combineReducers} from 'redux';

import system from './reducer/system.reducer.store';
import user from './reducer/user.reducer.store';

/**
 * Reg and import store from here ...
 */

const rootReducer = combineReducers({
    system,
    user
});

export default rootReducer;

export type RootReducer = ReturnType<typeof rootReducer>
