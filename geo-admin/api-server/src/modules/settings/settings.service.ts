import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateSettingsDto } from "./dto/update-settings.dto";

type SettingsMap = Record<string, string>;

const defaultSettings: SettingsMap = {
  site_name: "YFYK",
  site_url: "https://www.yfyk.com",
  company_name: "YFYK",
  default_language: "zh-CN",
  logo_url: "",
  crawl_weight: "30",
  understanding_weight: "30",
  structure_weight: "40"
};

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    const map = await this.getSettingsMap();
    return this.toResponse(map);
  }

  async updateSettings(dto: UpdateSettingsDto) {
    const current = await this.getSettingsMap();
    const next: SettingsMap = { ...current };

    this.assign(next, "site_name", dto.siteName);
    this.assign(next, "site_url", dto.siteUrl ? this.normalizeSiteUrl(dto.siteUrl) : undefined);
    this.assign(next, "company_name", dto.companyName);
    this.assign(next, "default_language", dto.defaultLanguage);
    this.assign(next, "logo_url", dto.logoUrl);
    this.assign(next, "crawl_weight", dto.crawlWeight);
    this.assign(next, "understanding_weight", dto.understandingWeight);
    this.assign(next, "structure_weight", dto.structureWeight);

    const weights = this.getScoringWeights(next);
    if (weights.crawlWeight + weights.understandingWeight + weights.structureWeight !== 100) {
      throw new BadRequestException("评分权重总和必须等于100");
    }

    await Promise.all(
      Object.entries(next).map(([key, value]) =>
        this.prisma.setting.upsert({
          where: { key },
          update: { value, group: this.groupForKey(key) },
          create: { key, value, group: this.groupForKey(key) }
        })
      )
    );

    return this.toResponse(next);
  }

  async getSiteUrl() {
    const settings = await this.getSettingsMap();
    return this.normalizeSiteUrl(settings.site_url ?? defaultSettings.site_url);
  }

  async getScoringWeightsFromSettings() {
    return this.getScoringWeights(await this.getSettingsMap());
  }

  async getSettingsMap() {
    const rows = await this.prisma.setting.findMany();
    return rows.reduce<SettingsMap>((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, { ...defaultSettings });
  }

  private toResponse(map: SettingsMap) {
    return {
      website: {
        siteName: map.site_name,
        siteUrl: map.site_url,
        companyName: map.company_name,
        defaultLanguage: map.default_language,
        logoUrl: map.logo_url
      },
      scoring: this.getScoringWeights(map)
    };
  }

  private getScoringWeights(map: SettingsMap) {
    return {
      crawlWeight: Number(map.crawl_weight ?? 30),
      understandingWeight: Number(map.understanding_weight ?? 30),
      structureWeight: Number(map.structure_weight ?? 40)
    };
  }

  private assign(map: SettingsMap, key: string, value?: string | number) {
    if (value === undefined) return;
    map[key] = String(value);
  }

  private groupForKey(key: string) {
    return key.endsWith("_weight") ? "scoring" : "website";
  }

  private normalizeSiteUrl(value: string) {
    return value.trim().replace(/\/$/, "");
  }
}
