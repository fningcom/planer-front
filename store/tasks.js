export const state = () => ({
    dialog: false,
    error: false,
    errors: '',
    success: '',
    groups: [],
    statuses: [],
    task_types: [],
    form_loading: false,
    task: [],
    open_task_id: null,
    open_task_events: [],
    tasks: [],
    lastPage: 0,
    currentPage: 0,
    count: 0,
    filter_data: [],
    task_subtypes: []
});

export const mutations = {
    STORE_TASKS(state, payload) {
        state.tasks = payload
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
    SET_OPEN_TASK_ID(state, payload) {
        state.open_task_id = payload
    },
    STORE_TASK(state, payload) {
        state.task = payload.data
    },
    SET_TASK(state, payload) {
        state.task = payload
    },
    STORE_EVENTS(state, payload) {
        state.open_task_events = payload.data
    },
    SET_EVENTS(state, payload) {
        state.open_task_events = payload
    },
    SET_TYPES(state, payload) {
        // state.task_types = payload.map(task_types => task_types.title);
        state.task_types = payload
    },
    SET_SUBTYPES(state, payload) {
        state.task_subtypes = payload
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
    UPDATE_TASK_FIELD(state, {key, value}) {
        state.task[key] = value
    },
    CHANGE_TASK_STATUS(state, status_id) {
        state.task.status_id = status_id
        state.task.status = state.statuses[status_id - 1]
    },
};

export const actions = {
    async CREATE_TASK({commit, state}, data) {
        commit('FORM_LOADING_ON')
        try {
            const response = await this.$axios.post('/api/tasks/', data,
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
                        commit("SET_OPEN_TASK_ID", response.data.open_task_id)
                        commit("SET_TASK", response.data.task)
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
    async GET_TASK_FROM_API({commit, state}, task_id) {
        commit('STORE_TASK', [])
        commit("ERRORS_STORE", [])
        commit('ERROR_OFF')
        const response = await this.$axios.get('/api/tasks/' + task_id + '/edit');
        const events = await this.$axios.get('/api/tasks/' + task_id + '/events');
        commit('STORE_EVENTS', events)
        commit('STORE_TASK', response)
    },
    async GET_TASKS_FROM_API({commit, state}, [filter_data, user_id, page]) {
        commit('FORM_LOADING_ON')
        try {
            const response = await this.$axios.get(`/api/tasks/${user_id}?page=${page}`, {
                params: filter_data
            });

            if (response.data.success === false) {
                commit('ERROR_ON');
                commit("ERRORS_STORE", response.data);
            } else {
                commit('ERROR_OFF');
                commit("ERRORS_STORE", []);
                commit("STORE_TASKS", response.data.data);
                commit("STORE_CURRENT_PAGE", response.data.current_page);
                commit("STORE_LAST_PAGE", response.data.last_page);
                commit("STORE_COUNT", response.data.total);
            }
        } catch (error) {
            console.info(error);
        }
        commit('FORM_LOADING_OFF')
    },
    async UPDATE_TASK({commit, state}, data) {
        commit('FORM_LOADING_ON')
        try {
            const response = await this.$axios.post('/api/tasks/' + state.open_task_id + '/update', data)
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
}
