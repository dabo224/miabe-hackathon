export interface RegionData {
  name: string;
  prefectures: string[];
}

export const GUINEA_LOCATIONS: RegionData[] = [
  {
    name: 'BOKÉ',
    prefectures: ['BOFFA', 'BOKÉ', 'FRIA', 'GAOUAL', 'KOUNDARA']
  },
  {
    name: 'CONAKRY',
    prefectures: ['CONAKRY']
  },
  {
    name: 'FARANAH',
    prefectures: ['DABOLA', 'DINGUIRAYE', 'FARANAH', 'KISSIDOUGOU']
  },
  {
    name: 'KANKAN',
    prefectures: ['KANKAN', 'KÉROUANÉ', 'KOUROUSSA', 'MANDIANA', 'SIGUIRI']
  },
  {
    name: 'KINDIA',
    prefectures: ['COYAH', 'DUBRÉKA', 'FORÉCARIAH', 'KINDIA', 'TÉLIMÉLÉ']
  },
  {
    name: 'LABÉ',
    prefectures: ['KOUBIA', 'LABÉ', 'LÉLOUMA', 'MALI', 'TOUGUÉ']
  },
  {
    name: 'MAMOU',
    prefectures: ['DALABA', 'MAMOU', 'PITA']
  },
  {
    name: 'NZÉRÉKORÉ',
    prefectures: ['BEYLA', 'GUÉCKÉDOU', 'LOLA', 'MACENTA', 'NZÉRÉKORÉ', 'YOMOU']
  }
];

export const ALL_REGIONS = GUINEA_LOCATIONS.map(r => r.name);

export const ALL_PREFECTURES = GUINEA_LOCATIONS.flatMap(r => r.prefectures).sort();

export const getPrefecturesByRegion = (regionName: string): string[] => {
  const region = GUINEA_LOCATIONS.find(r => r.name === regionName);
  return region ? region.prefectures : [];
};
