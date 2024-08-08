export const state = () => ({
    deviceDialog: false,
    error: false,
    errors: '',
    success: '',
    form_loading: false,
    device: [],
    edit_device_loading: false
});


export const mutations = {
    SET_DEVICE_DIALOG(state) {
        state.deviceDialog = !state.deviceDialog
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
    STORE_DEVICE(state, payload) {
        state.device = payload.data
    },
    EDIT_DEVICE_LOADING(state) {
        state.edit_device_loading = !state.edit_device_loading
    },
};

export const actions = {
    async CREATE_DEVICE({commit}, data) {
        commit('FORM_LOADING_ON');
        try {
            const response = await this.$axios.post('/api/devices', data, {
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
                commit('SET_DEVICE_DIALOG');
            }
        } catch (error) {
            console.info(error);
        }
        commit('FORM_LOADING_OFF');
    },
    async UPDATE_DEVICE({commit, state}, data) {
        commit('FORM_LOADING_ON');
        try {
            const response = await this.$axios.post('/api/devices/' + state.device.id + '/update', data);
            if (response.data.success === false) {
                commit('ERROR_ON');
                commit('ERRORS_STORE', response.data);
            } else {
                commit('ERROR_OFF');
                commit('ERRORS_STORE', []);
                commit('SET_DEVICE_DIALOG');
            }
        } catch (error) {
            console.info(error);
        }
        commit('FORM_LOADING_OFF');
    },

    async GET_DEVICE_FROM_API({commit, state}, device_id) {
        commit('STORE_DEVICE', [])
        commit("ERRORS_STORE", [])
        commit('ERROR_OFF')
        commit('EDIT_DEVICE_LOADING')
        const response = await this.$axios.get('/api/devices/' + device_id + '/edit');
        commit('STORE_DEVICE', response.data)
        commit('EDIT_DEVICE_LOADING')
    },
};
