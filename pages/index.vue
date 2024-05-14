<template>
  <div>
    <p>Hi {{ user.name }}</p>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      user: this.$auth.user,
    }
  },
}
</script>
