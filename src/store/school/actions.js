import _ from 'lodash'
import axios from 'axios'
import { API_ROOT } from './constants'
import { PAGINATION_ACTIONS } from '@/store/lib/mixins'

let debouncedFetch

// // // //

// School module actions
export default {
  ...PAGINATION_ACTIONS,
  fetchCollection: ({ getters, commit, dispatch }) => {
    commit('fetching', true)
    commit('fetching_model', true)

    // Fetches Collection from the server
    axios.get(getters['fetchUrl'], {
      params: {
        ...getters['paginationQuery'],
        ...getters['apiQuery']
      }
    })
    .then((json) => {
      commit('currentPage', json.page)
      commit('pageSize', json.per_page)
      commit('collection', json.items)
      commit('fetching', false)

      // Fetches the first model in response
      if (json.items[0]) dispatch('selectModel', json.items[0]._id)
    })
    .catch((err) => {
      commit('fetching', false)
      throw err // TODO - better error handling
    })
  },

  fetchModel: ({ state, commit }) => {
    commit('fetching_model', true)

    // Fetches Model from the server
    axios.get(API_ROOT + '/' + state.selected_model_id)
    .then((json) => {
      commit('model', json)
      setTimeout(() => {
        commit('fetching_model', false)
      }, 250)
    })
    .catch((err) => {
      commit('fetching_model', false)
      throw err // TODO - better error handling
    })
  },

  selectModel: ({ commit, dispatch }, model_id) => {
    commit('selected_model_id', model_id)
    dispatch('fetchModel')
  },

  // setFilter
  // Updates the current search query, invokes the module/filter mutation
  setFilter ({ commit, dispatch }, filter) {
    if (!debouncedFetch) {
      debouncedFetch = _.debounce((localFilter) => {
        commit('filter', localFilter)
        dispatch('fetchCollection')
      }, 800)
    }
    debouncedFetch(filter)
  },

  // setDistrict
  // Updates the current district query
  setDistrict ({ commit, dispatch }, district) {
    commit('district', district)
    dispatch('fetchCollection')
  },

  // clearQuery
  // Clears state.district and state.filter
  clearQuery ({ commit, dispatch }) {
    commit('district', 'Troy')
    commit('filter', '')
    commit('currentPage', 1)
    dispatch('fetchCollection')
  }

}
