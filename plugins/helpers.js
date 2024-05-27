export function mapFields(options) {
    const object = {};
    for (let x = 0; x < options.fields.length; x++) {
        const field = options.fields[x];
        object[field] = {
            get() {
                return this.$store.state[options.store][options.base][field];
            },
            set(value) {
                this.$store.commit(options.store + "/" + options.mutation, {
                    key: field,
                    value: value
                });
            }

        };
    }
    return object;
}

export function toDay() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let day = today.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    return `${year}-${month}-${day}`;
}
