console.log("Client side javascript file diproses");

document.addEventListener("DOMContentLoaded", () => {
    const weatherForm = document.querySelector('.weather-form');
    const searchInput = document.querySelector('.weather-input');
    const weatherInfo = document.querySelector('.weather-info');
    const locationName = document.getElementById('location-name');
    const currentDate = document.getElementById('current-date');
    const tempValue = document.getElementById('temp-value');
    const conditionIcon = document.getElementById('condition-icon');
    const conditionText = document.getElementById('condition-text');
    const humidityValue = document.getElementById('humidity-value');
    const windValue = document.getElementById('wind-value');

    // Format tanggal saat ini
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDate.textContent = now.toLocaleDateString('id-ID', options);

    if (weatherForm) {
        weatherForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const location = searchInput.value.trim();

            if (!location) {
                showError('Silakan masukkan nama kota atau lokasi');
                return;
            }

            showLoading();

            fetch('/infoCuaca?address=' + encodeURIComponent(location))
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Gagal mengambil data cuaca');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.error) {
                        showError(data.error);
                    } else {
                        displayWeather(data);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    showError('Terjadi kesalahan saat mengambil data cuaca');
                });
        });
    }

    function showLoading() {
        weatherInfo.classList.add('show');
        locationName.textContent = 'Mencari...';
        tempValue.textContent = '--';
        conditionText.textContent = 'Memuat data...';
        humidityValue.textContent = '--%';
        windValue.textContent = '-- km/jam';
        conditionIcon.className = 'fas fa-spinner fa-spin';
    }

    function showError(message) {
        weatherInfo.classList.add('show');
        locationName.textContent = 'Error';
        tempValue.textContent = '--';
        conditionText.textContent = message;
        humidityValue.textContent = '--%';
        windValue.textContent = '-- km/jam';
        conditionIcon.className = 'fas fa-exclamation-triangle';
    }

    function displayWeather(data) {
        weatherInfo.classList.add('show');
        locationName.textContent = data.lokasi;
        
        // Jika ada data lengkap, gunakan data tersebut
        if (data.dataLengkap) {
            const weather = data.dataLengkap;
            
            // Temperatur
            tempValue.textContent = weather.temperature;
            
            // Deskripsi cuaca
            conditionText.textContent = weather.weather_description;
            
            // Kelembaban
            humidityValue.textContent = typeof weather.humidity === 'number' 
                ? `${weather.humidity}%` 
                : 'Data tidak tersedia';
            
            // Kecepatan angin
            windValue.textContent = typeof weather.wind_speed === 'number' 
                ? `${weather.wind_speed} km/jam` 
                : 'Data tidak tersedia';
            
            // Tentukan ikon berdasarkan deskripsi cuaca
            setWeatherIcon(weather.weather_description.toLowerCase());
            
        } else {
            // Fallback ke parsing string lama (untuk kompatibilitas)
            displayWeatherFromString(data);
        }
    }

    function displayWeatherFromString(data) {
        const prediksi = data.prediksiCuaca;
        
        // Ekstrak suhu dari string prediksi
        const tempMatch = prediksi.match(/(\d+) derajat/);
        if (tempMatch) {
            tempValue.textContent = tempMatch[1];
        } else {
            tempValue.textContent = '--';
        }
        
        // Tentukan ikon berdasarkan deskripsi cuaca
        if (prediksi.includes('Cerah') || prediksi.includes('cerah') || prediksi.includes('Sunny') || prediksi.includes('Clear')) {
            conditionIcon.className = 'fas fa-sun';
            conditionText.textContent = 'Cerah';
        } else if (prediksi.includes('Berawan') || prediksi.includes('berawan') || prediksi.includes('Cloud') || prediksi.includes('cloud')) {
            conditionIcon.className = 'fas fa-cloud';
            conditionText.textContent = 'Berawan';
        } else if (prediksi.includes('Hujan') || prediksi.includes('hujan') || prediksi.includes('Rain') || prediksi.includes('rain')) {
            conditionIcon.className = 'fas fa-cloud-rain';
            conditionText.textContent = 'Hujan';
        } else if (prediksi.includes('Mendung') || prediksi.includes('mendung') || prediksi.includes('Overcast')) {
            conditionIcon.className = 'fas fa-cloud';
            conditionText.textContent = 'Mendung';
        } else if (prediksi.includes('Salju') || prediksi.includes('salju') || prediksi.includes('Snow')) {
            conditionIcon.className = 'fas fa-snowflake';
            conditionText.textContent = 'Salju';
        } else {
            conditionIcon.className = 'fas fa-cloud';
            conditionText.textContent = 'Informasi cuaca tersedia';
        }
        
        // Untuk kelembaban dan angin, coba ekstrak dari string
        const humidityMatch = prediksi.match(/Kelembaban[:\s]*(\d+)%/);
        if (humidityMatch) {
            humidityValue.textContent = `${humidityMatch[1]}%`;
        } else {
            humidityValue.textContent = 'Data tidak tersedia';
        }
        
        const windMatch = prediksi.match(/Angin[:\s]*(\d+)\s*km/);
        if (windMatch) {
            windValue.textContent = `${windMatch[1]} km/jam`;
        } else {
            windValue.textContent = 'Data tidak tersedia';
        }
    }

    function setWeatherIcon(description) {
        if (description.includes('sunny') || description.includes('clear')) {
            conditionIcon.className = 'fas fa-sun';
        } else if (description.includes('cloud')) {
            conditionIcon.className = 'fas fa-cloud';
        } else if (description.includes('rain') || description.includes('drizzle')) {
            conditionIcon.className = 'fas fa-cloud-rain';
        } else if (description.includes('thunder') || description.includes('storm')) {
            conditionIcon.className = 'fas fa-bolt';
        } else if (description.includes('snow')) {
            conditionIcon.className = 'fas fa-snowflake';
        } else if (description.includes('fog') || description.includes('mist')) {
            conditionIcon.className = 'fas fa-smog';
        } else {
            conditionIcon.className = 'fas fa-cloud';
        }
    }
});