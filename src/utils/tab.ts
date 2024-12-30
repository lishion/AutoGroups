import type {  GroupedTabs, Tab } from '@/types.ts'
import human from 'humanize-duration'

const MOCK_DATA = [
  {
    name: 'test',
    id: 1,
    tabs: [
      {
        title: 'Vite App',
        id: 1,
        url: "http://localhost:5173/popup.html"
      },
      {
        title: 'Layout 布局 | Element Plus',
        id: 2,
        url: "https://element-plus.org/zh-CN/component/layout.html"
      },
      {
        title: 'chrome.tabGroups  |  API  |  Chrome for Developers',
        id: 3,
        url: "https://developer.chrome.com/docs/extensions/reference/api/tabGroups?hl=zh-cn#method-get"
      }
    ]
  },
  {
    name: 'test123123',
    id: 2,
    tabs: [
      {
        title: 'xxxx1111',
        id: 4,
        url: "https://developer.chrome.com/docs/extensions/reference/api/action?hl=zh-cni"
      },
      {
        title: 'xxxx22222',
        id: 5,
        url: "https://developer.chrome.com/docs/extensions/reference/api/action?hl=zh-cni"
      },
      {
        title: 'xxxx3333',
        id: 6,
        url: "https://developer.chrome.com/docs/extensions/reference/api/action?hl=zh-cni"
      }
    ]
  },
]

async function getAllGroupedTabs(): Promise<GroupedTabs[]> {
  if(chrome.tabs){
    const groupedTabs = new Map<number, Set<Tab>>()
    const res: GroupedTabs[]  = []
    const allTables: Tab[] = await chrome.tabs.query({})
    const groupIndex = new Map<number, number>();
    allTables.filter((t) => t.id)
      .forEach((tab) => {
        // put all tab that not hit any rule to one group keye by NON_GROUP
        const groupId = tab.groupId ?? -1
        if (!groupedTabs.has(groupId)) {
          groupedTabs.set(groupId, new Set())
        }
        groupedTabs.get(groupId)!.add(tab)
        groupIndex.set(groupId, tab.index)
      })

    for(const [groupId, tabs] of groupedTabs.entries()) {
      let groupName;
      let color: string = '';
      if(groupId === -1){
        groupName = "others"
      }else{
        const group = await chrome.tabGroups.get(groupId)
        groupName = group.title
        color = group.color
      }
      res.push({
        name: groupName,
        id: groupId,
        color: color,
        tabs: [...tabs].sort((x, y) =>  (y.lastAccessed ?? 0) - (x.lastAccessed ?? 0)),
      })
    }
    res.sort((x, y) => {
      if(x.name === "others"){
        return 1
      }else if(y.name === "others"){
        return -1
      }
      return groupIndex.get(y.id)! - groupIndex.get(x.id)!
    })

    return Promise.resolve(res)
  }
  return Promise.resolve(MOCK_DATA)
}


function formatTimeDifference(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = '';

  if (hours > 0) {
    result += `${hours}小时`;
  }
  if (minutes > 0) {
    result += `${minutes}分钟`;
  }
  if (remainingSeconds > 0) {
    result += `${remainingSeconds}秒`;
  }

  // 如果没有小时和分钟，只显示秒数
  if (result === '') {
    result = `${remainingSeconds}秒`;
  }

  return result + '以前';
}


async function getTabSortedByOrder(): Promise<GroupedTabs[]>{
  if(chrome.tabs) {
    const now = Date.now();
    const allTabs: Tab[] = await chrome.tabs.query({})
    allTabs.sort((x, y) => ((y.lastAccessed ?? 0) - (x.lastAccessed ?? 0)))
    const tabsWithTime = allTabs.map( t => {
      if(t.lastAccessed){
        return {...t, comment: formatTimeDifference(Math.floor((now - t.lastAccessed) / 1000))}
      }
      return t;
    })
    return [
      {
        "name": "ALL",
        "id": 0,
        "tabs": tabsWithTime
      }
    ]
  }
  return Promise.resolve(MOCK_DATA)
}


async function getTabGroupByDomain(): Promise<GroupedTabs[]>{
  if(chrome.tabs){
    const groupedTabs = new Map<string, Set<Tab>>()
    const res: GroupedTabs[]  = []
    const allTables: Tab[] = await chrome.tabs.query({})

    allTables.filter((t) => t.id)
      .forEach((tab) => {
        const host = URL.parse(tab.url)?.host ?? 'others'
        const groupId = tab.groupId ?? -1
        if (!groupedTabs.has(groupId)) {
          groupedTabs.set(host, new Set())
        }
        groupedTabs.get(host)!.add(tab)
      })

    let index = 0;

    for(const [host, tabs] of groupedTabs.entries()) {
      res.push({
        name: host,
        id: index,
        tabs: [...tabs].sort((x, y) =>  (y.lastAccessed ?? 0) - (x.lastAccessed ?? 0)),
      })
      index += 1;
    }

    return Promise.resolve(res)
  }
  return Promise.resolve(MOCK_DATA)
}


async function removeTab(tabId: number): Promise<void> {
  if(chrome.tabs){
    return await chrome.tabs.remove(tabId).catch(console.error)
  }
  return Promise.resolve()
}


export {
  getAllGroupedTabs,
  removeTab,
  getTabSortedByOrder,
  getTabGroupByDomain,
}
