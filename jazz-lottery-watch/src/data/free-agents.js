// Complete 2026 NBA free agent list
// Sources: Spotrac, Hoops Rumors, Basketball-Reference
// yearsExp = years of NBA experience entering 2026-27
// stats = 2024-25 regular season averages (ppg, rpg, apg, tpPct)

const FREE_AGENTS = [
  // ──────────────────────────────────────────────
  // UNRESTRICTED FREE AGENTS (UFA)
  // ──────────────────────────────────────────────

  // Point Guards
  { name: 'Cole Anthony',       espnId: '4432809', position: 'PG',   age: 26, team: 'ORL', type: 'UFA', estimatedSalary: 10_000_000, yearsExp: 6,  stats: { ppg: 12.2, rpg: 4.5, apg: 3.8, tpPct: 33.0 } },
  { name: 'Jevon Carter',       espnId: '3133635', position: 'PG',   age: 31, team: 'CHI', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 8,  stats: { ppg: 5.5, rpg: 2.0, apg: 1.5, tpPct: 37.2 } },
  { name: 'Mike Conley',        espnId: '3195', position: 'PG',   age: 39, team: 'MIN', type: 'UFA', estimatedSalary: 5_000_000,  yearsExp: 19, stats: { ppg: 7.6, rpg: 2.5, apg: 4.4, tpPct: 38.1 } },
  { name: 'Collin Gillespie',   espnId: '4278585', position: 'PG',   age: 26, team: 'DEN', type: 'UFA', estimatedSalary: 2_500_000,  yearsExp: 4,  stats: { ppg: 3.1, rpg: 1.0, apg: 1.2, tpPct: 35.4 } },
  { name: 'Jordan Goodwin',     espnId: '4278402', position: 'PG',   age: 28, team: 'PHX', type: 'UFA', estimatedSalary: 2_500_000,  yearsExp: 4,  stats: { ppg: 5.0, rpg: 3.0, apg: 1.5, tpPct: 32.1 } },
  { name: 'Aaron Holiday',      espnId: '3922230', position: 'PG',   age: 30, team: 'HOU', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 8,  stats: { ppg: 5.6, rpg: 1.5, apg: 2.0, tpPct: 35.8 } },
  { name: 'Tyus Jones',         espnId: '3135046', position: 'PG',   age: 30, team: 'PHX', type: 'UFA', estimatedSalary: 12_000_000, yearsExp: 11, stats: { ppg: 12.0, rpg: 2.8, apg: 7.1, tpPct: 40.3 } },
  { name: 'Kyle Lowry',         espnId: '3012', position: 'PG',   age: 40, team: 'PHI', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 20, stats: { ppg: 5.0, rpg: 2.8, apg: 3.6, tpPct: 34.7 } },
  { name: 'Jordan McLaughlin',  espnId: '3134916', position: 'PG',   age: 30, team: 'MIN', type: 'UFA', estimatedSalary: 2_500_000,  yearsExp: 7,  stats: { ppg: 3.8, rpg: 1.4, apg: 2.8, tpPct: 33.3 } },
  { name: 'Cameron Payne',      espnId: '3064230', position: 'PG',   age: 32, team: 'NYK', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 11, stats: { ppg: 6.2, rpg: 1.8, apg: 2.6, tpPct: 35.0 } },
  { name: 'Terry Rozier',       espnId: '3074752', position: 'PG',   age: 32, team: 'MIA', type: 'UFA', estimatedSalary: 12_000_000, yearsExp: 11, stats: { ppg: 16.4, rpg: 4.0, apg: 4.6, tpPct: 36.5 } },
  { name: 'Gabe Vincent',       espnId: '3137259', position: 'PG',   age: 30, team: 'LAL', type: 'UFA', estimatedSalary: 5_000_000,  yearsExp: 5,  stats: { ppg: 6.0, rpg: 2.0, apg: 2.4, tpPct: 35.5 } },
  { name: 'Russell Westbrook',  espnId: '3468', position: 'PG',   age: 38, team: 'DEN', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 18, stats: { ppg: 10.2, rpg: 5.0, apg: 6.8, tpPct: 27.5 } },
  { name: 'Jordan Clarkson',    espnId: '2528426', position: 'SG/PG', age: 34, team: 'UTA', type: 'UFA', estimatedSalary: 8_000_000,  yearsExp: 12, stats: { ppg: 15.7, rpg: 2.9, apg: 3.5, tpPct: 35.8 } },
  { name: 'Coby White',         espnId: '4395651', position: 'PG',   age: 26, team: 'CHI', type: 'UFA', estimatedSalary: 20_000_000, yearsExp: 7,  stats: { ppg: 18.2, rpg: 3.8, apg: 5.4, tpPct: 37.4 } },
  { name: 'Brandon Williams',   espnId: '4397040', position: 'PG',   age: 27, team: 'POR', type: 'UFA', estimatedSalary: 2_500_000,  yearsExp: 5,  stats: { ppg: 3.2, rpg: 1.3, apg: 1.6, tpPct: 30.0 } },

  // Shooting Guards
  { name: 'Bruce Brown',        espnId: '4065670', position: 'SG',   age: 30, team: 'IND', type: 'UFA', estimatedSalary: 8_000_000,  yearsExp: 8,  stats: { ppg: 8.6, rpg: 4.2, apg: 2.4, tpPct: 33.0 } },
  { name: 'Seth Curry',         espnId: '2326307', position: 'SG',   age: 36, team: 'CHA', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 13, stats: { ppg: 7.1, rpg: 1.5, apg: 1.6, tpPct: 42.4 } },
  { name: 'Ayo Dosunmu',        espnId: '4397002', position: 'SG',   age: 26, team: 'CHI', type: 'UFA', estimatedSalary: 8_000_000,  yearsExp: 5,  stats: { ppg: 9.0, rpg: 3.4, apg: 4.1, tpPct: 36.0 } },
  { name: 'Keon Ellis',         espnId: '4702177', position: 'SG',   age: 26, team: 'SAC', type: 'UFA', estimatedSalary: 4_000_000,  yearsExp: 4,  stats: { ppg: 6.4, rpg: 2.6, apg: 1.4, tpPct: 37.1 } },
  { name: 'Quentin Grimes',     espnId: '4397014', position: 'SG',   age: 26, team: 'DAL', type: 'UFA', estimatedSalary: 6_000_000,  yearsExp: 5,  stats: { ppg: 10.2, rpg: 3.0, apg: 2.0, tpPct: 37.5 } },
  { name: 'Kevin Huerter',      espnId: '4066372', position: 'SG',   age: 28, team: 'SAC', type: 'UFA', estimatedSalary: 8_000_000,  yearsExp: 8,  stats: { ppg: 11.2, rpg: 3.1, apg: 2.5, tpPct: 38.0 } },
  { name: 'Bones Hyland',       espnId: '4592492', position: 'SG',   age: 26, team: 'LAC', type: 'UFA', estimatedSalary: 5_000_000,  yearsExp: 5,  stats: { ppg: 10.0, rpg: 2.4, apg: 3.0, tpPct: 34.2 } },
  { name: 'Luke Kennard',       espnId: '3913174', position: 'SG',   age: 30, team: 'MEM', type: 'UFA', estimatedSalary: 5_000_000,  yearsExp: 9,  stats: { ppg: 8.2, rpg: 2.4, apg: 2.3, tpPct: 44.1 } },
  { name: 'CJ McCollum',        espnId: '2490149', position: 'SG',   age: 35, team: 'NOP', type: 'UFA', estimatedSalary: 13_000_000, yearsExp: 13, stats: { ppg: 18.5, rpg: 3.4, apg: 3.8, tpPct: 38.2 } },
  { name: 'Josh Okogie',        espnId: '4065663', position: 'SG',   age: 28, team: 'PHX', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 8,  stats: { ppg: 5.2, rpg: 3.0, apg: 1.0, tpPct: 30.5 } },
  { name: 'Gary Payton II',     espnId: '3134903', position: 'SG',   age: 34, team: 'GSW', type: 'UFA', estimatedSalary: 5_000_000,  yearsExp: 10, stats: { ppg: 6.2, rpg: 3.0, apg: 1.5, tpPct: 35.0 } },
  { name: 'Norman Powell',      espnId: '2595516', position: 'SG',   age: 33, team: 'LAC', type: 'UFA', estimatedSalary: 22_000_000, yearsExp: 11, stats: { ppg: 23.2, rpg: 3.4, apg: 2.6, tpPct: 42.1 } },
  { name: 'Collin Sexton',      espnId: '4277811', position: 'SG',   age: 28, team: 'UTA', type: 'UFA', estimatedSalary: 8_000_000,  yearsExp: 8,  stats: { ppg: 16.0, rpg: 3.0, apg: 3.4, tpPct: 37.0 } },
  { name: 'Landry Shamet',      espnId: '3914044', position: 'SG',   age: 29, team: 'NYK', type: 'UFA', estimatedSalary: 4_000_000,  yearsExp: 8,  stats: { ppg: 7.0, rpg: 1.8, apg: 1.8, tpPct: 38.5 } },
  { name: 'Anfernee Simons',    espnId: '4351851', position: 'SG',   age: 27, team: 'POR', type: 'UFA', estimatedSalary: 27_000_000, yearsExp: 8,  stats: { ppg: 22.4, rpg: 3.0, apg: 5.0, tpPct: 37.0 } },
  { name: 'Cam Thomas',         espnId: '4432174', position: 'SG',   age: 25, team: 'BKN', type: 'UFA', estimatedSalary: 22_000_000, yearsExp: 5,  stats: { ppg: 24.7, rpg: 3.5, apg: 4.3, tpPct: 35.4 } },
  { name: 'Matisse Thybulle',   espnId: '3907498', position: 'SG',   age: 29, team: 'POR', type: 'UFA', estimatedSalary: 4_000_000,  yearsExp: 7,  stats: { ppg: 4.0, rpg: 2.0, apg: 0.8, tpPct: 30.2 } },
  { name: 'Lindy Waters III',   espnId: '4066317', position: 'SG',   age: 29, team: 'OKC', type: 'UFA', estimatedSalary: 2_500_000,  yearsExp: 5,  stats: { ppg: 4.5, rpg: 1.8, apg: 0.8, tpPct: 38.0 } },
  { name: 'Blake Wesley',       espnId: '4683935', position: 'SG',   age: 23, team: 'SAS', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 4,  stats: { ppg: 5.0, rpg: 2.0, apg: 2.0, tpPct: 30.0 } },

  // Small Forwards
  { name: 'Amir Coffey',        espnId: '4066387', position: 'SF',   age: 29, team: 'LAC', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 7,  stats: { ppg: 6.0, rpg: 2.4, apg: 1.4, tpPct: 35.2 } },
  { name: 'Simone Fontecchio',  espnId: '3899664', position: 'SF',   age: 31, team: 'DET', type: 'UFA', estimatedSalary: 4_000_000,  yearsExp: 4,  stats: { ppg: 8.6, rpg: 3.0, apg: 1.0, tpPct: 38.0 } },
  { name: 'Javonte Green',      espnId: '2596112', position: 'SF',   age: 33, team: 'CHI', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 7,  stats: { ppg: 5.0, rpg: 3.0, apg: 0.8, tpPct: 32.0 } },
  { name: 'Tim Hardaway Jr.',   espnId: '2528210', position: 'SF',   age: 34, team: 'DET', type: 'UFA', estimatedSalary: 5_000_000,  yearsExp: 13, stats: { ppg: 10.4, rpg: 2.5, apg: 1.5, tpPct: 36.0 } },
  { name: 'Caleb Houstan',      espnId: '4433623', position: 'SF',   age: 23, team: 'CLE', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 4,  stats: { ppg: 5.2, rpg: 2.0, apg: 0.8, tpPct: 37.5 } },
  { name: 'Jett Howard',        espnId: '5105806', position: 'SF',   age: 23, team: 'DET', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 3,  stats: { ppg: 5.5, rpg: 2.0, apg: 1.4, tpPct: 33.5 } },
  { name: 'LeBron James',       espnId: '1966', position: 'SF',   age: 42, team: 'LAL', type: 'UFA', estimatedSalary: 30_000_000, yearsExp: 23, stats: { ppg: 23.5, rpg: 7.5, apg: 9.0, tpPct: 33.0 } },
  { name: 'Doug McDermott',     espnId: '2528588', position: 'SF',   age: 34, team: 'SAS', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 12, stats: { ppg: 5.2, rpg: 2.0, apg: 0.8, tpPct: 40.0 } },
  { name: 'Khris Middleton',    espnId: '6609', position: 'SF',   age: 35, team: 'MIL', type: 'UFA', estimatedSalary: 10_000_000, yearsExp: 14, stats: { ppg: 12.1, rpg: 4.5, apg: 5.0, tpPct: 36.4 } },
  { name: 'Kelly Oubre Jr.',    espnId: '3133603', position: 'SF',   age: 31, team: 'PHI', type: 'UFA', estimatedSalary: 10_000_000, yearsExp: 11, stats: { ppg: 14.0, rpg: 5.0, apg: 2.0, tpPct: 34.0 } },
  { name: "Jae'Sean Tate",      espnId: '3136777', position: 'SF',   age: 31, team: 'HOU', type: 'UFA', estimatedSalary: 4_000_000,  yearsExp: 6,  stats: { ppg: 6.0, rpg: 3.5, apg: 1.4, tpPct: 33.0 } },

  // Power Forwards
  { name: 'Precious Achiuwa',   espnId: '4431679', position: 'PF',   age: 27, team: 'NYK', type: 'UFA', estimatedSalary: 6_000_000,  yearsExp: 6,  stats: { ppg: 7.6, rpg: 6.2, apg: 1.0, tpPct: 30.0 } },
  { name: 'Harrison Barnes',    espnId: '6578', position: 'PF',   age: 34, team: 'PHX', type: 'UFA', estimatedSalary: 12_000_000, yearsExp: 14, stats: { ppg: 11.0, rpg: 4.4, apg: 2.0, tpPct: 37.0 } },
  { name: 'Kobe Brown',         espnId: '4431752', position: 'PF',   age: 26, team: 'LAC', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 3,  stats: { ppg: 5.0, rpg: 3.2, apg: 1.0, tpPct: 33.0 } },
  { name: 'John Collins',       espnId: '3908845', position: 'PF',   age: 29, team: 'ATL', type: 'UFA', estimatedSalary: 17_000_000, yearsExp: 9,  stats: { ppg: 17.0, rpg: 7.5, apg: 2.4, tpPct: 35.5 } },
  { name: 'Jeff Green',         espnId: '3209', position: 'PF',   age: 40, team: 'HOU', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 19, stats: { ppg: 4.2, rpg: 2.5, apg: 0.6, tpPct: 32.0 } },
  { name: 'Rui Hachimura',      espnId: '4066648', position: 'PF',   age: 28, team: 'LAL', type: 'UFA', estimatedSalary: 16_000_000, yearsExp: 7,  stats: { ppg: 13.2, rpg: 5.0, apg: 1.5, tpPct: 35.0 } },
  { name: 'Tobias Harris',      espnId: '6440', position: 'PF',   age: 34, team: 'DET', type: 'UFA', estimatedSalary: 12_000_000, yearsExp: 15, stats: { ppg: 11.0, rpg: 5.5, apg: 2.4, tpPct: 36.0 } },
  { name: 'Maxi Kleber',        espnId: '2960236', position: 'PF',   age: 34, team: 'DAL', type: 'UFA', estimatedSalary: 5_000_000,  yearsExp: 9,  stats: { ppg: 5.2, rpg: 4.0, apg: 1.0, tpPct: 35.0 } },
  { name: 'Trey Lyles',         espnId: '3136196', position: 'PF',   age: 31, team: 'SAC', type: 'UFA', estimatedSalary: 4_000_000,  yearsExp: 11, stats: { ppg: 8.0, rpg: 5.0, apg: 1.4, tpPct: 36.2 } },
  { name: 'Larry Nance Jr.',    espnId: '2580365', position: 'PF',   age: 33, team: 'ATL', type: 'UFA', estimatedSalary: 5_000_000,  yearsExp: 11, stats: { ppg: 8.2, rpg: 5.5, apg: 2.0, tpPct: 35.0 } },
  { name: 'Jeremy Sochan',      espnId: '4610139', position: 'PF',   age: 23, team: 'SAS', type: 'UFA', estimatedSalary: 15_000_000, yearsExp: 4,  stats: { ppg: 14.5, rpg: 7.0, apg: 3.4, tpPct: 32.0 } },
  { name: 'Dean Wade',          espnId: '3912848', position: 'PF',   age: 30, team: 'CLE', type: 'UFA', estimatedSalary: 4_000_000,  yearsExp: 7,  stats: { ppg: 6.5, rpg: 3.5, apg: 1.4, tpPct: 37.0 } },
  { name: 'Guerschon Yabusele', espnId: '4017844', position: 'PF',   age: 31, team: 'PHI', type: 'UFA', estimatedSalary: 8_000_000,  yearsExp: 9,  stats: { ppg: 9.0, rpg: 5.2, apg: 1.5, tpPct: 35.5 } },
  { name: 'Kevin Love',         espnId: '3449', position: 'PF',   age: 39, team: 'UTA', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 18, stats: { ppg: 4.0, rpg: 3.5, apg: 1.4, tpPct: 35.0 } },

  // Centers
  { name: 'Marvin Bagley III',  espnId: '4277848', position: 'C',    age: 27, team: 'WAS', type: 'UFA', estimatedSalary: 4_000_000,  yearsExp: 8,  stats: { ppg: 7.0, rpg: 5.0, apg: 1.0, tpPct: 28.0 } },
  { name: 'Bismack Biyombo',    espnId: '6427', position: 'C',    age: 34, team: '-',   type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 15 },
  { name: 'Thomas Bryant',      espnId: '3934723', position: 'C',    age: 29, team: 'IND', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 9,  stats: { ppg: 6.2, rpg: 4.0, apg: 0.8, tpPct: 30.0 } },
  { name: 'Zach Collins',       espnId: '4066650', position: 'C',    age: 29, team: 'SAS', type: 'UFA', estimatedSalary: 5_000_000,  yearsExp: 9,  stats: { ppg: 8.0, rpg: 5.5, apg: 2.4, tpPct: 34.0 } },
  { name: 'Andre Drummond',     espnId: '6585', position: 'C',    age: 33, team: 'PHI', type: 'UFA', estimatedSalary: 4_000_000,  yearsExp: 14, stats: { ppg: 6.0, rpg: 8.4, apg: 1.0, tpPct: null } },
  { name: 'Drew Eubanks',       espnId: '3914285', position: 'C',    age: 29, team: 'PHX', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 8,  stats: { ppg: 5.5, rpg: 4.0, apg: 0.8, tpPct: null } },
  { name: 'Jaxson Hayes',       espnId: '4397077', position: 'C',    age: 26, team: 'LAL', type: 'UFA', estimatedSalary: 4_000_000,  yearsExp: 7,  stats: { ppg: 5.6, rpg: 3.5, apg: 0.5, tpPct: null } },
  { name: 'DeAndre Jordan',     espnId: '3442', position: 'C',    age: 38, team: 'DEN', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 18, stats: { ppg: 3.0, rpg: 5.0, apg: 0.5, tpPct: null } },
  { name: 'Jock Landale',       espnId: '3146557', position: 'C',    age: 31, team: 'HOU', type: 'UFA', estimatedSalary: 4_000_000,  yearsExp: 5,  stats: { ppg: 7.2, rpg: 4.2, apg: 1.5, tpPct: 36.0 } },
  { name: 'Kelly Olynyk',       espnId: '2489663', position: 'C',    age: 35, team: 'TOR', type: 'UFA', estimatedSalary: 6_000_000,  yearsExp: 13, stats: { ppg: 8.0, rpg: 5.0, apg: 2.5, tpPct: 37.0 } },
  { name: 'Kristaps Porzingis', espnId: '3102531', position: 'C',    age: 31, team: 'BOS', type: 'UFA', estimatedSalary: 32_000_000, yearsExp: 11, stats: { ppg: 18.0, rpg: 6.5, apg: 1.6, tpPct: 37.2 } },
  { name: 'Dwight Powell',      espnId: '2531367', position: 'C',    age: 35, team: 'DAL', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 12, stats: { ppg: 4.0, rpg: 3.5, apg: 0.5, tpPct: null } },
  { name: 'Nick Richards',      espnId: '4278076', position: 'C',    age: 29, team: 'CHA', type: 'UFA', estimatedSalary: 5_000_000,  yearsExp: 6,  stats: { ppg: 9.0, rpg: 8.0, apg: 0.6, tpPct: null } },
  { name: 'Mitchell Robinson',  espnId: '4351852', position: 'C',    age: 28, team: 'NYK', type: 'UFA', estimatedSalary: 8_000_000,  yearsExp: 8,  stats: { ppg: 5.0, rpg: 7.0, apg: 0.5, tpPct: null } },
  { name: 'Xavier Tillman',     espnId: '4277964', position: 'C',    age: 27, team: 'BOS', type: 'UFA', estimatedSalary: 3_000_000,  yearsExp: 6,  stats: { ppg: 3.6, rpg: 2.5, apg: 1.0, tpPct: 32.0 } },
  { name: 'Nikola Vucevic',     espnId: '6478', position: 'C',    age: 36, team: 'CHI', type: 'UFA', estimatedSalary: 12_000_000, yearsExp: 15, stats: { ppg: 18.0, rpg: 10.3, apg: 3.2, tpPct: 37.0 } },
  { name: 'Moritz Wagner',      espnId: '3150844', position: 'C',    age: 29, team: 'ORL', type: 'UFA', estimatedSalary: 5_000_000,  yearsExp: 8,  stats: { ppg: 10.0, rpg: 4.5, apg: 2.0, tpPct: 34.0 } },
  { name: 'Robert Williams III',espnId: '4066211', position: 'C',    age: 29, team: 'POR', type: 'UFA', estimatedSalary: 8_000_000,  yearsExp: 8,  stats: { ppg: 5.0, rpg: 5.2, apg: 1.0, tpPct: null } },
  { name: 'Jusuf Nurkic',      espnId: '3102530', position: 'C',    age: 30, team: 'UTA', type: 'UFA', estimatedSalary: 8_000_000,  yearsExp: 12, stats: { ppg: 9.0, rpg: 8.6, apg: 2.4, tpPct: 28.0 } },
  { name: 'Mo Bamba',           espnId: '4277919', position: 'C',    age: 28, team: 'UTA', type: 'UFA', estimatedSalary: 5_000_000,  yearsExp: 8,  stats: { ppg: 4.5, rpg: 4.2, apg: 0.5, tpPct: 30.0 } },

  // ──────────────────────────────────────────────
  // RESTRICTED FREE AGENTS (RFA)
  // ──────────────────────────────────────────────
  { name: 'Ochai Agbaji',       espnId: '4397018', position: 'SG',   age: 26, team: 'TOR', type: 'RFA', estimatedSalary: 6_000_000,  yearsExp: 4,  stats: { ppg: 8.0, rpg: 3.0, apg: 1.4, tpPct: 37.0 } },
  { name: 'Jaylen Clark',       espnId: '4432247', position: 'SG',   age: 25, team: 'LAL', type: 'RFA', estimatedSalary: 3_000_000,  yearsExp: 3,  stats: { ppg: 3.0, rpg: 1.5, apg: 0.5, tpPct: 30.0 } },
  { name: 'Dyson Daniels',      espnId: '4869342', position: 'SG',   age: 23, team: 'ATL', type: 'RFA', estimatedSalary: 12_000_000, yearsExp: 4,  stats: { ppg: 13.4, rpg: 4.5, apg: 3.6, tpPct: 34.0 } },
  { name: 'Mohamed Diawara',    espnId: '5289900', position: 'SF',   age: 21, team: '-',   type: 'RFA', estimatedSalary: 3_000_000,  yearsExp: 1 },
  { name: 'Ousmane Dieng',      espnId: '4997526', position: 'SF',   age: 23, team: 'OKC', type: 'RFA', estimatedSalary: 4_000_000,  yearsExp: 4,  stats: { ppg: 5.0, rpg: 2.5, apg: 1.0, tpPct: 30.0 } },
  { name: 'Jalen Duren',        espnId: '4433621', position: 'C',    age: 23, team: 'DET', type: 'RFA', estimatedSalary: 22_000_000, yearsExp: 4,  stats: { ppg: 14.0, rpg: 10.5, apg: 2.0, tpPct: null } },
  { name: 'Tari Eason',         espnId: '4433192', position: 'PF',   age: 25, team: 'HOU', type: 'RFA', estimatedSalary: 12_000_000, yearsExp: 4,  stats: { ppg: 10.0, rpg: 5.5, apg: 1.4, tpPct: 33.0 } },
  { name: 'Ariel Hukporti',     espnId: '4871141', position: 'C',    age: 24, team: 'NYK', type: 'RFA', estimatedSalary: 3_000_000,  yearsExp: 2,  stats: { ppg: 3.5, rpg: 3.6, apg: 0.4, tpPct: null } },
  { name: 'Jaden Ivey',         espnId: '4433218', position: 'SG',   age: 24, team: 'DET', type: 'RFA', estimatedSalary: 14_000_000, yearsExp: 4,  stats: { ppg: 16.6, rpg: 4.0, apg: 5.2, tpPct: 33.0 } },
  { name: 'Keshad Johnson',     espnId: '4431786', position: 'SG',   age: 25, team: 'SAS', type: 'RFA', estimatedSalary: 3_000_000,  yearsExp: 2,  stats: { ppg: 3.0, rpg: 2.5, apg: 0.5, tpPct: 30.0 } },
  { name: 'Spencer Jones',      espnId: '4592427', position: 'SF',   age: 25, team: 'IND', type: 'RFA', estimatedSalary: 3_000_000,  yearsExp: 2,  stats: { ppg: 4.0, rpg: 2.0, apg: 0.8, tpPct: 35.0 } },
  { name: 'Bennedict Mathurin', espnId: '4683634', position: 'SG',   age: 24, team: 'IND', type: 'RFA', estimatedSalary: 14_000_000, yearsExp: 4,  stats: { ppg: 16.5, rpg: 4.0, apg: 2.0, tpPct: 36.4 } },
  { name: 'Keegan Murray',      espnId: '4594327', position: 'SF',   age: 26, team: 'SAC', type: 'RFA', estimatedSalary: 20_000_000, yearsExp: 4,  stats: { ppg: 15.5, rpg: 5.2, apg: 2.0, tpPct: 37.0 } },
  { name: 'Quinten Post',       espnId: '4593016', position: 'C',    age: 26, team: 'GSW', type: 'RFA', estimatedSalary: 3_000_000,  yearsExp: 2,  stats: { ppg: 4.5, rpg: 3.0, apg: 1.0, tpPct: 35.0 } },
  { name: 'Gui Santos',         espnId: '4997536', position: 'SF',   age: 24, team: 'GSW', type: 'RFA', estimatedSalary: 4_000_000,  yearsExp: 3,  stats: { ppg: 4.0, rpg: 2.4, apg: 1.0, tpPct: 34.0 } },
  { name: 'Shaedon Sharpe',     espnId: '4914336', position: 'SG',   age: 22, team: 'POR', type: 'RFA', estimatedSalary: 20_000_000, yearsExp: 4,  stats: { ppg: 17.0, rpg: 4.0, apg: 3.0, tpPct: 35.0 } },
  { name: 'Christian Braun',    espnId: '4431767', position: 'SG',   age: 24, team: 'DEN', type: 'RFA', estimatedSalary: 20_000_000, yearsExp: 4,  stats: { ppg: 16.5, rpg: 5.5, apg: 4.5, tpPct: 37.0 } },
  { name: 'Peyton Watson',      espnId: '4576087', position: 'SF',   age: 24, team: 'DEN', type: 'RFA', estimatedSalary: 14_000_000, yearsExp: 4,  stats: { ppg: 8.5, rpg: 4.0, apg: 1.5, tpPct: 33.0 } },
  { name: 'Mark Williams',      espnId: '4701232', position: 'C',    age: 25, team: 'CHA', type: 'RFA', estimatedSalary: 14_000_000, yearsExp: 4,  stats: { ppg: 12.0, rpg: 8.0, apg: 1.0, tpPct: null } },
  { name: 'Vince Williams Jr.', espnId: '4397227', position: 'SG/SF', age: 26, team: 'UTA', type: 'RFA', estimatedSalary: 3_000_000,  yearsExp: 4,  stats: { ppg: 5.8, rpg: 2.5, apg: 1.0, tpPct: 35.0 } },
  { name: 'Jalen Wilson',       espnId: '4431714', position: 'SF',   age: 26, team: 'BKN', type: 'RFA', estimatedSalary: 5_000_000,  yearsExp: 3,  stats: { ppg: 8.0, rpg: 4.0, apg: 2.0, tpPct: 33.0 } },

  // ──────────────────────────────────────────────
  // PLAYER OPTIONS (PO) — stars who may opt out
  // ──────────────────────────────────────────────
  { name: 'Jose Alvarado',      espnId: '4277869', position: 'PG',   age: 28, team: 'NYK', type: 'PO',  estimatedSalary: 4_500_000,  optionValue: 4_500_000,  yearsExp: 5,  stats: { ppg: 7.0, rpg: 2.4, apg: 3.5, tpPct: 35.0 } },
  { name: 'James Harden',       espnId: '3992', position: 'PG',   age: 37, team: 'CLE', type: 'PO',  estimatedSalary: 42_300_000, optionValue: 42_317_307, yearsExp: 17, stats: { ppg: 21.0, rpg: 5.5, apg: 8.5, tpPct: 35.2 } },
  { name: "D'Angelo Russell",   espnId: '3136776', position: 'PG',   age: 30, team: 'WAS', type: 'PO',  estimatedSalary: 6_000_000,  optionValue: 5_969_250,  yearsExp: 11, stats: { ppg: 13.0, rpg: 3.0, apg: 6.0, tpPct: 37.0 } },
  { name: 'Marcus Smart',       espnId: '2990992', position: 'PG',   age: 32, team: 'LAL', type: 'PO',  estimatedSalary: 5_400_000,  optionValue: 5_390_700,  yearsExp: 12, stats: { ppg: 8.0, rpg: 3.4, apg: 5.0, tpPct: 33.0 } },
  { name: 'Fred VanVleet',      espnId: '2991230', position: 'PG',   age: 32, team: 'HOU', type: 'PO',  estimatedSalary: 25_000_000, optionValue: 25_000_000, yearsExp: 10, stats: { ppg: 15.0, rpg: 3.6, apg: 6.5, tpPct: 37.0 } },
  { name: 'Trae Young',         espnId: '4277905', position: 'PG',   age: 28, team: 'WAS', type: 'PO',  estimatedSalary: 49_000_000, optionValue: 48_967_380, yearsExp: 8,  stats: { ppg: 24.3, rpg: 3.5, apg: 11.0, tpPct: 34.0 } },
  { name: 'Bradley Beal',       espnId: '6580', position: 'SG',   age: 33, team: 'LAC', type: 'PO',  estimatedSalary: 5_600_000,  optionValue: 5_621_700,  yearsExp: 14, stats: { ppg: 17.0, rpg: 4.0, apg: 4.5, tpPct: 35.5 } },
  { name: 'Kentavious Caldwell-Pope', espnId: '2581018', position: 'SG', age: 33, team: 'MEM', type: 'PO', estimatedSalary: 21_600_000, optionValue: 21_621_500, yearsExp: 13, stats: { ppg: 11.0, rpg: 3.4, apg: 2.0, tpPct: 40.0 } },
  { name: 'Gary Harris',        espnId: '2999547', position: 'SG',   age: 32, team: 'MIL', type: 'PO',  estimatedSalary: 3_800_000,  optionValue: 3_815_861,  yearsExp: 12, stats: { ppg: 5.5, rpg: 2.0, apg: 1.4, tpPct: 35.0 } },
  { name: 'Zach LaVine',        espnId: '3064440', position: 'SG',   age: 31, team: 'SAC', type: 'PO',  estimatedSalary: 49_000_000, optionValue: 48_967_380, yearsExp: 12, stats: { ppg: 24.0, rpg: 5.0, apg: 4.5, tpPct: 39.0 } },
  { name: "De'Anthony Melton",  espnId: '4066436', position: 'SG',   age: 28, team: 'GSW', type: 'PO',  estimatedSalary: 3_500_000,  optionValue: 3_451_779,  yearsExp: 8,  stats: { ppg: 4.0, rpg: 2.0, apg: 2.0, tpPct: 32.0 } },
  { name: 'Austin Reaves',      espnId: '4066457', position: 'SG',   age: 28, team: 'LAL', type: 'PO',  estimatedSalary: 14_900_000, optionValue: 14_898_786, yearsExp: 5,  stats: { ppg: 17.5, rpg: 4.5, apg: 5.5, tpPct: 37.0 } },
  { name: 'Gary Trent Jr.',     espnId: '4277843', position: 'SG',   age: 28, team: 'MIL', type: 'PO',  estimatedSalary: 3_900_000,  optionValue: 3_881_960,  yearsExp: 8,  stats: { ppg: 9.0, rpg: 2.5, apg: 1.4, tpPct: 38.0 } },
  { name: 'Taurean Prince',     espnId: '2990962', position: 'SF',   age: 32, team: 'MIL', type: 'PO',  estimatedSalary: 3_800_000,  optionValue: 3_815_861,  yearsExp: 10, stats: { ppg: 6.0, rpg: 3.0, apg: 1.4, tpPct: 36.0 } },
  { name: 'Andrew Wiggins',     espnId: '3059319', position: 'SF',   age: 31, team: 'MIA', type: 'PO',  estimatedSalary: 30_200_000, optionValue: 30_169_644, yearsExp: 12, stats: { ppg: 15.0, rpg: 5.0, apg: 2.0, tpPct: 35.0 } },
  { name: 'Draymond Green',     espnId: '6589', position: 'PF',   age: 36, team: 'GSW', type: 'PO',  estimatedSalary: 27_700_000, optionValue: 27_678_571, yearsExp: 14, stats: { ppg: 8.5, rpg: 6.0, apg: 5.5, tpPct: 32.0 } },
  { name: 'Deandre Ayton',      espnId: '4278129', position: 'C',    age: 28, team: 'POR', type: 'PO',  estimatedSalary: 8_100_000,  optionValue: 8_104_000,  yearsExp: 8,  stats: { ppg: 16.0, rpg: 10.0, apg: 2.0, tpPct: 25.0 } },
  { name: 'Al Horford',         espnId: '3213', position: 'C',    age: 40, team: 'GSW', type: 'PO',  estimatedSalary: 6_000_000,  optionValue: 5_969_250,  yearsExp: 19, stats: { ppg: 7.0, rpg: 5.5, apg: 2.5, tpPct: 36.0 } },

  // ──────────────────────────────────────────────
  // TEAM OPTIONS (TO) — notable players
  // ──────────────────────────────────────────────
  { name: 'Bogdan Bogdanovic',  espnId: '3037789', position: 'SG',   age: 34, team: 'LAC', type: 'TO',  estimatedSalary: 16_000_000, optionValue: 16_020_000, yearsExp: 9,  stats: { ppg: 12.0, rpg: 3.4, apg: 3.0, tpPct: 38.0 } },
  { name: 'Luguentz Dort',      espnId: '4397020', position: 'SF',   age: 27, team: 'OKC', type: 'TO',  estimatedSalary: 17_700_000, optionValue: 17_722_222, yearsExp: 7,  stats: { ppg: 11.0, rpg: 3.5, apg: 2.0, tpPct: 34.0 } },
  { name: 'Isaiah Hartenstein',  espnId: '4222252', position: 'C',   age: 28, team: 'OKC', type: 'TO',  estimatedSalary: 28_500_000, optionValue: 28_500_000, yearsExp: 8,  stats: { ppg: 13.0, rpg: 10.0, apg: 3.5, tpPct: 32.0 } },
  { name: 'Jonathan Kuminga',   espnId: '4433247', position: 'PF',   age: 24, team: 'ATL', type: 'TO',  estimatedSalary: 24_300_000, optionValue: 24_300_000, yearsExp: 5,  stats: { ppg: 16.0, rpg: 5.5, apg: 2.5, tpPct: 33.0 } },
  { name: 'Kevon Looney',       espnId: '3155535', position: 'C',    age: 30, team: 'NOP', type: 'TO',  estimatedSalary: 8_000_000,  optionValue: 8_000_000,  yearsExp: 11, stats: { ppg: 5.0, rpg: 6.0, apg: 2.5, tpPct: null } },
  { name: 'Brook Lopez',        espnId: '3448', position: 'C',    age: 38, team: 'LAC', type: 'TO',  estimatedSalary: 9_200_000,  optionValue: 9_187_500,  yearsExp: 18, stats: { ppg: 12.0, rpg: 5.0, apg: 1.5, tpPct: 36.0 } },
]

export default FREE_AGENTS
