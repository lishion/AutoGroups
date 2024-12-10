async function set(k: string, v: string){
   await chrome.storage.local.set({k, v})
}

async function get(k: string): Promise<string>{
    const objs = await chrome.storage.local.get([k])
    return objs[k]
}

const LocalStore = {
    set,
    get
}

export default LocalStore