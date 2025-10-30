const request = require('postman-request');

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=f967c5f0f4761a19a1bff0caeddc3a85&query=' +
        encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude) + '&units=m';

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback('Tidak dapat terkoneksi ke layanan', undefined);
        } else if (response.body.error) {
            callback('Tidak dapat menemukan lokasi', undefined);
        } else {
            const current = response.body.current;
            
            // Format data cuaca lengkap
            const weatherData = {
                description: `Info Cuaca: ${current.weather_descriptions[0]}. ` +
                           `Suhu saat ini adalah ${current.temperature}°C. ` +
                           `Terasa seperti ${current.feelslike}°C. ` +
                           `Index UV adalah ${current.uv_index}. ` +
                           `Visibilitas ${current.visibility} km.`,
                temperature: current.temperature,
                feels_like: current.feelslike,
                weather_description: current.weather_descriptions[0],
                humidity: current.humidity || 'Data tidak tersedia',
                wind_speed: current.wind_speed || 'Data tidak tersedia',
                wind_degree: current.wind_degree || 'Data tidak tersedia',
                wind_dir: current.wind_dir || 'Data tidak tersedia',
                pressure: current.pressure || 'Data tidak tersedia',
                precip: current.precip || 'Data tidak tersedia',
                cloudcover: current.cloudcover || 'Data tidak tersedia',
                uv_index: current.uv_index,
                visibility: current.visibility,
                is_day: current.is_day
            };

            callback(undefined, weatherData);
        }
    });
};

module.exports = forecast;