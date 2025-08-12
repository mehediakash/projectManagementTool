class TrieNode {
  constructor() {
    this.children = {};
    this.isWord = false;
    this.meta = null; // store id/title for fast lookup
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  insert(word, meta) {
    word = (word || '').toLowerCase();
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isWord = true;
    node.meta = meta;
  }
  _collect(node, prefix, results, limit) {
    if (results.length >= limit) return;
    if (node.isWord) results.push({ title: prefix, meta: node.meta });
    for (const k of Object.keys(node.children)) {
      this._collect(node.children[k], prefix + k, results, limit);
      if (results.length >= limit) return;
    }
  }
  search(prefix, limit = 10) {
    prefix = (prefix || '').toLowerCase();
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return [];
      node = node.children[ch];
    }
    const results = [];
    this._collect(node, prefix, results, limit);
    return results;
  }
}

module.exports = Trie;
