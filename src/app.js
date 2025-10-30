const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')

const app = express()
const port = 4000

// Menentukan path folder public dan templates
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine dan lokasi views
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory untuk file publik
app.use(express.static(publicDirectoryPath))

// Halaman utama
app.get('', (req, res) => {
  res.render('index', {
    judul: 'Aplikasi Cek Cuaca',
    nama: 'Dolly Anggara'
  })
})

// Halaman tentang
app.get('/tentang', (req, res) => {
  res.render('tentang', {
    judul: 'Tentang Saya',
    nama: 'Dolly Anggara'
  })
})

// Halaman informasi cuaca
app.get('/infoCuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukan lokasi yang ingin dicari'
        });
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }

        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error) {
                return res.send({ error });
            }

            res.send({
                prediksiCuaca: dataPrediksi.description,
                lokasi: location,
                address: req.query.address,
                dataLengkap: dataPrediksi
            });
        });
    });
});

// Halaman bantuan
app.get('/bantuan', (req, res) => {
  res.render('bantuan', {
    judul: 'Halaman Bantuan',
    teksBantuan: 'Ini halaman bantuan (FAQ)',
    nama: 'Dolly Anggara'
  })
})

// =============================================
// HALAMAN BERITA - Menggunakan Mediastack API
// =============================================
app.get('/berita', (req, res) => {
  res.render('berita', {
    judul: 'Berita Terkini',
    nama: 'Dolly Anggara'
  })
})


// Di route /api/berita, ganti dengan kode ini:
app.get('/api/berita', (req, res) => {
  const request = require('postman-request');
  const apiKey = 'fff84a214dfd23abf29dc5535bd575a8';
  const keywords = req.query.keywords || 'general';
  const limit = req.query.limit || 12;
  
  const url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&keywords=${keywords}&limit=${limit}`;

  request({ url, json: true }, (error, response, body) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Tidak dapat terhubung ke layanan berita'
      });
    }

    if (body.error) {
      return res.status(400).json({
        success: false,
        error: body.error.info || 'Terjadi kesalahan saat mengambil berita'
      });
    }

    if (!body.data || body.data.length === 0) {
      return res.json({
        success: true,
        berita: [],
        total: 0,
        keywords: keywords,
        message: 'Tidak ada berita ditemukan untuk kata kunci tersebut'
      });
    }

    res.json({
      success: true,
      berita: body.data,
      total: body.data.length,
      keywords: keywords
    });
  });
});

// Halaman 404
app.get(/.*/, (req, res) => {
  res.render('404', {
    judul: '404',
    nama: 'Dolly Anggara',
    pesanKesalahan: 'Halaman tidak ditemukan.'
  })
})

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`)
})