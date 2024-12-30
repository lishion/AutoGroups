<template>
  <div style="position: relative;">
    <el-input v-model="config.title" placeholder="group title" class="group-input">
      <template #suffix>
        <el-popover trigger="hover" width="none" popper-class=".color-config">
          <template #reference>
            <el-text v-if="config.color === 'auto'">auto</el-text>
            <el-tag :disable-transitions="true" v-else :color="config.color" round type="info"></el-tag>
          </template>
          <GroupColors v-model="config.color" shape="circle" />
        </el-popover>
      </template>
    </el-input>

    <el-space style="width: 100%" fill direction="vertical">
      <div class="rules" v-for="(rule, index) in config.rules" :key="index">
        <el-input placeholder="input rule here" v-model="config.rules[index].rule" class="url-input"></el-input>
        <el-button :onclick="() => removeRules(index)" :icon="DeleteFilled" circle />
        <el-button circle :icon="Plus"
          :style="`visibility: ${index === config.rules.length - 1 ? 'visible' : 'hidden'}`"
          :onclick="() => config.rules.push({ type: 'url', rule: '' })">
        </el-button>
      </div>
    </el-space>
  </div>
</template>

<script lang="ts" setup>
import GroupColors from './GroupColors.vue';
import type { GroupConfig } from '@/types.ts'
import { DeleteFilled, Plus } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const config = defineModel<GroupConfig>({ required: true })

function removeRules(index: number): void {
  const newRules = config.value.rules.filter((rule, id) => id !== index)
  if (newRules.length <= 0) {
    ElMessageBox.alert('You should keep at least one rule')
    return
  }
  config.value.rules = newRules
}

// const $emit = defineEmits(['delete']);


</script>

<style scoped>
.url-input :deep(.el-input__wrapper) {
  border-bottom: 1px solid grey;
  box-shadow: none;
  border-radius: 0;
}

.rules {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.divider {
  margin-bottom: 0;
}
</style>
