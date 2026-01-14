// Google検索結果から指定されたドメインをフィルタリング

// グローバルな累積カウンター
let totalHiddenCount = 0;
let notificationShown = false;

// ドメインがブロックリストに含まれているかチェック
function isDomainBlocked(domain, blockedDomains) {
  const normalizedDomain = domain.toLowerCase().replace(/^www\./, '');

  return blockedDomains.some(blocked => {
    const normalizedBlocked = blocked.toLowerCase().replace(/^www\./, '');

    // 完全一致またはサブドメインの一致
    return normalizedDomain === normalizedBlocked ||
           normalizedDomain.endsWith('.' + normalizedBlocked);
  });
}

// 要素の親を遡って検索結果のカードを見つける
function findSearchResultCard(element) {
  let current = element;
  let depth = 0;
  const maxDepth = 15;

  while (current && current !== document.body && depth < maxDepth) {
    // 検索結果のカードと思われる要素の特徴
    // - div要素
    // - ある程度の高さがある
    // - h3タグを含む（タイトル）
    if (current.tagName === 'DIV') {
      const hasTitle = current.querySelector('h3');
      const hasLink = current.querySelector('a[href]');

      if (hasTitle && hasLink) {
        return current;
      }
    }

    current = current.parentElement;
    depth++;
  }

  return null;
}

// ブロックリストを取得して検索結果をフィルタリング
async function filterSearchResults() {
  const { blockedDomains = [] } = await chrome.storage.sync.get('blockedDomains');

  console.log('[検索結果フィルター] ブロックリスト:', blockedDomains);

  if (blockedDomains.length === 0) {
    console.log('[検索結果フィルター] ブロックリストが空です');
    return;
  }

  // ページ内のすべてのリンクを取得
  const allLinks = document.querySelectorAll('a[href]');
  console.log('[検索結果フィルター] 見つかったリンク数:', allLinks.length);

  let hiddenCount = 0;
  const processedCards = new Set();

  allLinks.forEach(link => {
    try {
      const url = link.href;

      // Google内部のリンクをスキップ
      if (!url ||
          url.startsWith('javascript:') ||
          url.includes('google.com/search') ||
          url.includes('google.com/url') ||
          url.includes('google.com/maps') ||
          url.includes('accounts.google.com') ||
          url.includes('support.google.com') ||
          url.includes('policies.google.com') ||
          url.includes('webcache.googleusercontent.com')) {
        return;
      }

      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      // ブロックリストに含まれているかチェック
      if (isDomainBlocked(domain, blockedDomains)) {
        console.log('[検索結果フィルター] ブロック対象を発見:', domain, url);

        // 検索結果のカードを見つける
        const card = findSearchResultCard(link);

        if (card && !processedCards.has(card)) {
          // 既に処理済みでない場合のみ非表示にする
          if (!card.dataset.filtered) {
            card.style.display = 'none';
            card.dataset.filtered = 'true';
            processedCards.add(card);
            hiddenCount++;
            totalHiddenCount++; // グローバルカウンターを増加
            console.log('[検索結果フィルター] 非表示にしました:', domain);
          }
        }
      }
    } catch (e) {
      // URLのパースに失敗した場合は無視
    }
  });

  console.log('[検索結果フィルター] 処理完了。非表示にした結果:', hiddenCount, '/ 累積:', totalHiddenCount);

  // フィルタリング結果を表示（一度だけ、かつ非表示が1件以上ある場合）
  if (totalHiddenCount > 0 && !notificationShown) {
    // 少し遅延させて、すべての処理が完了してから表示
    setTimeout(() => {
      if (!notificationShown) {
        showFilterNotification(totalHiddenCount);
        notificationShown = true;
      }
    }, 1500);
  }
}

// フィルタリング通知を表示
function showFilterNotification(count) {
  // 既存の通知を削除
  const existing = document.getElementById('filter-notification');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.id = 'filter-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4285f4;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
  `;
  notification.textContent = `${count}件の検索結果を非表示にしました`;

  document.body.appendChild(notification);

  // 3秒後に通知を削除
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ページ読み込み時にフィルタリングを実行
console.log('[検索結果フィルター] 初期化中...');

// 複数回実行して確実にフィルタリング
setTimeout(() => filterSearchResults(), 100);
setTimeout(() => filterSearchResults(), 500);
setTimeout(() => filterSearchResults(), 1000);

// 検索結果が動的に追加される場合に対応
let debounceTimer;
const observer = new MutationObserver(() => {
  // 連続して呼ばれるのを防ぐため、デバウンス処理
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    console.log('[検索結果フィルター] DOM変更を検知');
    filterSearchResults();
  }, 300);
});

// Google検索結果のコンテナを監視（複数の候補を試す）
function startObserving() {
  const searchContainer = document.querySelector('#search') ||
                          document.querySelector('#rso') ||
                          document.querySelector('#center_col') ||
                          document.body;

  if (searchContainer) {
    console.log('[検索結果フィルター] 監視開始:', searchContainer);
    observer.observe(searchContainer, {
      childList: true,
      subtree: true
    });
  }
}

// DOMが完全に読み込まれた後に監視を開始
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startObserving);
} else {
  startObserving();
}

// ストレージの変更を監視してリアルタイムで反映
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.blockedDomains) {
    console.log('[検索結果フィルター] ブロックリストが更新されました');

    // カウンターと通知フラグをリセット
    totalHiddenCount = 0;
    notificationShown = false;

    // 既存の処理済みマークをリセット
    document.querySelectorAll('[data-filtered="true"]').forEach(el => {
      el.removeAttribute('data-filtered');
      el.style.display = ''; // 表示をリセット
    });

    filterSearchResults();
  }
});
