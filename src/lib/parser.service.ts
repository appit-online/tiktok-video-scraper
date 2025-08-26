import { TikItem } from "../types/type.js";
import { IParsed, ITiktokOptions } from "../types/parsed-types.js";

export function isParsedOptions(
  options?: ITiktokOptions
): options is { parse: true; keys?: [keyof TikItem] } {
  return options?.parse === true;
}

interface IParseOptions {
  keys: (keyof TikItem)[];
}

function filterJpegs(urls: string[] = []): string[] {
  return urls.filter(u => /\.jpe?g/.test(u));
}

function getters<T>(data: any, keys: string[]): T {
  const obj: any = {};
  keys.forEach((key) => {
    const nestedKeys = key.split(".");
    const firstKey = nestedKeys.shift();
    if (firstKey !== undefined) {
      let value = nestedKeys.reduce(
        (acc, nestedKey) => acc?.[nestedKey],
        data[firstKey]
      );

      // Wenn wir auf url_list stoßen, filtere nur JPEGs
      if (nestedKeys[nestedKeys.length - 1] === "url_list" && Array.isArray(value)) {
        value = filterJpegs(value);
      }

      obj[firstKey] = value;
    }
  });
  return obj;
}

export function parseTikTokVideo(
  data: TikItem,
  options?: IParseOptions
): Partial<TikItem> | IParsed {
  const profilePicture =
    data.author?.avatar_medium?.url_list?.[0] ||
    data.author?.avatar_thumb?.url_list?.[0] ||
    "";

  // Music cover_large nur JPEGs
  let musicCover: string[] = [];
  let audioUrl = "";
  if (data.music) {
    audioUrl = data.music?.play_url?.url_list?.[0] || "";
    if (data.music.cover_large?.url_list) {
      musicCover = filterJpegs(data.music.cover_large.url_list);
    }
  }

  const media: any[] = [];

  // Video hinzufügen nur wenn URL existiert, sonst als Image
  const videoUrl = data.video?.download_addr?.url_list?.[0] || "";
  if (videoUrl) {
    media.push({
      id: `${data.aweme_id}`,
      original_width: data.video?.width || 0,
      original_height: data.video?.height || 0,
      caption: data.desc || null,
      thumbnail: filterJpegs(data.video?.cover?.url_list)[0] || "",
      type: "video",
      url: videoUrl,
      mimetype: "video/mp4",
      has_audio: !!audioUrl,
      video_duration: (data.video?.duration || 0) / 1000,
      audio_url: audioUrl,
      wm_url: data.video?.download_addr?.url_list?.[1] || "",
    });
  } else if (data.video && (!data.image_post_info?.images?.length || data.image_post_info.images.length === 0)) {
    media.push({
      id: `${data.aweme_id}`,
      original_width: data.video?.width || 0,
      original_height: data.video?.height || 0,
      caption: data.desc || null,
      thumbnail: filterJpegs(data.video?.cover?.url_list)[0] || "",
      type: "image",
      url: filterJpegs(data.video?.cover?.url_list)[0] || "",
      mimetype: "image/jpeg",
      has_audio: false,
    });
  }

  // Bilder hinzufügen
  media.push(
    ...(data.image_post_info?.images || []).map((img, idx) => ({
      id: `${data.aweme_id}_${idx}`,
      original_width: img.display_image?.width || 0,
      original_height: img.display_image?.height || 0,
      caption: data.desc || null,
      thumbnail: filterJpegs(img.thumbnail?.url_list)[0] || "",
      type: "image",
      url: filterJpegs(img.display_image?.url_list)[0] || "",
      mimetype: "image/jpeg",
      has_audio: false,
    }))
  );

  const parsedData: Record<string, any> = {
    id: data.aweme_id,
    username: data.author?.unique_id || "",
    name: data.author?.nickname || "",
    createdAt: data.create_time,
    profilePicture,
    media,
    music_info: data.music
      ? {
        ...getters(data.music, ["id", "title", "author", "album"]),
        audio_url: audioUrl,
        cover_large: musicCover,
      }
      : undefined,
  };

  // Optional: Nur ausgewählte Keys zurückgeben
  if (options?.keys) {
    const selected: Record<string, any> = { ...parsedData };
    for (const key of options.keys) {
      if (key in data) selected[key] = data[key];
    }
    return selected;
  }

  return parsedData;
}

