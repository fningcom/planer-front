export const state = () => ({
    users: [],
    contact_types: [],
    device_types: [],
});

export const mutations = {
    SET_USERS(state, payload) {
        state.users = payload
    },
    SET_CONTACT_TYPES(state, payload) {
        state.contact_types = payload
    },
    SET_DEVICE_TYPES(state, payload) {
        state.device_types = payload
    },
};
