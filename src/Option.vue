<script setup lang="ts">
import GroupConfigPanel from '@/components/config/GroupConfigPanel.vue'
import useConfig from './hooks/storeHook';
import { watch } from 'vue';
const {
  configs,
  load,
  save
} = useConfig()
load()

watch(configs, () => {
  console.info(configs.value)
})
</script>

<template>
  <el-row justify="center" id="config">
    <GroupConfigPanel v-model="configs" @save="save" />
  </el-row>
</template>

<style scoped>
#config {
  width: 100%;
}
</style>
