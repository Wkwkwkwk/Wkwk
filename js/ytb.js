document.addEventListener('DOMContentLoaded', () => {
    const API_KEYS = [
        'AIzaSyBYWQ9dm5RQXNCMaBQZ-gpgLUe6WX3GshQ',
        'AIzaSyBUa1x2BO3OE6upcxVVur0EtmCTJ3_EMsU',
        'AIzaSyBXdWCUZPb3HVxBbAoPo6XWHS3Zdtrg4R0',
        'AIzaSyBwQ-PzU9VhprlFqTUYuHb48fUjqt2EVPQ',
        'AIzaSyBNX_zWA8r8Xbf9zvZt3pIJHESoGI_376A',
        'AIzaSyCNBG-PMQVP-b7b1mDQciDW-lBXe4fW4',
        'AIzaSyA6W928MmYgIp_yASfDPYizt5ZJfp8kGJ4'
    ];
    let currentKeyIndex = 0;

    // Daftar channel yang akan ditampilkan
    const scienceChannels = [
        'UCpdwWrQYnGSyWJSRy-eGhCg',  // Tekotok
        'UCfQHaUbD0oEBH_FRYHE5qIg',  // Sepulang Sekolah
        'UCY_QJ_qZWOIOJKAiBKatFaQ',  // Kok Bisa
        'UCwRH985XgMYXQ6NxXDo8npw',  // Kurzgesagt
        'UCin0m13qWv3-051xlWlHamA',  // Veritasium
        'UCaPa78XJgS-BrTxsVYHPA6',   // Gadgetin
        'UCAuUUnT6oDeKwE6v1NGQxug',  // TedEd
        'UCC_OYI6VZtuEZuq49Ht-cQQ',  // Ferry Irwandi
        'UCA19mAJURyYHbJzhfpqhpCA',  // Action Lab
        'UCEIwxahdLz7bap-VDs9h35A',  // Steve Mould
        'UCzI8ArgVBHXN3lSz-dI0yRw',  // Narasi Newsroom
        'UCkzbfqQmXyAPY_XEsJvkcWg',  // Gerrard Wijaya
        'UCFP8lCYY-qRchUhFQzieMjQ',  // NatGeo Indonesia
        'UC-DgB27DyWZDrA9J37-HP_Q',  // Tretan Universe
        'UC513PdAP2-jWkJunTh5kXRw',  // Mark Rober
        'UCBREMSD-melGOMVONey64Lg',  // Asumsi
        'UCVSB96sHYiHMlAkMfjl0Wzw',  // Alam Semenit
        'UC1_uAIS3r8Vu6JjXWvastJg',  // 3Blue1Brown
        'UCshVTOdmZLdLj8LTV1j_0uw',  // TED
        'UCvNkERNo3eAT59vzqE4-3Vg',  // Banda Neira Topic
    ];

    // Elemen-elemen di halaman
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    const videoPlayer = document.getElementById('videoPlayer');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const commentsContainer = document.getElementById('commentsContainer');
    const sortSelect = document.getElementById('sortSelect');
    const filterSelect = document.getElementById('filterSelect');
    
    // Ambil container download dan tombol download dari HTML
    const downloadContainer = document.getElementById('downloadContainer');
    const downloadButton = document.getElementById('downloadButton');
    // Pastikan container download disembunyikan secara default
    downloadContainer.style.display = 'none';

    // Variabel penunjang
    let nextPageToken = null;
    let nextCommentsPageToken = null;
    let currentQuery = '';
    let isLoading = false;
    let isLoadingComments = false;

    // Set default sort ke "date" (video terbaru)
    let sortOrder = 'date';

    // Set default filter ke "medium" (4-20 menit) untuk memprioritaskan video biasa
    let videoDurationFilter = 'medium';

    // Fungsi mendapatkan API key yang sedang dipakai
    const getCurrentApiKey = () => API_KEYS[currentKeyIndex];

    // Fungsi menggeser ke API key berikutnya
    const rotateApiKey = () => {
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    };

    // Loading overlay
    const showLoading = () => {
        loadingOverlay.style.display = 'flex';
    };
    const hideLoading = () => {
        loadingOverlay.style.display = 'none';
    };
    hideLoading();

    // Toggle panel kiri
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    const toggleLeftPanelButton = document.createElement('button');

    // Set gambar latar untuk tombol toggle
    toggleLeftPanelButton.style.backgroundImage = 'url("../assets/cursor/minimize.png")';
    toggleLeftPanelButton.style.backgroundSize = '50%';
    toggleLeftPanelButton.style.backgroundRepeat = 'no-repeat';
    toggleLeftPanelButton.style.backgroundPosition = 'center';
    toggleLeftPanelButton.style.width = '50px';
    toggleLeftPanelButton.style.height = '50px';
    toggleLeftPanelButton.style.padding = '10px';
    toggleLeftPanelButton.classList.add('toggle-left-panel');
    document.body.appendChild(toggleLeftPanelButton);

    toggleLeftPanelButton.addEventListener('click', () => {
        if (leftPanel.style.display === 'none') {
            leftPanel.style.display = 'block';
            rightPanel.style.margin = '0';
            videoPlayer.style.transition = 'height 0.3s ease';
            videoPlayer.style.height = '415px';
        } else {
            leftPanel.style.display = 'none';
            rightPanel.style.margin = '0 auto';
            videoPlayer.style.transition = 'height 0.3s ease';
            videoPlayer.style.height = '600px';
            videoPlayer.style.marginTop = '10px';
        }
    });

    // Fungsi menghasilkan tanggal 1 tahun yang lalu (format ISO8601)
    function getOneYearAgoDate() {
        const now = new Date();
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return oneYearAgo.toISOString();
    }

    // Fungsi untuk mengacak urutan array (Fisher-Yates Shuffle)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // ---------------------
    // LOAD VIDEO "POPULER" / REKOMENDASI PADA CHANNEL
    // ---------------------
    const loadPopularVideos = async () => {
        showLoading();
        searchResults.innerHTML = '';
        shuffleArray(scienceChannels);
        const publishedAfter = getOneYearAgoDate();
        const videoMap = {};

        // Ambil video dari masing-masing channel
        for (let i = 0; i < scienceChannels.length; i++) {
            const channelId = scienceChannels[i];
            const apiKey = getCurrentApiKey();
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&channelId=${channelId}&key=${apiKey}&maxResults=1&order=viewCount&publishedAfter=${publishedAfter}&videoDuration=${videoDurationFilter}&regionCode=US&relevanceLanguage=en`
                .replace(/\s+/g, '');
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                if (data.items.length > 0) {
                    videoMap[channelId] = data.items;
                }
            } catch (error) {
                console.error(`Error fetching videos from channel ${channelId}:`, error);
                rotateApiKey();
            }
        }

        // Ambil video secara round-robin dari setiap channel
        const videoPool = [];
        let finished = false;
        let index = 0;
        while (!finished) {
            finished = true;
            for (const channelId of scienceChannels) {
                const videos = videoMap[channelId];
                if (videos && videos[index]) {
                    videoPool.push(videos[index]);
                    finished = false;
                }
            }
            index++;
        }

        videoPool.forEach((video) => {
            renderSearchResult(video);
        });

        hideLoading();
    };

    // ---------------------
    // SEARCH VIDEO (saat user mengetik di search bar)
    // ---------------------
    const searchVideos = async (query, pageToken = '') => {
        if (isLoading) return;
        isLoading = true;
        showLoading();
        let success = false;
        let videoDurationParam = '';
        if (videoDurationFilter !== 'any') {
            videoDurationParam = `&videoDuration=${videoDurationFilter}`;
        }
        for (let i = 0; i < API_KEYS.length; i++) {
            const apiKey = getCurrentApiKey();
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&order=${sortOrder}&key=${apiKey}&maxResults=10&pageToken=${pageToken}${videoDurationParam}`
                .replace(/\s+/g, '');
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                nextPageToken = data.nextPageToken || null;
                if (data.items.length === 0 && !pageToken) {
                    searchResults.innerHTML = '<p>No videos found.</p>';
                }
                data.items.forEach(item => renderSearchResult(item));
                success = true;
                break;
            } catch (error) {
                console.error(`Error with API key ${apiKey}:`, error);
                rotateApiKey();
            }
        }
        if (!success) {
            searchResults.innerHTML = '<p>All API keys failed. Please try again later.</p>';
        }
        hideLoading();
        isLoading = false;
    };

    // Tampilkan hasil pencarian di panel kiri
    const renderSearchResult = (item) => {
        const videoId = item.id.videoId;
        const title = item.snippet.title;
        const thumbnail = item.snippet.thumbnails.medium.url;
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <img src="${thumbnail}" alt="${title}">
            <p>${title}</p>
        `;
        resultItem.addEventListener('click', () => {
            document.querySelectorAll('.result-item').forEach(el => el.classList.remove('selected'));
            resultItem.classList.add('selected');
            loadVideo(videoId);
        });
        searchResults.appendChild(resultItem);
    };

    // ------------
    // Inisialisasi YouTube Iframe API untuk kontrol kualitas video
    // ------------
    let player = null;
    let currentVideoId = '';

    // Ambil downloadContainer dan downloadButton sudah dari HTML (lihat di atas)
    downloadButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Download button clicked");
        if (currentVideoId) {
            console.log("Current video ID:", currentVideoId);
            downloadVideo(currentVideoId);
        } else {
            console.log("Tidak ada video yang dipilih.");
        }
    });

    // Fungsi callback global (dipanggil oleh API YouTube)
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('videoPlayer', {
            height: '415',
            width: '100%',
            videoId: '',
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function onPlayerReady(event) {
        // Player sudah siap
    }

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            hideLoading();
            // Tampilkan container download (yang sudah diatur secara center melalui CSS)
            downloadContainer.style.display = 'flex';
            nextCommentsPageToken = null;
            commentsContainer.innerHTML = '';
            fetchComments(currentVideoId);
        }
    }

    // Memuat video menggunakan YouTube Player API dan paksa kualitas rendah ("small")
    const loadVideo = (videoId) => {
        showLoading();
        currentVideoId = videoId;
        const videoPlaceholder = document.getElementById('videoPlaceholder');
        videoPlaceholder.style.display = 'none';
        videoPlayer.style.display = 'block';
        // Sembunyikan container download sebelum video dimuat kembali
        downloadContainer.style.display = 'none';
        if (player && typeof player.loadVideoById === 'function') {
            player.loadVideoById(videoId);
            player.setPlaybackQuality('small');
        } else {
            // Fallback: jika player belum siap, gunakan metode lama
            videoPlayer.src = `https://www.youtube.com/embed/${videoId}?vq=small&autoplay=1`;
            videoPlayer.onload = () => {
                hideLoading();
                downloadContainer.style.display = 'flex';
                nextCommentsPageToken = null;
                commentsContainer.innerHTML = '';
                fetchComments(videoId);
            };
        }
    };

    // Fungsi download video dengan membuka jendela baru ke Y2mate dengan URL khusus
    const downloadVideo = (videoId) => {
        // Contoh: mengarahkan ke Y2Mate dengan menyisipkan videoId sebagai parameter (perhatikan URL ini hanyalah contoh)
        // Pastikan Anda mengecek apakah layanan tersebut menerima parameter videoId secara langsung
        const url = `https://www.y2mate.com/youtube/${videoId}`;
        window.open(url, '_blank');
    };

    // Ambil komentar video
    const fetchComments = async (videoId, pageToken = '') => {
        if (isLoadingComments) return;
        isLoadingComments = true;
        let success = false;
        for (let i = 0; i < API_KEYS.length; i++) {
            const apiKey = getCurrentApiKey();
            const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}&maxResults=10&pageToken=${pageToken}`
                .replace(/\s+/g, '');
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                nextCommentsPageToken = data.nextPageToken || null;
                if (!data.items || data.items.length === 0) {
                    if (!pageToken) {
                        commentsContainer.innerHTML = '<p>No comments available.</p>';
                    }
                    return;
                }
                data.items.forEach(item => {
                    const comment = item.snippet.topLevelComment.snippet;
                    const author = comment.authorDisplayName;
                    const text = comment.textDisplay;
                    const commentItem = document.createElement('div');
                    commentItem.classList.add('comment-item');
                    commentItem.innerHTML = `
                        <p class="comment-author">${author}</p>
                        <p class="comment-text">${text}</p>
                    `;
                    commentsContainer.appendChild(commentItem);
                });
                success = true;
                break;
            } catch (error) {
                console.error(`Error with API key ${apiKey}:`, error);
                rotateApiKey();
            }
        }
        if (!success) {
            commentsContainer.innerHTML = '<p>Pengunggah menonaktifkan komentar</p>';
        }
        isLoadingComments = false;
    };

    // Ambil metadata video (digunakan saat user paste link)
    const fetchVideoMetadata = async (videoId) => {
        const apiKey = getCurrentApiKey();
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
            .replace(/\s+/g, '');
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data.items.length > 0) {
                return data.items[0].snippet;
            }
        } catch (error) {
            console.error('Error fetching video metadata:', error);
        }
        return null;
    };

    // Fungsi utama pencarian
    const startSearch = async () => {
        const input = searchInput.value.trim();
        if (!input) {
            loadPopularVideos();
            return;
        }
        const videoId = extractVideoId(input);
        if (videoId) {
            const metadata = await fetchVideoMetadata(videoId);
            if (metadata) {
                loadVideo(videoId);
                searchResults.innerHTML = '';
                renderSearchResult({
                    id: { videoId },
                    snippet: metadata,
                });
            }
            return;
        }
        currentQuery = input;
        searchResults.innerHTML = '';
        nextPageToken = null;
        searchVideos(currentQuery);
    };

    // Helper: ekstrak video ID dari URL YouTube
    const extractVideoId = (url) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    // Event listener untuk tombol search dan input enter
    searchBtn.addEventListener('click', startSearch);
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') startSearch();
    });

    // Infinite scroll untuk search results
    searchResults.addEventListener('scroll', () => {
        if (
            searchResults.scrollTop + searchResults.clientHeight >= 
            searchResults.scrollHeight - 10 &&
            nextPageToken
        ) {
            searchVideos(currentQuery, nextPageToken);
        }
    });

    // Infinite scroll untuk komentar
    commentsContainer.addEventListener('scroll', () => {
        if (
            commentsContainer.scrollTop + commentsContainer.clientHeight >=
            commentsContainer.scrollHeight - 10 &&
            nextCommentsPageToken
        ) {
            const videoId = videoPlayer.src.split('/embed/')[1]?.split('?')[0];
            if (videoId) fetchComments(videoId, nextCommentsPageToken);
        }
    });

    // Saat user mengubah pilihan sort
    sortSelect.addEventListener('change', () => {
        sortOrder = sortSelect.value;
        if (currentQuery) {
            searchResults.innerHTML = '';
            nextPageToken = null;
            searchVideos(currentQuery);
        } else {
            loadPopularVideos();
        }
    });

    // Saat user mengubah pilihan filter
    filterSelect.addEventListener('change', () => {
        videoDurationFilter = filterSelect.value;
        if (currentQuery) {
            searchResults.innerHTML = '';
            nextPageToken = null;
            searchVideos(currentQuery);
        } else {
            loadPopularVideos();
        }
    });

    // Klik logo untuk refresh halaman
    const logoYtb = document.querySelector('.logoYtb');
    logoYtb.addEventListener('click', () => {
        window.location.reload();
    });

    // Tampilkan video rekomendasi saat pertama load
    loadPopularVideos();

    // Tambahkan komentar default
    const defaultCommentItem = document.createElement('div');
    defaultCommentItem.classList.add('comment-item');
    defaultCommentItem.innerHTML = `
        <p class="comment-author">Sebastian The Developer Guy</p>
        <p class="comment-text">Nanti komentarnya juga muncul di sini ya guys</p>
    `;
    commentsContainer.appendChild(defaultCommentItem);
});
