export const state = () => ({
    faceDialog: false,
    error: false,
    errors: '',
    success: '',
    form_loading: false,
    face: [],
    edit_face_loading: false
});


export const mutations = {
    SET_FACE_DIALOG(state) {
        state.faceDialog = !state.faceDialog
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
    STORE_FACE(state, payload) {
        state.face = payload.data
    },
    EDIT_FACE_LOADING(state) {
        state.edit_face_loading = !state.edit_face_loading
    },
};

export const actions = {
    async CREATE_FACE({commit}, data) {
        commit('FORM_LOADING_ON');
        try {
            const response = await this.$axios.post('/api/faces', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            if (response.data.success === false) {
                commit('ERROR_ON');
                commit('ERRORS_STORE', response.data);
            } else {
                commit('ERROR_OFF');
                commit('ERRORS_STORE', []);
                commit('SET_FACE_DIALOG');
            }
        } catch (error) {
            console.info(error);
        }
        commit('FORM_LOADING_OFF');
    },
    async UPDATE_FACE({commit, state}, data) {
        commit('FORM_LOADING_ON');
        try {
            const response = await this.$axios.post('/api/faces/' + state.face.id + '/update', data);
            if (response.data.success === false) {
                commit('ERROR_ON');
                commit('ERRORS_STORE', response.data);
            } else {
                commit('ERROR_OFF');
                commit('ERRORS_STORE', []);
                commit('SET_FACE_DIALOG');
            }
        } catch (error) {
            console.info(error);
        }
        commit('FORM_LOADING_OFF');
    },
    async GET_FACE_FROM_API({commit, state}, face_id) {
        commit('STORE_FACE', [])
        commit("ERRORS_STORE", [])
        commit('ERROR_OFF')
        commit('EDIT_FACE_LOADING')
        const response = await this.$axios.get('/api/faces/' + face_id + '/edit');
        commit('STORE_FACE', response.data)
        commit('EDIT_FACE_LOADING')
    },
};
