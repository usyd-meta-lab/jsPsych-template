// Sync condition assignment with optional localStorage persistence
function assignCondition(
  nConditions = 2,
  { useLocalStorage = true, storageKey = "condition_index" } = {}
) {
  // helper hash
  function cyrb53(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 =
      Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
      Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
      Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
      Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }

  // if using localStorage, reuse existing assignment
  if (useLocalStorage) {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      return parseInt(stored, 10);
    }
  }

  // get or make participant ID
  let pid;
  if (useLocalStorage) {
    pid = localStorage.getItem("participant_id");
    if (!pid) {
      pid = crypto.randomUUID();
      localStorage.setItem("participant_id", pid);
    }
  } else {
    pid = crypto.randomUUID(); // fresh every call
  }

  const index = cyrb53(pid) % nConditions;

  if (useLocalStorage) {
    localStorage.setItem(storageKey, index);
  }

  return index;
}