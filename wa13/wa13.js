(function () {
    const ENDPOINT = 'https://openlibrary.org/search.json';
    const imageSize = 'M';
    const q = document.getElementById('q');
    const go = document.getElementById('go');
    const res = document.getElementById('results');
    const status = document.getElementById('status');
    const favsEl = document.getElementById('favs');
    const clearBtn = document.getElementById('clear');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const pageInfo = document.getElementById('pageinfo');
    const pager = document.getElementById('pager');
    const panel = document.querySelector('.panel');

    const SLOW = 2500;
    const TIMEOUT = 10000;
    const STORE = 'olmini:fav';
    const LIMIT = 10;
    const CHUNK = 12;
    let controller = null;

    let currentPage = 1;
    let totalPages = 0;
    let lastTitle = '';

    const loadFavs = () => JSON.parse(localStorage.getItem(STORE) || '[]');
    const saveFavs = (list) => localStorage.setItem(STORE, JSON.stringify(list));
    const coverUrl = (id) => id ? `https://covers.openlibrary.org/b/id/${id}-${imageSize}.jpg` : '';

    function setStatus(msg, variant = 'default') {
        status.textContent = msg;
        status.classList.remove('warning', 'error');
        if (variant == 'warning') status.classList.add('warning');
        if (variant == 'error') status.classList.add('error');
    }

    function addFavorite(item) {
        if (!item) return;
        const list = loadFavs();
        const id = item.key;

        if (!id || list.some(f => f._id === id)) return;
        list.unshift({_id:id,item});
        saveFavs(list);
        renderFavs();
        syncFavoriteButtons();
    }
    function removeFavoriteById(id) {
        const cur = loadFavs();
        const next = cur.filter(f => f._id !== id);
        saveFavs(next);
        renderFavs();
        syncFavoriteButtons();
    }

    function removeFavoriteByIndex(i) {
        const cur = loadFavs();
        const removed = cur.splice(i, 1)[0];
        saveFavs(cur);
        renderFavs();
        if (removed && removed._id) syncFavoriteButtons();

    }
     function buyHrefFor(doc) {
        if (doc && doc.key) return `https://openlibrary.org${doc.key}`; // OpenLibrary page has borrow/buy links
        const q = encodeURIComponent(doc?.title || '');
        return `https://bookshop.org/search?keywords=${q}`;
    }
    function renderFavs() {
        const list = loadFavs();
        favsEl.innerHTML = '';
        if (!list.length) {
            const p = document.createElement('p');
            p.textContent = 'No favorites yet';
            p.classList.add('muted');
            favsEl.appendChild(p);
            return;
        }
        list.forEach((f, i) => {
            const div = document.createElement('div');
            div.className = 'favitem';
            const label = document.createElement('span');
            label.textContent = f.item.title;

            const buy = document.createElement('a');
            buy.href = buyHrefFor(f.item); 
            buy.target= '_blank';
             buy.rel = 'noopener norefferer'; 
             buy.className = 'buy'; 
             buy.textContent = 'Buy/Borrow';

            const del = document.createElement('button');
            del.textContent = 'X';
            del.addEventListener('click', () => removeFavoriteByIndex(i));
            div.append(label, buy, del);
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
            const im = document.createElement('img'); im.src = src; img.alt = `Cover of ${doc.title}`; img.appendChild(im);
        }
        else img.textContent = 'No Cover Available';
        const t = document.createElement('div'); t.className = 'title'; t.textContent = doc.title;
        const a = document.createElement('div'); a.className = 'author'; a.textContent = (doc.author_name || []).join(', ');
        const buy = document.createElement('a'); 
        buy.href = buyHrefFor(doc); 
        buy.target= '_blank'; 
        buy.rel = 'noopener norefferer'; 
        buy.className = 'buy'; 
        buy.textContent = 'Buy/Borrow';

        const fav = document.createElement('button'); 
        fav.className = 'fav'; 
        fav.dataset.id = doc.key || '';
        fav.textContent = '☆ Favorite';
        fav.addEventListener('click', () => {
            const id = doc.key;
            const list = loadFavs();
            const exists = list.some(f => f._id ===id);
            if (exists){
                removeFavoriteById(id);
            } else {
                addFavorite(doc);
            }
            syncFavoriteButtons();
        });
        c.append(img, t, a,buy, fav);
        return c;
    }
    function syncFavoriteButtons(){
        const ids = new Set(loadFavs().map(f => f._id));
        document.querySelectorAll('.card .fav').forEach(btn =>{
            const id= btn.dataset.id;
            if(id && ids.has(id)){
                btn.textContent = '✓ Favorited';
                btn.classList.add ('is-fav');   
            } else {
                btn.textContent = '☆ Favorite';
                btn.classList.remove ('is-fav');                   
            }
    })
    }
    function renderResults(docs) {
        res.innerHTML = '';
        const fragment = document.createDocumentFragment();
        let i = 0;
        function pump() {
            let count = 0;
            while (i < docs.length && count < CHUNK) {
                fragment.appendChild(cardFor(docs[i++]));
                count++;
            }
            res.appendChild(fragment);
            if (i < docs.length) requestAnimationFrame(pump);
        }
        requestAnimationFrame(pump);
    }
    function updatePager() {
        console.log(`Current Page: ${currentPage}, Total Pages: ${totalPages}`);
        if (totalPages > 0) {
            pager.classList.add('visible');
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            prevBtn.disabled = currentPage <= 1;
            nextBtn.disabled = currentPage >= totalPages;
        } else {
            pager.classList.remove('visible');
        }
    }
    async function fetchBooks(page = 1) {
        const title = q.value.trim();
        if (!title) { setStatus('Type a title to search', '#555'); return; }

        if (title !== lastTitle) {
            currentPage = 1;
            totalPages = 0;
            lastTitle = title;
        } else {
            currentPage = page;
        }
        if (controller) controller.abort();
        controller = new AbortController();

        setStatus('Loading...', '#555');

        const slowTimer = setTimeout(() => setStatus('Slow response...', 'warning'), SLOW);
        const timeoutTimer = setTimeout(() => controller.abort('timeout'), TIMEOUT);

        try {
            const params = new URLSearchParams({ title, limit: String(LIMIT), page: String(currentPage), fields: 'key,title,author_name,cover_i' });
            const url = `${ENDPOINT}?${params.toString()}`;
            const resp = await fetch(url, { signal: controller.signal });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();

            const docs = Array.isArray(data.docs) ? data.docs : [];
            const numFound = Number.isFinite(data.numFound) ? data.numFound : 0;
            totalPages = Math.max(1, Math.ceil(numFound / LIMIT));

            renderResults(docs);

            setStatus(docs.length ? `Showing ${docs.length} results` : 'No results');
            updatePager();
        } catch (err) {
            console.error(`Search Failed`, err);
            setStatus('Failed to load results. Please try again.', 'error');
        } finally {
            clearTimeout(slowTimer);
            clearTimeout(timeoutTimer);
        }
    }
    go.addEventListener('click', () => fetchBooks(1));
    q.addEventListener('keydown', (e) => { if (e.key === 'Enter') fetchBooks(1); });
    prevBtn.addEventListener('click', () => { if (currentPage > 1) fetchBooks(currentPage - 1); });
    nextBtn.addEventListener('click', () => { if (currentPage < totalPages) fetchBooks(currentPage + 1); });
    clearBtn.addEventListener('click', () => { saveFavs([]); renderFavs(); syncFavoriteButtons(); });

    renderFavs();
    updatePager();
})();