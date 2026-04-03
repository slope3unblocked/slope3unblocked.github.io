document.addEventListener('DOMContentLoaded', function() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    const playBtn = document.getElementById('playBtn');
    const itemFrame = document.getElementById('itemFrame');
    const preloader = document.getElementById('preloader');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const mobileBackBtn = document.getElementById('mobile-back-button');
    const favBtn = document.getElementById('favoriteBtn');
    const navbar = document.querySelector('.navbar');
    const itemHeader = document.querySelector('.item-header');
    
    let startTime = new Date();
    const eventLabel = playBtn ? playBtn.getAttribute('data-event-label') : document.title;
    const encodedUrl = playBtn ? playBtn.getAttribute('data-item-url') : '';
    let itemUrl = '';
    try { if (encodedUrl) itemUrl = atob(encodedUrl); } catch(e) {}
    
    window.addEventListener('pagehide', function() {
        let timeSpent = new Date() - startTime;
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'time_spent', { 'event_category': 'Engagement', 'event_label': eventLabel, 'value': Math.floor(timeSpent / 1000) });
        }
    });
    
    if (playBtn && itemFrame && preloader && itemUrl) {
        playBtn.addEventListener('mouseenter', function() {
            if (!window.preconnectedDomain && itemUrl) {
                try {
                    const domain = new URL(itemUrl).origin;
                    const link = document.createElement('link');
                    link.rel = 'preconnect';
                    link.href = domain;
                    link.crossOrigin = 'anonymous';
                    document.head.appendChild(link);
                    window.preconnectedDomain = true;
                } catch(e) {}
            }
        });

        playBtn.addEventListener('click', function() {
            itemFrame.src = itemUrl;
            itemFrame.style.display = 'block';
            preloader.style.display = 'none';
            if (fullscreenBtn) fullscreenBtn.style.display = 'inline-flex';
            
            if (mobileBackBtn && window.innerWidth <= 768) {
                mobileBackBtn.classList.add('show');
                if (navbar) navbar.style.display = 'none';
                if (itemHeader) itemHeader.style.display = 'none';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            if (typeof window.gtag === 'function') {
                window.gtag('event', 'play_now_click', { 'event_category': 'Engagement', 'event_label': eventLabel });
            }
            setTimeout(() => {
                itemFrame.focus();
            }, 150);
        });
        
        itemFrame.addEventListener('load', function() {
            if (itemFrame.src && itemFrame.src !== window.location.href) {
                if (typeof window.gtag === 'function') {
                    window.gtag('event', 'item_load', { 'event_category': 'Engagement', 'event_label': eventLabel });
                }
            }
        });
    }

    if (mobileBackBtn) {
        mobileBackBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            itemFrame.src = 'about:blank';
            itemFrame.style.display = 'none';
            preloader.style.display = 'flex';
            mobileBackBtn.classList.remove('show');
            if (fullscreenBtn) fullscreenBtn.style.display = 'none';
            if (navbar) navbar.style.display = '';
            if (itemHeader) itemHeader.style.display = '';
        });
    }
    
    if (fullscreenBtn && itemFrame) {
        fullscreenBtn.addEventListener('click', function() {
            if(itemFrame.requestFullscreen){itemFrame.requestFullscreen();}
            else if(itemFrame.webkitRequestFullscreen){itemFrame.webkitRequestFullscreen();}
            else if(itemFrame.msRequestFullscreen){itemFrame.msRequestFullscreen();}
        });
    }

    if (favBtn) {
        const gameSlug = favBtn.getAttribute('data-slug');
        let favs = JSON.parse(localStorage.getItem('user_favorites') || '[]');
        if (favs.some(g => g.slug === gameSlug)) {
            favBtn.classList.add('active');
            favBtn.innerHTML = '❤️ FAVORITED';
        } else {
            favBtn.innerHTML = '🤍 FAVORITE';
        }
        
        favBtn.addEventListener('click', function() {
            favs = JSON.parse(localStorage.getItem('user_favorites') || '[]');
            const idx = favs.findIndex(g => g.slug === gameSlug);
            if (idx > -1) {
                favs.splice(idx, 1);
                favBtn.classList.remove('active');
                favBtn.innerHTML = '🤍 FAVORITE';
            } else {
                favs.push({
                    slug: gameSlug,
                    title: favBtn.getAttribute('data-title'),
                    img: favBtn.getAttribute('data-img')
                });
                favBtn.classList.add('active');
                favBtn.innerHTML = '❤️ FAVORITED';
            }
            localStorage.setItem('user_favorites', JSON.stringify(favs));
        });
    }
});