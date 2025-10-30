document.addEventListener("DOMContentLoaded", () => {
    const searchBeritaBtn = document.getElementById('searchBeritaBtn');
    const loadDefaultBeritaBtn = document.getElementById('loadDefaultBerita');
    const beritaKeywords = document.getElementById('beritaKeywords');
    const loadingBerita = document.getElementById('loadingBerita');
    const beritaError = document.getElementById('beritaError');
    const beritaResults = document.getElementById('beritaResults');

    const loadBerita = async (keywords = 'indonesia') => {
        if (!keywords.trim()) {
            beritaError.textContent = 'Silakan masukkan kata kunci pencarian';
            beritaError.style.display = 'block';
            return;
        }

        loadingBerita.style.display = 'block';
        beritaError.style.display = 'none';
        beritaResults.innerHTML = '';

        try {
            const response = await fetch(`/api/berita?keywords=${encodeURIComponent(keywords)}&limit=12`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Terjadi kesalahan');
            }

            if (data.success && data.berita.length > 0) {
                displayBerita(data.berita, keywords);
            } else {
                beritaError.textContent = data.message || 'Tidak ada berita ditemukan';
                beritaError.style.display = 'block';
            }
        } catch (error) {
            beritaError.textContent = error.message;
            beritaError.style.display = 'block';
        } finally {
            loadingBerita.style.display = 'none';
        }
    };

    const displayBerita = (berita, keywords) => {
        const beritaHTML = berita.map((item) => `
            <div class="berita-card">
                <div class="berita-image">
                    ${item.image ? 
                        `<img src="${item.image}" alt="${item.title}" onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\"no-image\">📰</div>';">` : 
                        `<div class="no-image">📰</div>`
                    }
                </div>
                <div class="berita-content">
                    <h3 class="berita-title">${item.title}</h3>
                    <p class="berita-deskripsi">${item.description || 'Tidak ada deskripsi tersedia.'}</p>
                    <div class="berita-meta">
                        <span class="berita-sumber">${item.source || 'Tidak diketahui'}</span>
                        <span class="berita-tanggal">${item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}</span>
                    </div>
                    ${item.url ? `<a href="${item.url}" target="_blank" class="berita-link">Baca Selengkapnya →</a>` : ''}
                </div>
            </div>
        `).join('');

        beritaResults.innerHTML = `
            <div class="berita-header">
                <h3>Hasil Pencarian: "${keywords}"</h3>
                <p>Ditemukan ${berita.length} berita</p>
            </div>
            <div class="berita-grid">
                ${beritaHTML}
            </div>
        `;
    };

    searchBeritaBtn.addEventListener('click', () => {
        const keywords = beritaKeywords.value.trim();
        loadBerita(keywords);
    });

    loadDefaultBeritaBtn.addEventListener('click', () => {
        beritaKeywords.value = '';
        loadBerita('general');
    });

    beritaKeywords.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const keywords = beritaKeywords.value.trim();
            loadBerita(keywords);
        }
    });

    // Load berita default saat halaman pertama kali dimuat
    loadBerita('general');
});