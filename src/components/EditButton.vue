<template>
  <v-btn flat>
    <v-icon size="small" color="blue">
      mdi-pencil
    </v-icon>
    <v-tooltip
      activator="parent"
      anchor="top"
    >
      {{ textBtn }}
    </v-tooltip>
  </v-btn>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EditButton',
  props: {
      textBtn: {
          type: String,
            default: 'Edit'
      },
  },
})
</script>

<style lang="scss" scoped>
</style>
