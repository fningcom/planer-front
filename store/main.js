export const state = () => ({
  form_loading: false,
  error: false,
  errors: '',
  contacts: [],
  faces: [],
  lastPage: 0,
  currentPage: 0,
  face_count: 0,
  lastPageContacts: 0,
  currentPageContacts: 0,
  face_count_contacts: 0,
});
export const mutations = {
  SET_TASK_DIALOG(state) {
    state.task_form_dialog = !state.task_form_dialog
  },
  SET_DOCUMENT_DIALOG(state) {
    state.document_form_dialog = !state.document_form_dialog
  },
  FORM_LOADING_OFF(state) {
    state.form_loading = false
  },
  FORM_LOADING_ON(state) {
    state.form_loading = true
  },
  STORE_FACES(state, payload) {
    state.faces = payload
  },
  STORE_CONTACTS(state, payload) {
    state.contacts = payload
  },
  ERROR_ON(state) {
    state.error = true
  },
  ERROR_OFF(state) {
    state.error = false
  },
  ERRORS_STORE(state, errors) {
    state.errors = errors
  },
  STORE_LAST_PAGE(state, payload) {
    state.lastPage = payload
  },
  STORE_CURRENT_PAGE(state, payload) {
    state.currentPage = payload
  },
  STORE_FACE_COUNT(state, payload) {
    state.face_count = payload
  },
  STORE_CONTACTS_LAST_PAGE(state, payload) {
    state.lastPageContacts = payload
  },
  STORE_CONTACTS_CURRENT_PAGE(state, payload) {
    state.currentPageContacts = payload
  },
  STORE_CONTACTS_FACE_COUNT(state, payload) {
    state.face_count_contacts = payload
  },
  RESET(state){
    state.faces = []
    state.contacts = []
  }
}
export const actions = {
  async SEARCH_FACES_FROM_API({commit, state}, [query, page]) {
    commit('FORM_LOADING_ON')
    try {
      console.log(query)
      const response = await this.$axios.get(`/api/main/global-search-faces?query=${query}&page=${page}`);
      if (response.data.success === false) {
        commit('ERROR_ON');
        commit("ERRORS_STORE", response.data);
      } else {
        commit('ERROR_OFF');
        commit("ERRORS_STORE", []);

        commit("STORE_FACES", response.data.faces.data);
        commit("STORE_CURRENT_PAGE", response.data.faces.current_page);
        commit("STORE_LAST_PAGE", response.data.faces.last_page);
        commit("STORE_FACE_COUNT", response.data.faces.total);
      }
    } catch (error) {
      console.info(error);
    }
    commit('FORM_LOADING_OFF')
  },
  async SEARCH_CONTACTS_FROM_API({commit, state}, [query, page]) {
    commit('FORM_LOADING_ON')
    try {
      console.log(query)
      const response = await this.$axios.get(`/api/main/global-search-contacts?query=${query}&page=${page}`);
      if (response.data.success === false) {
        commit('ERROR_ON');
        commit("ERRORS_STORE", response.data);
      } else {
        commit('ERROR_OFF');
        commit("ERRORS_STORE", []);

        commit("STORE_CONTACTS", response.data.contacts.data);
        commit("STORE_CONTACTS_CURRENT_PAGE", response.data.contacts.current_page);
        commit("STORE_CONTACTS_LAST_PAGE", response.data.contacts.last_page);
        commit("STORE_CONTACTS_FACE_COUNT", response.data.contacts.total);
      }
    } catch (error) {
      console.info(error);
    }
    commit('FORM_LOADING_OFF')
  },
}
