(function() {
    const ENDPOINT = 'https://openlibrary.org/search.json';
    const imageSize = 'M';
    const q = document.getElementById('q');
    const go = document.getElementById('go');
    const res = document.getElementById('results');
    const status = document.getElementById('status');
    const favsEl = document.getElementById('favs');
    const clearBtn = document.getElementById('clear');
    const moreBtn = document.getElementById('more');

    const SLOW = 2500;
    const TIMEOUT = 10000;
    const STORE = 'olmini:fav';
    const LIMIT = 50;
    const CHUNK = 12;
    let controller = null;

    let currentPage = 1;
    let lastTitle = '';
    let lastBatchCount = 0;

    const loadFavs = () => JSON.parse(localStorage.getItem(STORE) || '[]');
    const saveFavs = (list) => localStorage.setItem(STORE, JSON.stringify(list));
    const coverUrl = (id) => id ? `https://covers.openlibrary.org/b/id/${id}-${imageSize}.jpg` : '';
    const setStatus = (msg, color = '#555') => { status.textContent = msg; status.style.color = color; };

    function addFavorite(item) {
        if (!item) return;
        const list = loadFavs();
        const id = item.key;
        if (!id || list.some(f => f._id === id)) return;
        list.unshift({ _id: id, item });
        saveFavs(list);
        renderFavs();
    }

    function removeFavoriteByIndex(i) {
        const cur = loadFavs();
        cur.splice(i, 1);
        saveFavs(cur);
        renderFavs();
    }
    function renderFavs() {
        const list = loadFavs();
        favsEl.innerHTML = '';
        if (!list.length) {
            const p = document.createElement('p');
            p.textContent = 'No favorites yet';
            p.style.color = '#555';
            favsEl.appendChild(p);
            return;
        }
        list.forEach((f, i) => {
            const div = document.createElement('div');
            div.className = 'favitem';
            const label = document.createElement('span');
            label.textContent = f.item.title;
            const del = document.createElement('button');
            del.textContent = 'X';
            del.addEventListener('click', () => removeFavoriteByIndex(i));
            div.append(label, del);
            favsEl.appendChild(div);
        });
    }
    function cardFor(doc) {
        const c = document.createElement('div');
        c.className = 'card';
        const img = document.createElement('div');
        img.className = 'cover';
        const src = coverUrl(doc.cover_i);
        if (src) {
            const im = document.createElement('img'); im.src = src; img.appendChild(im);
        }
        else img.textContent = 'No cover';
        const t = document.createElement('div'); t.className = 'title'; t.textContent = doc.title;
        const a = document.createElement('div'); a.className = 'author'; a.textContent = (doc.author_name || []).join(', ');
        const fav = document.createElement('button'); fav.className = 'fav'; fav.textContent = '☆ Favorite';
        fav.addEventListener('click', () => addFavorite(doc));
        c.append(img, t, a, fav);
        return c;
    }

    function renderResults(docs, append = false) {
        if (!append) res.innerHTML = '';
        const fragment = document.createDocumentFragment();
        let i = 0;
        function pump() {
            let count = 0;
            while(i < docs.length && count < CHUNK){
                fragment.appendChild(cardFor(docs[i++]));
                count++;
            }
            res.appendChild(fragment);
            if (i < docs.length) requestAnimationFrame(pump);
        }
        requestAnimationFrame(pump);
    }
    async function fetchBooks({ append = false } = {}) {
        const title = q.value.trim();
        if (!title) { setStatus('Type a title to search', '#555'); return; }

        if (!append || title !== lastTitle) {
            currentPage = 1;
            lastBatchCount = 0;
            lastTitle = title;
        }
        if (controller) controller.abort();
        controller = new AbortController();

        if (!append) setStatus('Loading...', '#555');
        moreBtn.disabled = true;

        const slowTimer = setTimeout(() => setStatus('Slow response...', '#a66a00'), SLOW);
        const timeoutTimer = setTimeout(() => controller.abort('timeout'), TIMEOUT);

        try {
            const params = new URLSearchParams({ title, limit: LIMIT.toString(), page: currentPage.toString(), fields: 'key,title,author_name,cover_i' });
            const url = `${ENDPOINT}?${params.toString()}`;
            const resp = await fetch(url, { signal: controller.signal });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            const docs = Array.isArray(data.docs) ? data.docs : [];

            renderResults(docs, append);
            lastBatchCount = docs.length;

            setStatus(docs.length ? `Loaded${append ? 'more ' : ''}${docs.length} result(s)` : (append ? 'No more results' : 'No results'), '#555');

            if (docs.length === LIMIT) {
                currentPage += 1;
                moreBtn.style.display = 'inline-block';
                moreBtn.disabled = false;
            } else {
                moreBtn.style.display = 'none';
            }
        } catch (err){
            console.error('Search failed:', err);
            setStatus('Failed to load results. Please try again');
            moreBtn.disabled = false;
        } finally{
            clearTimeout(slowTimer);
            clearTimeout(timeoutTimer);
        }
        
    }
    go.addEventListener('click', () => fetchBooks({append:false}));
    q.addEventListener('keydown', (e) => {if (e.key === 'Enter') fetchBooks({ append:false});});
    moreBtn.addEventListener('click', () => fetchBooks({append:true}));
    clearBtn.addEventListener('click', () => { saveFavs([]); renderFavs(); });

    renderFavs();
})();