export const state = () => ({
    contactDialog: false,
    error: false,
    errors: '',
    success: '',
    form_loading: false,
    contact:[],
});
export const mutations = {
    SET_DIALOG(state) {
        state.contactDialog = !state.contactDialog
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
};
