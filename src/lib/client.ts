import got from 'got';
import { TikItem } from '../types/type.js';

export class TikTokService {
  private readonly baseUrl = "https://api22-normal-c-alisg.tiktokv.com";

  private defaultHeaders = {
    "Accept-Encoding": "deflate",
    "User-Agent": "okhttp/3.14.9",
  };

  private async getTikId(url: string): Promise<string | null> {
    const REGEXP = /(?:video|photo|user)\/(\d+)/;
    const valid = url.match(REGEXP);
    if (valid) return valid[1];

    try {
      const resp = await got(url, {
        headers: this.defaultHeaders,
        followRedirect: false,
      }).catch((err) => err.response);

      const body = resp?.body || "";
      const match =
        body.match(REGEXP)?.[1] ||
        resp?.url.match(REGEXP)?.[1] ||
        resp?.headers?.location?.match(REGEXP)?.[1];

      if (!match) {
        throw new Error(body);
      }
      return match;
    } catch (error) {
      console.error("Failed to fetch the TikTok ID:", error);
      return null;
    }
  }

  private device_idGenerator(): string {
    return Array(19)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10))
      .join("");
  }

  /**
   * Fetch TikTok video list
   */
  async fetchTikList(
    url: string
  ): Promise<[TikItem["aweme_id"], TikItem[]] | null> {
    const tikId = await this.getTikId(url);
    if (!tikId) {
      return null;
    }

    try {
      const resp = await got(`${this.baseUrl}/aweme/v1/feed/`, {
        method: "OPTIONS", // wichtig: wie in deinem Beispiel
        headers: this.defaultHeaders,
        searchParams: {
          iid: this.device_idGenerator(),
          device_id: this.device_idGenerator(),
          version_code: "300904",
          aweme_id: tikId,
        },
      });

      const data = JSON.parse(resp.body) as { aweme_list?: TikItem[] };
      if (!data || !data.aweme_list) {
        return null;
      }

      return [tikId, data.aweme_list];
    } catch (err: any) {
      console.error("Failed to fetch TikTok list:", err.message);
      return null;
    }
  }
}
