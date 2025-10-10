<template>
  <div>
    <v-card class="d-flex" flat tile>
      <h2 class="pa-2 mr-auto mb-2">Глобальный поиск</h2>
    </v-card>
    <task-form :dialog="task_dialog"/>
    <document-form :dialog="document_dialog"/>
    <div style="padding: 12px;">
      <v-text-field
        label="Поиск по ФИО, uid, email, телефону, контактам и т.д..."
        append-icon="mdi mdi-magnify"
        required
        v-model="query"
        @keyup.enter="search"
        outlined
        dense
        hide-details
        @keydown.esc="clearSearch"
        style="background-color: #eae9fb;"
      ></v-text-field>
    </div>
    <div style="padding: 15px" v-if="form_loading">
      <v-progress-linear
        indeterminate
        color="deep-purple lighten-2"
      ></v-progress-linear>
    </div>

    <div v-if="faces && contacts && faces.length === 0 && contacts.length === 0 && !form_loading" style="margin: 0 10px">
      <v-alert
        dense
        outlined
        type="error"
      >
        По Вашему запросу ничего не найдено!
      </v-alert>
    </div>

    <data-contact-table :query="query"/>
    <data-face-table :query="query"/>

  </div>
</template>

<script>
import TaskForm from "~/components/main/form.vue";
import {mapState} from "vuex";
import DocumentForm from "~/components/personal/documents/form.vue";
import DataFaceTable from "~/components/main/table-face.vue";
import DataContactTable from "~/components/main/table-contact.vue";

export default {
  name: "index",
  data() {
    return {
      query: '',
    }
  },
  components: {DataContactTable, DataFaceTable, DocumentForm, TaskForm},
  computed: {
    ...mapState('tasks', ['task_dialog']),
    ...mapState('documents', ['document_dialog']),
    ...mapState('main', ['contacts', 'faces', 'form_loading']),
  },
  methods: {
    openDialog() {
      this.$store.commit('tasks/SET_DIALOG');
    },
    clearSearch() {
      this.query = '';
      this.resetFilter();
    },
    async search() {
      await this.$store.dispatch('main/SEARCH_FACES_FROM_API', [this.query, 1]);
      await this.$store.dispatch('main/SEARCH_CONTACTS_FROM_API', [this.query, 1]);
    },
    async resetFilter() {
      this.$store.commit('main/RESET');
    },
  }
}
</script>

<style scoped>

</style>
