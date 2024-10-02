export const state = () => ({
    contactDialog: false,
    contactRelationDialog: false,
    error: false,
    errors: '',
    success: '',
    form_loading: false,
    contact:[],
    related_contact:[],
    contact_found: [],
    edit_contact_loading: false,
    load_relation_contact: false,
    contact_relation: false, // Включен если при создании лица добавляетя связь к контакту
    contact_relation_contact_id: null,
});
export const mutations = {
    SET_CONTACT_DIALOG(state) {
        state.contactRelationDialog = !state.contactRelationDialog
    },
    SET_CONTACT_RELATION_ON(state, { contact_id }) {
        state.contact_relation_contact_id = contact_id;
        state.contact_relation = true
    },
    SET_CONTACT_RELATION_OFF(state) {
        state.contact_relation_contact_id = null;
        state.contact_relation = false
    },
    SET_DIALOG(state) {
        state.contactDialog = !state.contactDialog
    },
    EDIT_CONTACT_LOADING(state) {
        state.edit_contact_loading = !state.edit_contact_loading
    },
    LOAD_RELATION_CONTACT(state) {
        state.load_relation_contact = !state.load_relation_contact
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
    SET_CONTACT_FOUND(state, payload) {
        state.contact_found = payload
    },
    STORE_CONTACT(state, payload) {
        state.contact = payload.data
    },
    STORE_RELATED_CONTACT(state, payload) {
        state.related_contact = payload.data
    },
    EMPTY_RELATED_CONTACT(state, payload) {
        state.related_contact = []
        state.contact_relation = false;
        state.contact_relation_contact_id = null
    },
};

export const actions = {
    async CREATE_CONTACT({ state, commit }, data) {
        commit('FORM_LOADING_ON');
        try {
            const response = await this.$axios.post('/api/contacts', data, {
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
                if(!state.contact_relation_contact_id) {
                    commit('SET_DIALOG');
                }
            }
        } catch (error) {
            console.info(error);
        }
        commit('FORM_LOADING_OFF');
    },
    async UPDATE_CONTACT({ state, commit }, data) {
        commit('FORM_LOADING_ON');
        let url;
        if(state.related_contact && state.related_contact.id) {
            url = '/api/contacts/' + state.related_contact.id + '/update'
        }else{
            url = '/api/contacts/' + state.contact.id + '/update'
        }
        try {
            const response = await this.$axios.post(url, data, {
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
                if(!state.contact_relation_contact_id) {
                    commit('SET_DIALOG');
                }
            }
        } catch (error) {
            console.info(error);
        }
        commit('FORM_LOADING_OFF');
    },
    async BIND_CONTACT({ state, commit }, data) {
        commit('FORM_LOADING_ON');
        try {
            const response = await this.$axios.post('/api/contacts/bind', data);
            if (response.data.success === false) {
                commit('ERROR_ON');
                commit('ERRORS_STORE', response.data);
            } else {
                commit('ERROR_OFF');
                commit('ERRORS_STORE', []);
                if(!state.contact_relation_contact_id) {
                    commit('SET_DIALOG');
                }
            }
        } catch (error) {
            console.info(error);
        }
        commit('FORM_LOADING_OFF');
    },
    async IMPORT_CONTACTS({ commit }, data) {
        commit('FORM_LOADING_ON');
        try {
            const response = await this.$axios.post('/api/contacts-import', data);
            if (response.data.success === false) {
                commit('ERROR_ON');
                commit('ERRORS_STORE', response.data);
            } else {
                commit('ERROR_OFF');
                commit('ERRORS_STORE', []);
                commit('SET_DIALOG');
            }
        } catch (error) {
            console.info(error);
        }
        commit('FORM_LOADING_OFF');
    },
    async GET_CONTACT_FROM_API({commit, state}, contact_id) {
        commit('STORE_CONTACT', [])
        commit("ERRORS_STORE", [])
        commit('ERROR_OFF')
        commit('EDIT_CONTACT_LOADING')
        const response = await this.$axios.get('/api/contacts/' + contact_id + '/edit');
        commit('STORE_CONTACT', response.data)
        commit('EDIT_CONTACT_LOADING')
    },
    async GET_RELATED_CONTACT_FROM_API({commit, state}, contact_id) {
        commit('LOAD_RELATION_CONTACT')
        const response = await this.$axios.get('/api/contacts/' + contact_id + '/edit');
        commit('STORE_RELATED_CONTACT', response.data)
        commit('LOAD_RELATION_CONTACT')
    },
}
