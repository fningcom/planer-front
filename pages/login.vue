<template>
    <div class="mx-auto col-md-3 col-sm-6">
        <div style="text-align: center;margin: 15px;font-size: 30px;color: #fff;text-shadow: 1px 1px 4px #1f285c;"> Планировщик</div>
        <v-card
                min-width="200"
                class=" pa-4"
        >

            <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
            >
                <div v-if="errors">
                    <v-alert type="error">
                        <ul v-for="error in error_text" :key="error">
                            <li>{{ error }}</li>
                        </ul>
                    </v-alert>
                </div>
                <v-text-field
                        v-model="form.email"
                        outlined
                        dense
                        hide-details
                        label="E-mail"
                        required
                        class="my-2"
                ></v-text-field>
                <v-text-field
                        v-model="form.password"
                        type="password"
                        outlined
                        dense
                        hide-details
                        label="Password"
                        required
                        class="my-2"
                        @keydown.enter="login"
                ></v-text-field>

                <v-btn
                        :disabled="!valid"
                        :loading="!valid"
                        color="primary"
                        @click="login"
                        block
                >
                    Submit
                </v-btn>

            </v-form>
        </v-card>
    </div>



</template>

<script>
    export default {
        layout: "auth",
        data() {
            return {
                valid: true,
                errors: false,
                error_text:[],
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                ],
                form: {
                    email: null,
                    password: null,
                },
            };
        },
        mounted() {
            this.$axios.$get("/sanctum/csrf-cookie");
        },
        computed: {

        },
        methods: {
            validate () {
                this.$refs.form.validate()
            },
            async login() {
                const errors = [];
                this.valid = false;
                this.errors = false;
                try {
                    await this.$axios.$get('sanctum/csrf-cookie')
                    await this.$axios.$post('/api/login', this.form)
                        .then((resp) => {
                            if (!resp.two_factor) {
                                this.$auth.loginWith('laravelSanctum', {data: this.form})
                            } else {
                                this.valid = true
                            }
                        })
                        .catch((error) => {
                            this.errors = true;
                            errors.push(error.response.data.errors)
                            this.valid = true
                        })
                } catch (error) {
                    this.errors = true;
                    errors.push(error.response.data.errors)
                    this.valid = true
                }
                this.error_text = errors;
            },
        },
    }
</script>


