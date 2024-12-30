<template>
  <el-tabs v-model="activeName" class="popup" @tab-click="handleClick">
    <el-tab-pane label="Groups" name="groups">
      <GroupList v-model="groups" />
    </el-tab-pane>
    <el-tab-pane label="Sort By Time" name="time">
      <GroupList v-model="groupsByOrder" />
    </el-tab-pane>

    <el-tab-pane label="Sort By Host" name="host">
      <GroupList v-model="groupsByHost" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import GroupList from './components/display/GroupList.vue'
import type { GroupedTabs } from './types'
import { getAllGroupedTabs, getTabSortedByOrder, getTabGroupByDomain } from '@/utils/tab.ts'

const activeName = ref('groups')

const groups = ref<GroupedTabs[]>([])
getAllGroupedTabs().then((tabs) => {groups.value = tabs})

const groupsByOrder = ref<GroupedTabs[]>([])

const groupsByHost = ref<GroupedTabs[]>([])

const handleClick = (tab: TabsPaneContext, event: Event) => {
  if(tab.paneName === 'time') {
    getTabSortedByOrder().then((tabs) => (groupsByOrder.value = tabs))
  }else if(tab.paneName === 'host'){
    getTabGroupByDomain().then((tabs) => (groupsByHost.value = tabs))
  }
}



</script>


<style>
.popup {
  width: 600px;
  padding: 16px;
}

/* .demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
} */
</style>
