export const state = () => ({
    dialog: false,
    groups: [],
    statuses: [],
    task_types:[],
    form_loading: false
});

export const mutations = {
    SET_DIALOG(state) {
        state.dialog = !state.dialog
    },
    SET_GROUPS(state, payload) {
        state.groups = payload.map(group => group.title);
    },
    SET_STATUSES(state, payload) {
        state.statuses = payload
    },
    SET_TYPES(state, payload) {
        state.task_types = payload.map(task_types => task_types.title);
    },
    FORM_LOADING_OFF(state) {
        state.form_loading = false
    },
    FORM_LOADING_ON(state) {
        state.form_loading = true
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
