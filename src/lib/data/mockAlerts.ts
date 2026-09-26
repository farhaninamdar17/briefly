import { OfficialAlertDTO } from "../dal/dto";

export const MOCK_ALERTS: OfficialAlertDTO[] = [
  {
    id: "alt_pune_imd_01",
    authority: "NDMA SACHET & IMD Pune Regional Meteorological Centre",
    event: "Heavy Rainfall & Ghat Flash Flood Advisory (Orange Alert)",
    severity: "IMPORTANT",
    area: "Pune District (Lonavala, Mulshi, Bhor, Velhe Ghats) & Pimpri-Chinchwad",
    timestamp: "2026-09-26T04:30:00.000Z",
    expiresAt: "2026-09-27T18:00:00.000Z",
    instructions: "Avoid non-essential travel in ghat areas and near Mutha/Mula riverbeds. Keep emergency kits ready, unplug outdoor electrical appliances, and monitor official disaster management helpline 1077.",
    originalUrl: "https://sachet.ndma.gov.in/alerts/pune-orange-20260926",
    verified: true,
    sourceType: "NDMA_SACHET",
  },
  {
    id: "alt_maha_expressway_02",
    authority: "Maharashtra State Road Development Corporation (MSRDC)",
    event: "Ghat Section Debris Mitigation & Single-Lane Transit Advisory",
    severity: "IMPORTANT",
    area: "Mumbai-Pune Expressway (Borghat Section, Km 41 to Km 44)",
    timestamp: "2026-09-26T06:00:00.000Z",
    expiresAt: "2026-09-26T22:00:00.000Z",
    instructions: "Precautionary rockfall netting maintenance underway between Khandala and Khopoli exits. Speed restricted to 40 km/h. Expect 15-20 min delays during daytime hours.",
    originalUrl: "https://msrdc.in/traffic-bulletin/mumbai-pune-expressway-advisory",
    verified: true,
    sourceType: "GOV_CIVIL",
  },
];
