<template>
  <el-row v-for="(group, groupIndex) in tabGroups" :key="group.id" class="group" align="top">
    <el-col :span="5">
      <el-tag type="primary" :color="group.color">{{ group.name }}</el-tag>
    </el-col>
    <el-col :span="19">
        <el-space  direction="vertical"  alignment="stretch"  class="tab-container" size="small">
          <div  v-for="tab in group.tabs" :key="tab.id" style="width: 100%; border: 1px solid #D4D7DE;  border-radius: 10px;">
            <div class="tab">
                <div class="text">
                  <el-text class="font-bold"  size="large" tag="b">{{ tab.title }}</el-text>
                  <br/>
                  <el-text size="small" truncated>{{ tab.url }}</el-text>
                </div>
                <div class="delete-btn">
                  <el-button :icon="CloseBold" circle type="info" text @click="() => deleteTab(groupIndex, tab.id)"></el-button>
                </div>
            </div>
            <div class="time">
              <el-text size="small" truncated>{{  tab.comment }}</el-text>
            </div>
          </div>
        </el-space>
    </el-col>
  </el-row>
</template>


<script setup lang="ts">
import type { GroupedTabs } from '@/types';
import { CloseBold } from '@element-plus/icons-vue'
import { removeTab } from '@/utils/tab.ts'

const tabGroups = defineModel<GroupedTabs[]>({required: true})

function deleteTab(groupIndex: number, tabId: number) {
  removeTab(tabId)
  if(tabGroups.value[groupIndex].tabs.length === 1) {
    tabGroups.value = tabGroups.value.filter((_, index) => index !== groupIndex)
    return
  }
  tabGroups.value[groupIndex].tabs = tabGroups.value[groupIndex].tabs.filter(tab => tab.id !== tabId)
}

</script>

<style scoped>
.tab {

  padding-left: 6px;
  align-content: center;
  flex-shrink: 0;
  flex-grow: 1;
  display: flex;
  flex-wrap: nowrap;
  min-width: 0;
  justify-content: space-between;
}

.text {
  flex-shrink: 1;
  align-content: center;
  overflow: hidden;
}

.group {
  margin-top: 8px;
}

.tab-container {
  width: 100%;
}

.time {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
