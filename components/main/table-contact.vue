<template>
  <div>
    <div v-if="contacts && contacts.length > 0">
      <v-data-table
        v-model="selected"
        :headers="contact_headers"
        :items="contacts"
        item-key="id"
        class="elevation-1 my-2 auto-width-table"
        :item-class="itemRowBackground"
        loading-text="Загрузка данных... Пожалуйста ожидайте"
        hide-default-footer
        checkbox-color="primary"
        :items-per-page=6
        dense

      >
        <template v-slot:top>
          <h3 style="margin: 10px 0 0 10px; color: #4e4caf;">Контакты</h3>
          <v-alert dense text type="info" icon="mdi mdi-phone-in-talk" color="#4e4caf" style="margin:0 5px 10px 10px; font-size: 14px;">
            По вашему запросу найдено: {{ face_count_contacts }} контактов
          </v-alert>
        </template>
        <template v-slot:item.icon="{ item }">
          <v-img :src="item.type.icon" width="18"/>
        </template>
        <template v-slot:item.code="{ item }">
          {{ formatPhone(item.code) }}
        </template>
        <template v-slot:item.relation="{ item }">
          <div v-if="item.faces && item.faces.length">
            <ul class="ma-0 pa-0" style="list-style: none;">
              <li
                v-for="face in item.faces"
                :key="face.id"
                class="list-task"
              >
                <div style="font-size: 14px;">
                  <span>
                    <v-icon style="color: green;   font-size: 16px;">mdi mdi-link-variant </v-icon>
                   {{ face.id }} | {{ face.full_name }} <span v-if="face.birthday">, {{ formatDate(face.birthday) }} г.р.</span><span v-if="face.citizen">, {{ face.citizen }}</span>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="text-grey">
            <v-icon style="color: darkgrey;   font-size: 16px;">mdi mdi-link-variant-off </v-icon>
            </div>
        </template>
        <template v-slot:item.tasks="{ item }">
          <div v-if="item.tasks && item.tasks.length">
            <ul class="ma-0 pa-0" style="list-style: none;">
              <li
                v-for="task in item.tasks"
                :key="task.id"
                class="list-task"
              >
                <v-icon style="color: green;   font-size: 16px;">mdi mdi-file-document-check-outline </v-icon>
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
              > <v-icon style="color: green;   font-size: 16px;">mdi mdi-file-document-check-outline </v-icon>
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
      </v-data-table>

      <div v-if="face_count_contacts && face_count_contacts > 6">
        <v-pagination
          v-if="query"
          v-model="currentPageContacts"
          :length="lastPageContacts"
          :total-visible="7"
          @input="searchPageChange"
          class="mt-4"
        ></v-pagination>
        <v-pagination
          v-else
          v-model="currentPageContacts"
          :length="lastPageContacts"
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
  name: "DataContactTable",
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
      contact_headers: [
        {text: 'ID', value: 'id', sortable: false, width: "50"},
        {text: '', value: 'icon', sortable: false, width: "50"},
        {text: 'Тип контакта', value: 'type.type', sortable: false, width: "200"},
        {text: 'UID', value: 'uid', sortable: false},
        {text: 'Контакт', value: 'code', sortable: false},
        {text: 'Имя', value: 'name', sortable: false},
        {text: 'Связь с лицом', value: 'relation', sortable: false},
        {text: 'Задачи', value: 'tasks', sortable: false},                 // автоширина
        {text: 'Документы', value: 'documents', sortable: false},
      ],
    }
  },
  computed: {
    ...mapState('main', ['contacts', 'lastPageContacts', 'currentPageContacts', 'face_count_contacts', 'form_loading']),
  },
  methods: {
    formatPhone,
    itemRowBackground: function (item) {
      return item.fixed === 1 ? 'fixed' : ''
    },
    formatDate(date) {
      if (!date) return '—'
      const d = new Date(date)
      return d.toLocaleDateString('ru-RU')
    },
    async handlePageChange(page) {
      await this.$store.dispatch('main/SEARCH_CONTACTS_FROM_API', [this.query, page]);
    },
    async searchPageChange(page) {
      await this.$store.dispatch('main/SEARCH_CONTACTS_FROM_API', [this.query, page]);
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
</style>
