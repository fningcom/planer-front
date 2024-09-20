// plugins/axios.js
export default function ({ $axios, $auth }) {
    $axios.onError(error => {
        const code = parseInt(error.response && error.response.status)
        if (code === 401 || code === 419) {
            window.location.replace('/login')
        }
        return Promise.reject(error)
    })
}
