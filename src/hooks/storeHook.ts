import type { GroupConfig } from '@/types'
import Store from '../utils/storage'
import { ref, unref } from 'vue'

function useConfig() {
  const storeValue = ref<GroupConfig[]>([])
  async function load(): Promise<GroupConfig[]> {
    const str = await Store.get('$AutoGroup$')
    if (str) {
      storeValue.value = JSON.parse(str!) as GroupConfig[]
    }
    return Promise.resolve([])
  }
  async function save() {
    const str = JSON.stringify(unref(storeValue))
    console.info(unref(storeValue))
    await Store.set('$AutoGroup$', str)
  }
  return {
    configs: storeValue,
    load,
    save,
  }
}

export default useConfig
