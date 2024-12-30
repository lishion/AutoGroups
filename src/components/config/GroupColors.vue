<template>
    <el-space>
      <el-tag v-for="color of COLORS" :key="color" :color="color" round type="info" @click="colorConfig=color">
      </el-tag>
      <el-icon @click="colorConfig='auto'"><DeleteFilled /></el-icon>
    </el-space>
</template>

<script lang="ts" setup>
import { DeleteFilled } from '@element-plus/icons-vue'
import type { GroupColor } from '@/types.ts'
const COLORS = [
    "grey",
    "blue",
    "red",
    "yellow",
    "green",
    "pink",
    "purple",
    "cyan",
    "orange"
]
const colorConfig = defineModel<GroupColor>();

</script>
