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

export function filterMediaByCollection(media, collectionName) {
    return media.filter(item => item.collection_name === collectionName);
}

export function formatDate(date) {
    if (!date) {
        return ''; // Возвращаем пустую строку, если дата пустая
    }
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    return new Date(date).toLocaleDateString('ru-RU', options);
}

export function formatDateTime(date) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    return new Date(date).toLocaleString('ru-RU', options);
}

export function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const units = [
        { name: 'секунда', plural: 'секунды', many: 'секунд', seconds: 1 },
        { name: 'минута', plural: 'минуты', many: 'минут', seconds: 60 },
        { name: 'час', plural: 'часа', many: 'часов', seconds: 3600 },
        { name: 'день', plural: 'дня', many: 'дней', seconds: 86400 },
        { name: 'неделя', plural: 'недели', many: 'недель', seconds: 604800 },
        { name: 'месяц', plural: 'месяца', many: 'месяцев', seconds: 2592000 },
        { name: 'год', plural: 'года', many: 'лет', seconds: 31536000 },
    ];

    // Если больше одного дня, показываем дни и часы
    if (diffInSeconds >= 86400) {
        const days = Math.floor(diffInSeconds / 86400);
        const hours = Math.floor((diffInSeconds % 86400) / 3600);

        const dayWord = days === 1 ? 'день' : (days < 5 ? 'дня' : 'дней');
        const hourWord = hours === 1 ? 'час' : (hours < 5 ? 'часа' : 'часов');

        return `${days} ${dayWord} и ${hours} ${hourWord}`;
    }

    for (let i = units.length - 1; i >= 0; i--) {
        const unit = units[i];
        const amount = Math.floor(diffInSeconds / unit.seconds);

        if (amount >= 1) {
            const word = amount === 1 ? unit.name : (amount < 5 ? unit.plural : unit.many);
            return `${amount} ${word}`;
        }
    }

    return 'только что';
}
export function generateUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

