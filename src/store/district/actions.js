import axios from 'axios'
import { API_ROOT } from './constants'

// // // //

// District actions
export default {
  fetchCollection: ({ state, commit }) => {
    if (state.fetched) return
    commit('fetching', true)

    // Fetches Collection from the server
    axios.get(API_ROOT)
    .then((json) => {
      commit('collection', json)
      commit('fetching', false)
      commit('fetched', true)
    })
    .catch((err) => {
      commit('fetching', false)
      throw err // TODO - better error handling
    })
  },

  // TODO - remove
  toggleOrderBy ({ state, commit }) {
    const ORDER_ASC = 'asc'
    const ORDER_DESC = 'desc'
    if (state.orderBy === ORDER_ASC) {
      commit('orderBy', ORDER_DESC)
    } else {
      commit('orderBy', ORDER_ASC)
    }
  },

  // module/setFilter
  // Updates the current search query, invokes the module/filter mutation
  setFilter ({ commit }, filter) {
    commit('filter', filter)
  }
}
