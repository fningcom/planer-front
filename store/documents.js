export const state = () => ({
    dialog: false,
    error: false,
    errors: '',
    success: '',
    groups: [],
    statuses: [],
    task_types: [],
    form_loading: false,
    document: [],
    open_document_id: null,
    open_document_events: [],

    documents: [],
    lastPage: 0,
    currentPage: 0,
    count: 0,
    filter_data: []
});

export const mutations = {
    STORE_DOCUMENTS(state, payload) {
        state.documents = payload
    },
    STORE_LAST_PAGE(state, payload) {
        state.lastPage = payload
    },
    STORE_CURRENT_PAGE(state, payload) {
        state.currentPage = payload
    },
    STORE_COUNT(state, payload) {
        state.count = payload
    },
    STORE_FILTER_DATA(state, payload) {
        state.filter_data = payload
    },
    SET_DIALOG(state) {
        state.dialog = !state.dialog
    },
    SET_GROUPS(state, payload) {
        // state.groups = payload.map(group => group.title);
        state.groups = payload;
    },
    SET_STATUSES(state, payload) {
        state.statuses = payload
    },
    SET_OPEN_DOC_ID(state, payload) {
        state.open_document_id = payload
    },
    STORE_DOCUMENT(state, payload) {
        state.document = payload.data
    },
    SET_DOCUMENT(state, payload) {
        state.document = payload
    },
    STORE_EVENTS(state, payload) {
        state.open_document_events = payload.data
    },
    SET_EVENTS(state, payload) {
        state.open_document_events = payload
    },
    SET_TYPES(state, payload) {
        // state.task_types = payload.map(task_types => task_types.title);
        state.task_types = payload
    },
    FORM_LOADING_OFF(state) {
        state.form_loading = false
    },
    FORM_LOADING_ON(state) {
        state.form_loading = true
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
    SUCCESS_STORE(state, success) {
        state.success = success
    },
    UPDATE_DOCUMENT_FIELD(state, {key, value}) {
        state.document[key] = value
    },
    CHANGE_DOC_STATUS(state, status_id) {
        state.document.status_id = status_id
        state.document.status = state.statuses[status_id - 1]
    },
};

export const actions = {
    async CREATE_DOCUMENT({commit, state}, data) {
        commit('FORM_LOADING_ON')
        try {
            const response = await this.$axios.post('/api/documents/', data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                })
                .then(function (response) {
                    if (response.data.success === false) {
                        commit('ERROR_ON')
                        commit("ERRORS_STORE", response.data)
                    } else {
                        commit('ERROR_OFF')
                        commit("ERRORS_STORE", [])
                        commit("SUCCESS_STORE", response.data.message)
                        commit("SET_OPEN_DOC_ID", response.data.open_document_id)
                        commit("SET_DOCUMENT", response.data.document)
                        commit('SET_EVENTS', response.data.events)
                    }
                })
                .catch(function (error) {
                    console.info(error)
                });
        } catch (error) {
            console.info(error)
        }
        commit('FORM_LOADING_OFF')
    },
    async GET_DOCUMENTS_FROM_API({commit, state}, [filter_data, user_id, page]) {
        commit('FORM_LOADING_ON')
        try {
            const response = await this.$axios.get(`/api/documents/${user_id}?page=${page}`, {
                params: filter_data
            });

            if (response.data.success === false) {
                commit('ERROR_ON');
                commit("ERRORS_STORE", response.data);
            } else {
                commit('ERROR_OFF');
                commit("ERRORS_STORE", []);
                // commit("SUCCESS_STORE", response.data.message);
                commit("STORE_DOCUMENTS", response.data.data);
                commit("STORE_CURRENT_PAGE", response.data.current_page);
                commit("STORE_LAST_PAGE", response.data.last_page);
                commit("STORE_COUNT", response.data.total);
            }
        } catch (error) {
            console.info(error);
        }
        commit('FORM_LOADING_OFF')
        // let url = '';
        // this.loading = true;
        // this.filter_data = data;
        // url = '/api/documents/' + this.currentUserId + '?page=' + page;
        // const response = await this.$axios.$get(url, {
        //     params: this.filter_data
        // });
        // this.documents = response.data;
        // this.lastPage = response.last_page;
        // this.currentPage = response.current_page;
        // this.count = response.total;
        // this.loading = false
    },
    async GET_DOCUMENT_FROM_API({commit, state}, document_id) {
        commit('STORE_DOCUMENT', [])
        commit("ERRORS_STORE", [])
        commit('ERROR_OFF')
        const response = await this.$axios.get('/api/documents/' + document_id + '/edit');
        const events = await this.$axios.get('/api/documents/' + document_id + '/events');
        commit('STORE_EVENTS', events)
        commit('STORE_DOCUMENT', response)
    },
    async UPDATE_DOCUMENT({commit, state}, data) {
        commit('FORM_LOADING_ON')
        try {
            const response = await this.$axios.post('/api/documents/' + state.open_document_id + '/update', data)
                .then(function (response) {
                    if (response.data.success === false) {
                        commit('ERROR_ON')
                        commit("ERRORS_STORE", response.data)
                    } else {
                        commit('ERROR_OFF')
                        commit("ERRORS_STORE", [])
                        commit("SUCCESS_STORE", response.data.message)
                    }
                })
                .catch(function (error) {
                    console.info(error)
                });
        } catch (error) {
            console.info(error)
        }
        commit('FORM_LOADING_OFF')
    },
};
