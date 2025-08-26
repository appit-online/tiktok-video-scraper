# [tiktok-video-scraper: Node.js](https://github.com/appit-online/tiktok-video-scraper)

A lightweight library to **search TikTok videos, fetch user details, and download media**, built for Node.js environments using modern HTTP clients.

---
## 🚀 Features

- 🔍 Extract TikTok IDs from shared URLs (with redirect handling)
- 🎵 Fetch music info including audio URL and cover images
- 📥 Get direct download URLs for TikTok videos (with and without watermark)
- 🖼️ Fetch images / photo posts from TikTok
- ⚡ Works in Node.js
- 🛠️ Returns media in structured format
---

**Table of contents:**

* [Quickstart](#quickstart)
  * [Installing the library](#installation)
  * [Using the library](#using-the-library)
* [License](#license)

---

## Quickstart

### 📦 Installation

```bash
npm install tiktok-video-scraper --save
```

### Using the library
```
import Tiktok from 'tiktok-video-scraper;

const tiktokUrl = 'https://vm.tiktok.com/ZNHChcc/';

try {
  const result = await Tiktok(tiktokUrl, {
      parse: true,
  })
 console.log(result);
} catch (err) {
  if (err.status === 429){
    // handle rate limit issue
  }
  console.error('Error fetching TikTok video:', err);
}

{
  "id": "7540333526",
  "username": "perninsenn",
  "name": "pni",
  "createdAt": 1755622934,
  "profilePicture": "https://p16-sign-va.tiktokcdn.com/tos-3a6be05f1d551aa1~tplv-tiktokx-cropcenter:720:720.webp",
  "media": [
    {
      "id": "75403108533526",
      "original_width": 1080,
      "original_height": 1920,
      "caption": "#clash #clashroyale #fyp",
      "thumbnail": "https://p16-pu-sign-no.tiktokcdn-eu.com/...jpeg",
      "type": "video",
      "url": "https://v16m-default.tiktokcdn.com/...video.mp4",
      "mimetype": "video/mp4",
      "has_audio": true,
      "video_duration": 8.08,
      "audio_url": "https://sf77-ies-music-va.tiktokcdn.com/...mp3",
      "wm_url": "https://v16m.byteicdn.com/...video.mp4"
    }
  ],
  "music_info": {
    "id": 70216776000,
    "title": "Clash royale opening music",
    "author": "dathan",
    "album": "",
    "audio_url": "https://sf77-ies-music-va.tiktokcdn.com/...mp3",
    "cover_large": [
      "https://p16-sign-va.tiktokcdn.com/...jpeg"
    ]
  }
}
```

### Additional Response Fields
You can fetch only specific fields from the TikTok video by passing a `keys` array while keeping parsing enabled (`parse: true`

``` javascript
import Tiktok from 'tiktok-video-scraper';

const tiktokUrl = 'https://www.tiktok.com/@shot/video/7539590113288?_r=1&_t=ZN-8z8m3Qj3X5a';

try {
  const result = await Tiktok(tiktokUrl, {
    parse: true,
    keys: ['desc', 'duration', 'author']
  })
  console.log(result);
} catch (err) {
  if (e.status === 429){
    // handle rate limit issue
  }
  console.error('Error fetching TikTok video:', err);
}
```

### Raw TikTok API data without parsing
``` javascript
import Tiktok from 'tiktok-video-scraper';

const tiktokUrl = 'https://vm.tiktok.com/ZN2hcc/';

try {
  const result = await Tiktok(tiktokUrl, {
      parse: false
  })
 console.log(result);
} catch (err) {
  if (e.status === 429){
    // handle rate limit issue
  }
  console.error('Error fetching TikTok video:', err);
}
```

## License

Apache Version 2.0

See [LICENSE](https://github.com/appit-online/tiktok-video-scraper/blob/master/LICENSE)
