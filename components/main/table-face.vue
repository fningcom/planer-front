<template>
  <div>
    <div v-if="faces && faces.length > 0">
      <v-data-table
        v-model="selected"
        :headers="faces_headers"
        :items="faces"
        item-key="id"
        class="elevation-1 my-2 auto-width-table no-border"
        :item-class="itemRowBackground"
        loading-text="Загрузка данных... Пожалуйста ожидайте"
        hide-default-footer
        checkbox-color="primary"
        :items-per-page=6
        dense
      >
        <template v-slot:top>
          <h3 style="margin: 10px 0 0 10px; color: #2196f3">Лица</h3>
          <v-alert dense type="info" color="info" style="margin:0 5px 10px 10px; font-size: 14px;">
            По вашему запросу найдено: {{ face_count }} лиц
          </v-alert>
        </template>
        <template v-slot:item.count="{ item }">
          {{ item.count + item.contacts.length + item.devices.length + item.faces.length }}
        </template>
        <template v-slot:item.tasks="{ item }">
          <div v-if="item.tasks && item.tasks.length">
            <ul class="ma-0 pa-0" style="list-style: none;">
              <li
                v-for="task in item.tasks"
                :key="task.id"
                class="list-task"
              ><v-icon style="color: green;   font-size: 16px;">mdi mdi-file-document-check-outline </v-icon>
                <a
                  href="#"
                  @click.prevent="openTask(task.id)"

                >
                  <span v-if="task.type.title === 'Компьютерный поиск'"><b>КП </b> </span><span v-else>{{ task.type.title }}</span>
                  №{{ task.id }} от {{ formatDate(task.created_at) }}
                </a>
              </li>
            </ul>
          </div>
          <div v-else class="text-grey"><v-icon style="color: darkgrey;   font-size: 16px;">mdi mdi-file-document-remove-outline</v-icon></div>
        </template>
        <template v-slot:item.documents="{ item }">
          <div v-if="item.documents && item.documents.length">
            <ul class="ma-0 pa-0" style="list-style: none;">
              <li
                v-for="document in item.documents"
                :key="document.id"
                class="list-task"
              ><v-icon style="color: green;   font-size: 16px;">mdi mdi-file-document-check-outline </v-icon>
                <a
                  href="#"
                  @click.prevent="openDocument(document.id)"

                >
                 <b>{{ document.source.title }}</b> №{{ document.incoming_number }} от {{ formatDate(document.incoming_date) }}
                </a>
              </li>
            </ul>
          </div>
          <div v-else class="text-grey"><v-icon style="color: darkgrey;   font-size: 16px;">mdi mdi-file-document-remove-outline</v-icon></div>
        </template>
        <template v-slot:item.birthday="{ item }">
          {{ new Date(item.birthday).toLocaleDateString('ru-RU') }} г.р.
        </template>
        <template v-slot:item.phone="{ item }">
          {{ formatPhone(item.phone) }}
        </template>
        <template v-slot:item.formatted_created_at="{ item }">
          {{ new Date(item.created_at).toLocaleDateString('ru-RU', {dateStyle: 'medium'}) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon style="cursor:pointer" @click="editDialog(item.id)">mdi-pencil</v-icon>
        </template>

      </v-data-table>
      <div v-if="face_count && face_count > 6">
      <v-pagination
        v-if="query"
        v-model="currentPage"
        :length="lastPage"
        :total-visible="7"
        @input="searchPageChange"
        class="mt-4"
      ></v-pagination>
      <v-pagination
        v-else
        v-model="currentPage"
        :length="lastPage"
        :total-visible="7"
        @input="handlePageChange"
        class="mt-4"
      ></v-pagination>
      </div>

    </div>
   </div>
</template>

<script>
import {formatPhone} from '../../plugins/phoneFormat.js';
import {mapState} from 'vuex';

export default {
  name: "DataFaceTable",
  props: ['query'],
  data() {
    return {
      snackbar: false,
      categories: [],
      loading: false,
      selected: [],
      activeMessage: null,
      singleSelect: true,
      msg: {},
      faces_headers: [
        {text: 'ID', value: 'id', sortable: false, width: "50"},       // маленький фиксированный
        {text: 'Создан', value: 'formatted_created_at', sortable: false, width: "140"}, // автоширина
        {text: 'ФИО', value: 'full_name', sortable: false, width: "300"}, // фиксированная
        {text: 'Дата рождения', value: 'birthday', sortable: false, width: "130"},       // автоширина
        {text: 'Телефон', value: 'phone', sortable: false, width: "170"},  // можно чуть больше
        {text: 'Гражданство', value: 'citizen', sortable: false, width: "120"},
        {text: 'Задачи', value: 'tasks', sortable: false},                 // автоширина
        {text: 'Документы', value: 'documents', sortable: false},
      ]
    }
  },
  computed: {
    ...mapState('main', ['faces', 'lastPage', 'currentPage', 'face_count', 'form_loading']),
  },

  methods: {
    formatPhone,
    itemRowBackground: function (item) {
      return item.fixed === 1 ? 'fixed' : ''
    },
    async search() {
      await this.$store.dispatch('main/SEARCH_FACES_FROM_API', [this.query, 1]);
    },
    formatDate(date) {
      if (!date) return '—'
      const d = new Date(date)
      return d.toLocaleDateString('ru-RU')
    },
    async handlePageChange(page) {
      await this.$store.dispatch('main/SEARCH_FACES_FROM_API', [this.query, page]);
    },
    async searchPageChange(page) {
      await this.$store.dispatch('main/SEARCH_FACES_FROM_API', [this.query, page]);
    },
    async resetFilter() {
      //await this.$store.dispatch('main/SEARCH_FACES_FROM_API', ['', 1]);
      this.$store.commit('main/RESET');
    },
    openTask(id){
      this.$store.commit('tasks/SET_DIALOG');
      this.$store.commit('tasks/SET_OPEN_TASK_ID', id);
      this.$store.dispatch('tasks/GET_TASK_FROM_API', id);
    },
    openDocument(id){
      this.$store.commit('documents/SET_DIALOG');
      this.$store.commit('documents/SET_OPEN_DOC_ID', id);
      this.$store.dispatch('documents/GET_DOCUMENT_FROM_API', id);
    }

  }
}
</script>

<style scoped>
.list-task {
  padding: 0;
}
.list-task a {
  font-size: 12px;
}
.auto-width-table th {
  white-space: nowrap; /* текст в одну строку */
  width: auto !important; /* автоширина по содержимому */
}

.smallRow {
  font-size: 12px;
  font-family: monospace;
}

.text-red {
  color: red;
  /*background-color: #d31414;*/
  padding: 5px;
  border: 1px solid red;
  border-radius: 5px;
}

.title-text {
  font-family: monospace;
}

.mdi-pin::before {
  transform: rotate(25deg) !important;
}
</style>
<style>
.fixed {
  background-color: #ebf9ecb8;
}
.v-application .elevation-1 {
  box-shadow: none !important;
}
</style>
