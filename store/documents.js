export const state = () => ({
    dialog: false,
    error: false,
    errors: '',
    success: '',
    groups: [],
    statuses: [],
    task_types:[],
    form_loading: false,
    document:[],
    open_document_id: null
});

export const mutations = {
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
                        commit("SET_OPEN_DOC_ID", response.data.success.id)
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
    async GET_DOCUMENT_FROM_API({commit, state}, document_id) {
        commit('STORE_DOCUMENT', [])
        commit("ERRORS_STORE", [])
        commit('ERROR_OFF')
        const response = await this.$axios.get('/api/documents/' + document_id + '/edit');
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
