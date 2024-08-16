<template>
    <div @keydown.esc="resetForm">
        <v-form @submit.prevent="submitFilter">
            <v-container>
                <v-row align="stretch">
                    <v-col cols="6" md="6">
                        <v-text-field
                                type="text"
                                v-model="search"
                                label="Глобальный поиск"
                                outlined
                                dense
                                hide-details
                                class="mb-1"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="2" md="2">
                        <div class="d-flex justify-start">
                            <v-btn color="cyan darken-3" dark @click="submitFilter" class="mr-2">
                                <v-icon dark left>mdi mdi-magnify</v-icon>
                                Поиск
                            </v-btn>
                            <v-btn color="pink lighten-1" dark @click="resetForm">
                                <v-icon dark left>mdi mdi-close-thick</v-icon>
                                Сбросить
                            </v-btn>
                        </div>

                    </v-col>
                </v-row>
            </v-container>
        </v-form>
        <v-divider />
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "filters",
        data() {
            return {
                search: ''
            }
        },
        mounted() {
        },
        computed: {
            ...mapState('documents', ['groups', 'statuses']),
            ...mapState('layout', ['users']),
            isAdmin() {
                return this.$auth.user.isAdmin
            }
        },
        methods: {
            submitFilter() {
                this.$emit('submitFilter', {
                    search: this.search,
                })
            },
            resetForm(e) {
                this.search = "";
                this.$emit('resetFilter', {
                    search: "",
                })
            },
        },
    }
</script>

<style>
    .tab_day {
        width: 285px;
        margin-top: 15px;
    }

    .v-input--selection-controls {
        margin: 5px 0 0 0;
        padding: 0;
    }

    .v-input--radio-group--column .v-radio:not(:last-child):not(:only-child) {
        margin-bottom: 3px;
    }

    .d_type_block {
        margin-top: 10px;
        margin-left: 20px;
        margin-bottom: -2px;
    }
</style>
