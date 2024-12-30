<template>
  <div class="configPanel">
    <el-space direction="vertical" fill style="width: 100%;">
      <div class="configItem" v-for="(config, index) in configs" :key="index">
        <GroupConfigItem v-model="configs[index]" @delete="() => deleteConfig(index)" />
        <el-icon class="del-btn">
          <CloseBold @click="() => deleteConfig(index)" />
        </el-icon>
      </div>
    </el-space>
    <div class="config-btn">
      <el-button @click="addConfig" size="small" style="width: 100%;" type="primary">
        Add Group Rule
        <el-icon class="el-icon--right">
          <Plus />
        </el-icon>
      </el-button>
      <el-button @click="() => $emit('save')" size="small" style="width: 100%;" type="primary">
        Save
        <el-icon class="el-icon--right">
          <Finished />
        </el-icon>
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { GroupConfig } from '@/types.ts'
import GroupConfigItem from '@/components/config/GroupConfigItem.vue'
import { Finished, Plus, CloseBold } from '@element-plus/icons-vue'

const configs = defineModel<GroupConfig[]>({ required: true })

function addConfig() {
  configs.value.push({
    title: '',
    color: 'auto',
    rules: [{
      type: 'url',
      rule: ''
    }]
  })
}

function deleteConfig(deleteIndex: number) {
  const newConfigs = configs.value.filter((v, index) => index !== deleteIndex)
  configs.value = newConfigs
}

const $emit = defineEmits(['save'])

</script>

<style scoped>
.configPanel {
  width: 50%;
}

.configItem {
  width: 100%;
  border: 2px solid rgb(116, 112, 112);
  padding: 12px;
  padding-right: 30px;
  border-radius: 6px;
  position: relative
}

.config-btn {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.del-btn {
  position: absolute;
  right: 6px;
  top: 6px;
}
</style>
