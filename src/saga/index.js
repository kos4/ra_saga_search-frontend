import {takeLatest, debounce, put, spawn, retry} from 'redux-saga/effects';
import {searchSkillsFailure, searchSkillsRequest, searchSkillsSuccess} from '../actions/actionCreators';
import {CHANGE_SEARCH_FIELD, SEARCH_SKILLS_REQUEST} from '../actions/actionTypes';
import {searchSkills} from "../api";

function filterChangeSearchAction({type, payload}) {
  return type === CHANGE_SEARCH_FIELD && payload.search.trim() !== '';
}
function* handleChangeSearchSaga(action) {
  yield put(searchSkillsRequest(action.payload.search));
}

function* handleSearchSkillsSaga(action) {
  try {
    const data = yield retry(3, 500, searchSkills, action.payload.search);
    yield put(searchSkillsSuccess(data));
  } catch (e) {
    yield put(searchSkillsFailure(e.message));
  }
}
function* watchChangeSearchSaga() {
  yield debounce(500, filterChangeSearchAction, handleChangeSearchSaga);
}
function* watchSearchSkillsSaga() {
  yield takeLatest(SEARCH_SKILLS_REQUEST, handleSearchSkillsSaga);
}
export default function* saga() {
  yield spawn(watchChangeSearchSaga);
  yield spawn(watchSearchSkillsSaga)
}
