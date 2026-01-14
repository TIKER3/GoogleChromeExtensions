// DOM要素の取得
const domainInput = document.getElementById('domainInput');
const addButton = document.getElementById('addButton');
const domainList = document.getElementById('domainList');
const emptyMessage = document.getElementById('emptyMessage');

// ページ読み込み時にブロックリストを表示
document.addEventListener('DOMContentLoaded', loadBlockedDomains);

// 追加ボタンのクリックイベント
addButton.addEventListener('click', addDomain);

// Enterキーでも追加できるようにする
domainInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addDomain();
  }
});

// ブロックリストを読み込んで表示
async function loadBlockedDomains() {
  const { blockedDomains = [] } = await chrome.storage.sync.get('blockedDomains');
  renderDomainList(blockedDomains);
}

// ドメインを追加
async function addDomain() {
  let domain = domainInput.value.trim();

  if (!domain) {
    showMessage('ドメインを入力してください', 'error');
    return;
  }

  // プロトコルを削除
  domain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');

  // スラッシュ以降を削除
  domain = domain.split('/')[0];

  // ドメインの基本的なバリデーション
  if (!isValidDomain(domain)) {
    showMessage('有効なドメインを入力してください', 'error');
    return;
  }

  // 既存のブロックリストを取得
  const { blockedDomains = [] } = await chrome.storage.sync.get('blockedDomains');

  // 重複チェック
  if (blockedDomains.includes(domain)) {
    showMessage('このドメインは既に登録されています', 'error');
    return;
  }

  // ドメインを追加
  blockedDomains.push(domain);
  await chrome.storage.sync.set({ blockedDomains });

  // UIを更新
  domainInput.value = '';
  renderDomainList(blockedDomains);
  showMessage('ドメインを追加しました', 'success');
}

// ドメインを削除
async function removeDomain(domain) {
  const { blockedDomains = [] } = await chrome.storage.sync.get('blockedDomains');

  const updatedDomains = blockedDomains.filter(d => d !== domain);
  await chrome.storage.sync.set({ blockedDomains: updatedDomains });

  renderDomainList(updatedDomains);
  showMessage('ドメインを削除しました', 'success');
}

// ドメインリストを描画
function renderDomainList(domains) {
  domainList.innerHTML = '';

  if (domains.length === 0) {
    emptyMessage.style.display = 'block';
    domainList.style.display = 'none';
  } else {
    emptyMessage.style.display = 'none';
    domainList.style.display = 'block';

    domains.forEach(domain => {
      const li = document.createElement('li');
      li.className = 'domain-item';

      const span = document.createElement('span');
      span.textContent = domain;
      span.className = 'domain-name';

      const deleteButton = document.createElement('button');
      deleteButton.textContent = '削除';
      deleteButton.className = 'delete-button';
      deleteButton.addEventListener('click', () => removeDomain(domain));

      li.appendChild(span);
      li.appendChild(deleteButton);
      domainList.appendChild(li);
    });
  }
}

// ドメインのバリデーション
function isValidDomain(domain) {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

// メッセージを表示
function showMessage(text, type) {
  // 既存のメッセージを削除
  const existingMessage = document.querySelector('.message');
  if (existingMessage) {
    existingMessage.remove();
  }

  const message = document.createElement('div');
  message.className = `message ${type}`;
  message.textContent = text;

  const container = document.querySelector('.container');
  container.insertBefore(message, container.firstChild);

  // 3秒後にメッセージを削除
  setTimeout(() => {
    message.style.opacity = '0';
    setTimeout(() => message.remove(), 300);
  }, 3000);
}
