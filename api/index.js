const express = require('express');
const app = express();

// 🔴 آدرس پنل اصلی شما
const BASE_PANEL_URL = "https://cdn.mytechline.ir:2096";

app.use(async (req, res) => {
  try {
    const targetUrl = BASE_PANEL_URL + req.url;
    const userAgent = req.headers['user-agent'] || '';

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'Accept': req.headers['accept'] || '*/*'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send(`خطا از سمت پنل: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const data = await response.text();

    if (response.headers.get('subscription-userinfo')) {
      res.setHeader('Subscription-Userinfo', response.headers.get('subscription-userinfo'));
    }
    if (response.headers.get('profile-title')) {
      res.setHeader('profile-title', response.headers.get('profile-title'));
    }
    if (response.headers.get('profile-update-interval')) {
      res.setHeader('Profile-Update-Interval', response.headers.get('profile-update-interval'));
    }

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Content-Type', contentType || 'text/plain; charset=utf-8');

    return res.status(200).send(data);

  } catch (err) {
    return res.status(500).send("خطا در پروکسی رندر: " + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
