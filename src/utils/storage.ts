async function set(k: string, v: string) {
  if (chrome.storage) {
    await chrome.storage.local.set({ k, v })
  } else {
    localStorage.setItem(k, v)
  }
}

async function get(k: string): Promise<string | null> {
  if (chrome.storage) {
    const objs = await chrome.storage.local.get([k])
    return objs[k]
  }
  return await localStorage.getItem(k)
}

const LocalStore = {
  set,
  get,
}

export default LocalStore
