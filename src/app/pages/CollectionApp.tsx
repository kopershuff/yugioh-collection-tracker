import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Filter, Check, Star, Loader2, RefreshCw, List, Grid, Heart, Plus, Minus, DollarSign, ExternalLink, Download, LogOut, CloudOff, Cloud, Key, MessageCircle } from 'lucide-react';

// Déclaration TypeScript pour le timeout global
declare global {
  interface Window {
    cloudSaveTimeout?: NodeJS.Timeout;
  }
}
import { CardImage } from '../components/CardImage';
import { registerSW, setupInstallPrompt } from '../../pwa-register';
import { loadFromCloudWithPin, saveToCloudWithPin } from '../../pin-auth';
import { PinAuth } from '../components/PinAuth';
import { FirestoreDebug } from '../components/FirestoreDebug';
import { CloudSaveButton } from '../components/CloudSaveButton';
import { FirebaseOptimizationInfo } from '../components/FirebaseOptimizationInfo';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

interface YuGiOhCard {
  id: number;
  name: string;
  type: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  archetype?: string;
  card_sets?: Array<{
    set_name: string;
    set_code: string;
    set_rarity: string;
  }>;
  card_images?: Array<{
    image_url: string;
    image_url_small: string;
  }>;
}

// Traductions des types de cartes
const typeTranslations: Record<string, string> = {
  'Effect Monster': 'Monstre à Effet',
  'Normal Monster': 'Monstre Normal',
  'Ritual Monster': 'Monstre Rituel',
  'Fusion Monster': 'Monstre Fusion',
  'Synchro Monster': 'Monstre Synchro',
  'XYZ Monster': 'Monstre Xyz',
  'Pendulum Effect Monster': 'Monstre Pendule à Effet',
  'Link Monster': 'Monstre Lien',
  'Spell Card': 'Carte Magie',
  'Trap Card': 'Carte Piège',
  'Token': 'Jeton',
  'Skill Card': 'Carte Compétence',
  'Tuner Monster': 'Monstre Syntoniseur',
  'Flip Monster': 'Monstre Flip',
  'Spirit Monster': 'Monstre Esprit',
  'Union Monster': 'Monstre Union',
  'Gemini Monster': 'Monstre Gémeau',
  'Pendulum Normal Monster': 'Monstre Pendule Normal',
  'Synchro Tuner Monster': 'Monstre Synchro Syntoniseur',
  'Synchro Pendulum Effect Monster': 'Monstre Synchro Pendule à Effet',
  'XYZ Pendulum Effect Monster': 'Monstre Xyz Pendule à Effet',
  'Fusion Tuner Monster': 'Monstre Fusion Syntoniseur',
};

// Traductions des races/catégories
const raceTranslations: Record<string, string> = {
  'Warrior': 'Guerrier',
  'Spellcaster': 'Magicien',
  'Dragon': 'Dragon',
  'Zombie': 'Zombie',
  'Fiend': 'Démon',
  'Machine': 'Machine',
  'Aqua': 'Aqua',
  'Pyro': 'Pyro',
  'Rock': 'Rocher',
  'Winged Beast': 'Bête Ailée',
  'Plant': 'Plante',
  'Insect': 'Insecte',
  'Thunder': 'Tonnerre',
  'Beast': 'Bête',
  'Beast-Warrior': 'Bête-Guerrier',
  'Dinosaur': 'Dinosaure',
  'Fish': 'Poisson',
  'Sea Serpent': 'Serpent de Mer',
  'Reptile': 'Reptile',
  'Psychic': 'Psychique',
  'Divine-Beast': 'Bête Divine',
  'Creator God': 'Dieu Créateur',
  'Wyrm': 'Wyrm',
  'Cyberse': 'Cyberse',
  'Fairy': 'Elfe',
  'Normal': 'Normale',
  'Continuous': 'Continue',
  'Equip': 'Équipement',
  'Quick-Play': 'Jeu-Rapide',
  'Field': 'Terrain',
  'Ritual': 'Rituel',
  'Counter': 'Contre',
  'Illusion': 'Illusion',
};

// Traductions des attributs
const attributeTranslations: Record<string, string> = {
  'DARK': 'TÉNÈBRES',
  'LIGHT': 'LUMIÈRE',
  'WATER': 'EAU',
  'FIRE': 'FEU',
  'EARTH': 'TERRE',
  'WIND': 'VENT',
  'DIVINE': 'DIVIN',
};

// Traductions des raretés
const rarityTranslations: Record<string, string> = {
  'Common': 'Commune',
  'Rare': 'Rare',
  'Super Rare': 'Super Rare',
  'Ultra Rare': 'Ultra Rare',
  'Secret Rare': 'Secret Rare',
  'Ultimate Rare': 'Ultimate Rare',
  'Ghost Rare': 'Ghost Rare',
  'Starlight Rare': 'Starlight Rare',
  "Collector's Rare": 'Rare Collector',
  'Prismatic Secret Rare': 'Secret Prismatique',
  'Quarter Century Secret Rare': 'Secret Quart de Siècle',
  'Platinum Secret Rare': 'Secret Platine',
  'Gold Rare': 'Or Rare',
  'Premium Gold Rare': 'Or Premium Rare',
  'Short Print': 'Tirage Limité',
  'Super Short Print': 'Tirage Très Limité',
  'Parallel Rare': 'Rare Parallèle',
  'Ultra Parallel Rare': 'Ultra Rare Parallèle',
  'Super Parallel Rare': 'Super Rare Parallèle',
  'Duel Terminal Normal Parallel Rare': 'DT Normale Parallèle',
  'Duel Terminal Rare Parallel Rare': 'DT Rare Parallèle',
  'Duel Terminal Super Parallel Rare': 'DT Super Parallèle',
  'Duel Terminal Ultra Parallel Rare': 'DT Ultra Parallèle',
  'Normal Parallel Rare': 'Normale Parallèle',
  'Mosaic Rare': 'Rare Mosaïque',
  'Shatterfoil Rare': 'Rare Éclats',
  'Ghost/Gold Rare': 'Ghost/Or Rare',
  'Platinum Rare': 'Platine Rare',
};

const getRarityStyle = (rarity: string): string => {
  const r = rarity.toLowerCase();
  if (r.includes('starlight')) return 'bg-gradient-to-r from-cyan-200 via-pink-200 to-yellow-200 text-gray-800 border border-pink-300';
  if (r.includes('ghost')) return 'bg-gradient-to-r from-slate-100 to-blue-100 text-slate-600 border border-slate-300';
  if (r.includes('quarter century')) return 'bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 text-amber-900 border border-amber-400';
  if (r.includes('ultimate')) return 'bg-gradient-to-r from-amber-100 to-yellow-300 text-amber-900 border border-amber-500';
  if (r.includes('secret') || r.includes('prismatic') || r.includes('platinum')) return 'bg-gradient-to-r from-violet-200 to-indigo-200 text-indigo-900 border border-indigo-400';
  if (r.includes('ultra')) return 'bg-gradient-to-r from-yellow-200 to-amber-300 text-amber-900 border border-amber-400';
  if (r.includes("collector")) return 'bg-gradient-to-r from-rose-200 to-pink-300 text-rose-900 border border-rose-400';
  if (r.includes('gold') || r.includes('or')) return 'bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-950 border border-yellow-500';
  if (r.includes('super')) return 'bg-gradient-to-r from-sky-200 to-blue-300 text-blue-900 border border-blue-400';
  if (r.includes('mosaic') || r.includes('shatter') || r.includes('éclat') || r.includes('mosaïque')) return 'bg-gradient-to-r from-teal-100 to-emerald-200 text-teal-900 border border-teal-400';
  if (r.includes('rare')) return 'bg-gradient-to-r from-slate-200 to-gray-300 text-gray-800 border border-gray-400';
  return 'bg-gray-100 text-gray-600 border border-gray-300';
};

// Traductions des extensions (noms partiels pour matcher)
const setTranslations: Record<string, string> = {
  // Boosters principaux originaux
  'Legend of Blue Eyes White Dragon': 'La Légende du Dragon Blanc aux Yeux Bleus',
  'Metal Raiders': 'Les Pillards de Métal',
  'Spell Ruler': 'Le Maître des Magies',
  'Pharaoh\'s Servant': 'Le Serviteur du Pharaon',
  'Labyrinth of Nightmare': 'Le Labyrinthe du Cauchemar',
  'Legacy of Darkness': 'L\'Héritage des Ténèbres',
  'Pharaonic Guardian': 'Le Gardien Pharaonique',
  'Magician\'s Force': 'La Force du Magicien',
  'Dark Crisis': 'La Crise des Ténèbres',
  'Invasion of Chaos': 'L\'Invasion du Chaos',
  'Ancient Sanctuary': 'Le Sanctuaire Ancien',
  'Soul of the Duelist': 'L\'Âme du Duelliste',
  'Rise of Destiny': 'L\'Ascension du Destin',
  'Flaming Eternity': 'L\'Éternité Enflammée',
  'The Lost Millennium': 'Le Millénaire Perdu',
  'Cybernetic Revolution': 'La Révolution Cybernétique',
  'Elemental Energy': 'L\'Énergie Élémentaire',
  'Shadow of Infinity': 'L\'Ombre de l\'Infini',
  'Enemy of Justice': 'L\'Ennemi de la Justice',
  'Power of the Duelist': 'Le Pouvoir du Duelliste',
  'Cyberdark Impact': 'L\'Impact Cybersombre',
  'Strike of Neos': 'L\'Attaque de Neos',
  'Force of the Breaker': 'La Force du Briseur',
  'Tactical Evolution': 'L\'Évolution Tactique',
  'Gladiator\'s Assault': 'L\'Assaut du Gladiateur',
  'Phantom Darkness': 'Les Ténèbres Fantômes',
  'Light of Destruction': 'La Lumière de la Destruction',
  'The Duelist Genesis': 'La Genèse du Duelliste',
  'Crossroads of Chaos': 'Carrefour du Chaos',
  'Crimson Crisis': 'Crise Pourpre',
  'Raging Battle': 'Bataille Déchaînée',
  'Ancient Prophecy': 'Prophétie Ancienne',
  'Stardust Overdrive': 'Poussière d\'Étoile Surmultipliée',
  'Absolute Powerforce': 'Force de Puissance Absolue',
  'The Shining Darkness': 'Les Ténèbres Lumineuses',
  'Duelist Revolution': 'Révolution du Duelliste',
  'Starstrike Blast': 'Explosion Frappe Stellaire',
  'Storm of Ragnarok': 'Tempête de Ragnarok',
  'Extreme Victory': 'Victoire Extrême',
  'Generation Force': 'Force de Génération',
  'Photon Shockwave': 'Onde de Choc Photonique',
  'Order of Chaos': 'Ordre du Chaos',
  'Galactic Overlord': 'Seigneur Galactique',
  'Return of the Duelist': 'Le Retour du Duelliste',
  'Abyss Rising': 'Émergence de l\'Abîme',
  'Cosmo Blazer': 'Brasier Cosmique',
  'Lord of the Tachyon Galaxy': 'Seigneur de la Galaxie Tachyon',
  'Judgment of the Light': 'Jugement de la Lumière',
  'Shadow Specters': 'Spectres de l\'Ombre',
  'Legacy of the Valiant': 'Héritage du Vaillant',
  'Primal Origin': 'Origine Primordiale',
  'Duelist Alliance': 'Alliance des Duellistes',
  'The New Challengers': 'Les Nouveaux Challengers',
  'Secrets of Eternity': 'Secrets de l\'Éternité',
  'Crossed Souls': 'Âmes Croisées',
  'Clash of Rebellions': 'Choc des Rébellions',
  'Dimension of Chaos': 'Dimension du Chaos',
  'Breakers of Shadow': 'Briseurs d\'Ombre',
  'Shining Victories': 'Victoires Éclatantes',
  'The Dark Illusion': 'L\'Illusion Sombre',
  'Invasion: Vengeance': 'Invasion: Vengeance',
  'Raging Tempest': 'Tempête Déchaînée',
  'Maximum Crisis': 'Crise Maximum',
  'Code of the Duelist': 'Code du Duelliste',
  'Circuit Break': 'Rupture de Circuit',
  'Extreme Force': 'Force Extrême',
  'Flames of Destruction': 'Flammes de la Destruction',
  'Cybernetic Horizon': 'Horizon Cybernétique',
  'Soul Fusion': 'Fusion des Âmes',
  'Savage Strike': 'Frappe Sauvage',
  'Dark Neostorm': 'Néotempête Sombre',
  'Rising Rampage': 'Déchaînement Ascendant',
  'Chaos Impact': 'Impact du Chaos',
  'Ignition Assault': 'Assaut Enflammé',
  'Eternity Code': 'Code Éternité',
  'Secret Slayers': 'Tueurs Secrets',
  'Rise of the Duelist': 'L\'Ascension du Duelliste',
  'Phantom Rage': 'Rage Fantôme',
  'Blazing Vortex': 'Vortex Ardent',
  'Lightning Overdrive': 'Foudre Surmultipliée',
  'Dawn of Majesty': 'L\'Aube de la Majesté',
  'Burst of Destiny': 'Éclat du Destin',
  'Battle of Chaos': 'Bataille du Chaos',
  'Dimension Force': 'Force Dimensionnelle',
  'Power of the Elements': 'Pouvoir des Éléments',
  'Darkwing Blast': 'Explosion Aile Sombre',
  'Photon Hypernova': 'Hypernova Photon',
  'Cyberstorm Access': 'Accès Cybertemête',
  'Tactical Masters': 'Maîtres Tactiques',
  'Age of Overlord': 'Ère du Seigneur',
  'Wild Survivors': 'Survivants Sauvages',

  // Collections et rééditions
  'Legendary Collection': 'Collection Légendaire',
  'Premium Gold': 'Or Premium',
  'Battles of Legend': 'Batailles de Légende',
  'Legendary Duelists': 'Duellistes Légendaires',
  'Legendary Hero Decks': 'Decks des Héros Légendaires',
  'Duel Devastator': 'Duel Dévastateur',
  'Maximum Gold': 'Or Maximum',
  'Dragons of Legend': 'Dragons de Légende',
  'Mega Pack': 'Méga Pack',
  'Ghosts From the Past': 'Fantômes du Passé',
  'Brothers of Legend': 'Frères de Légende',
  'Battles of Legend: Armageddon': 'Batailles de Légende: Armageddon',
  'Battles of Legend: Hero\'s Revenge': 'Batailles de Légende: La Revanche du Héros',
  'Battles of Legend: Light\'s Revenge': 'Batailles de Légende: La Revanche de la Lumière',
  'Battles of Legend: Relentless Revenge': 'Batailles de Légende: Vengeance Implacable',
  'Battles of Legend: Crystal Revenge': 'Batailles de Légende: Vengeance Cristalline',
  'Battles of Legend: Monstrous Revenge': 'Batailles de Légende: Vengeance Monstrueuse',

  // Structure Decks et Starter Decks
  'Structure Deck': 'Deck de Structure',
  'Starter Deck': 'Deck de Démarrage',
  'Speed Duel': 'Duel Accéléré',
  'Duelist Pack': 'Pack du Duelliste',
  'Dark World': 'Monde des Ténèbres',
  'Shaddoll': 'Marionnette de l\'Ombre',
  'HERO Strike': 'Frappe HÉROS',
  'Synchron Extreme': 'Synchro Extrême',
  'Master of Pendulum': 'Maître du Pendule',
  'Zombie Horde': 'Horde Zombie',
  'Soulburner': 'Âme Ardente',
  'Rokket Revolt': 'Révolte Rokket',
  'Shaddoll Showdown': 'Confrontation Marionnette de l\'Ombre',
  'Mechanized Madness': 'Folie Mécanisée',
  'Sacred Beasts': 'Bêtes Sacrées',
  'Spirit Charmers': 'Charmeuses Spirituelles',
  'Freezing Chains': 'Chaînes Gelées',
  'Cyber Strike': 'Frappe Cyber',
  'Albaz Strike': 'Frappe Albaz',
  'Crystal Beast': 'Bête de Cristal',
  'Legend of the Crystal Beasts': 'Légende des Bêtes de Cristal',

  // Packs spéciaux
  'Toon Chaos': 'Chaos Toon',
  'Fusion Enforcers': 'Renforts de Fusion',
  'Shadows in Valhalla': 'Ombres au Valhalla',
  'Star Pack': 'Pack Étoile',
  'Astral Pack': 'Pack Astral',
  'Hidden Arsenal': 'Arsenal Caché',
  'OTS Tournament Pack': 'Pack Tournoi OTS',
  'World Superstars': 'Superstars Mondiales',
  'Destiny Soldiers': 'Soldats du Destin',
  'Pendulum Evolution': 'Évolution Pendule',
  'Legendary Dragon Decks': 'Decks des Dragons Légendaires',
  'Wave of Light': 'Vague de Lumière',

  // Tins et éditions spéciales
  'Tin': 'Boîte Métal',
  'Mega-Tin': 'Méga-Boîte',
  'Collector Tin': 'Boîte Collector',
  'Legendary Tin': 'Boîte Légendaire',

  // Noms de personnages pour les decks
  'Yugi': 'Yugi',
  'Kaiba': 'Kaiba',
  'Joey': 'Joey',
  'Jaden': 'Jaden',
  'Yusei': 'Yusei',
  'Yuma': 'Yuma',
  'Zexal': 'Zexal',
  'Pharaoh': 'Pharaon',

  // Termes génériques
  'Booster': 'Booster',
  'Special Edition': 'Édition Spéciale',
  'Deluxe Edition': 'Édition Deluxe',
  'Anniversary': 'Anniversaire',
  'Reloaded': 'Rechargé',
  'Unlimited': 'Illimité',
  '1st Edition': '1ère Édition',
  'Limited Edition': 'Édition Limitée',
};

const translateSetName = (setName: string, lang = 'fr'): string => {
  if (lang !== 'fr') return setName;
  if (setTranslations[setName]) return setTranslations[setName];
  for (const [english, french] of Object.entries(setTranslations)) {
    if (setName.includes(english)) return setName.replace(english, french);
  }
  return setName;
};

const translateText = (text: string, translations: Record<string, string>, lang = 'fr'): string => {
  if (lang === 'fr') return translations[text] || text;
  return text;
};

export default function CollectionApp() {
  const { t, apiCode, language } = useLanguage();
  const [cards, setCards] = useState<YuGiOhCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCardsCount, setNewCardsCount] = useState(0);
  const [showNewCardsNotif, setShowNewCardsNotif] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>(() => {
    return localStorage.getItem('yugioh-last-update') || '';
  });
  const [ownedCards, setOwnedCards] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('yugioh-owned-cards');
      const cards = saved ? new Set<number>(JSON.parse(saved)) : new Set<number>();
      console.log('💾 localStorage ownedCards chargées:', cards.size, 'cartes');
      return cards;
    } catch { return new Set<number>(); }
  });
  const [ownedRarities, setOwnedRarities] = useState<Map<number, Set<string>>>(() => {
    try {
      const saved = localStorage.getItem('yugioh-owned-rarities');
      if (!saved) return new Map();
      const parsed = JSON.parse(saved);
      const map = new Map<number, Set<string>>();
      Object.entries(parsed).forEach(([id, rarities]) => map.set(Number(id), new Set(rarities as string[])));
      return map;
    } catch { return new Map(); }
  });
  const [ownedQuantities, setOwnedQuantities] = useState<Map<number, number>>(() => {
    try {
      const saved = localStorage.getItem('yugioh-owned-quantities');
      if (!saved) return new Map();
      const parsed = JSON.parse(saved);
      const map = new Map<number, number>();
      Object.entries(parsed).forEach(([id, qty]) => map.set(Number(id), qty as number));
      return map;
    } catch { return new Map(); }
  });
  const [wishlistCards, setWishlistCards] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('yugioh-wishlist-cards');
      return saved ? new Set<number>(JSON.parse(saved)) : new Set<number>();
    } catch { return new Set<number>(); }
  });
  const [wishlistRarities, setWishlistRarities] = useState<Map<number, Set<string>>>(() => {
    try {
      const saved = localStorage.getItem('yugioh-wishlist-rarities');
      if (!saved) return new Map();
      const parsed = JSON.parse(saved);
      const map = new Map<number, Set<string>>();
      Object.entries(parsed).forEach(([id, rarities]) => map.set(Number(id), new Set(rarities as string[])));
      return map;
    } catch { return new Map(); }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('Tous');
  const [filterRace, setFilterRace] = useState<string>('Tous');
  const [filterArchetype, setFilterArchetype] = useState<string>('Tous');
  const [filterSet, setFilterSet] = useState<string>('Tous');
  const [filterRarity, setFilterRarity] = useState<string>('Tous');
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'owned' | 'wishlist'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'rarity'>('name');
  const [ownedFilterRarity, setOwnedFilterRarity] = useState<string>('Tous');
  const [wishlistFilterRarity, setWishlistFilterRarity] = useState<string>('Tous');
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<(() => Promise<void>) | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  // PIN auth
  const [userPin, setUserPin] = useState<string | null>(() => {
    try {
      const savedPin = localStorage.getItem('yugioh-user-pin');
      console.log('📌 PIN récupéré au démarrage:', savedPin);
      return savedPin;
    } catch { return null; }
  });
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPinAuth, setShowPinAuth] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const isSyncingRef = useRef(false);
  const isLoadingRef = useRef(false); // Pour éviter de sauvegarder pendant le chargement

  // Charger depuis le cloud au démarrage si PIN existe
  useEffect(() => {
    if (userPin) {
      console.log('🚀 Chargement initial avec PIN:', userPin);
      handleLoadFromCloud(userPin);
    }
  }, [userPin]); // Déclencher quand userPin change

  const handleLoadFromCloud = async (pin: string) => {
    try {
      isLoadingRef.current = true; // Bloquer la sauvegarde auto pendant le chargement
      setSyncStatus('syncing');
      const data = await loadFromCloudWithPin(pin);
      console.log('📥 Données chargées depuis le cloud:', data);
      if (data) {
        const ownedCardsArray = (data.ownedCards as number[]) || [];
        console.log('   → ownedCards:', ownedCardsArray.length, 'cartes');
        setOwnedCards(new Set<number>(ownedCardsArray));

        if (data.ownedRarities) {
          const map = new Map<number, Set<string>>();
          Object.entries(data.ownedRarities as Record<number, string[]>).forEach(([id, r]) => map.set(Number(id), new Set(r)));
          setOwnedRarities(map);
          console.log('   → ownedRarities:', map.size, 'cartes avec raretés');
        }
        if (data.ownedQuantities) {
          const map = new Map<number, number>();
          Object.entries(data.ownedQuantities as Record<number, number>).forEach(([id, q]) => map.set(Number(id), q));
          setOwnedQuantities(map);
          console.log('   → ownedQuantities:', map.size, 'cartes avec quantités');
        }

        const wishlistCardsArray = (data.wishlistCards as number[]) || [];
        console.log('   → wishlistCards:', wishlistCardsArray.length, 'cartes');
        setWishlistCards(new Set<number>(wishlistCardsArray));

        if (data.wishlistRarities) {
          const map = new Map<number, Set<string>>();
          Object.entries(data.wishlistRarities as Record<number, string[]>).forEach(([id, r]) => map.set(Number(id), new Set(r)));
          setWishlistRarities(map);
          console.log('   → wishlistRarities:', map.size, 'cartes wishlist avec raretés');
        }

        // Sauvegarder dans localStorage pour que ça persiste
        localStorage.setItem('yugioh-owned-cards', JSON.stringify(ownedCardsArray));
        localStorage.setItem('yugioh-wishlist-cards', JSON.stringify(wishlistCardsArray));

        console.log('✅ Chargement cloud terminé et sauvegardé en local');
      } else {
        console.log('ℹ️ Aucune donnée trouvée pour ce PIN (nouveau compte)');
      }
      setSyncStatus('synced');
    } catch (err) {
      console.error('❌ Erreur de chargement cloud:', err);
      setSyncStatus('error');
    } finally {
      // Débloquer la sauvegarde après 1 seconde pour laisser le temps aux états de se mettre à jour
      setTimeout(() => {
        isLoadingRef.current = false;
        console.log('🔓 Sauvegarde automatique réactivée');
      }, 1000);
    }
  };

  const handleSaveToCloud = async (data: Record<string, unknown>, pinOverride?: string) => {
    const pin = pinOverride || userPin;
    if (!pin || isSyncingRef.current) return;
    isSyncingRef.current = true;
    try {
      setSyncStatus('syncing');
      console.log('Sauvegarde cloud avec PIN:', pin, 'Données:', data);
      await saveToCloudWithPin(pin, data);
      console.log('✓ Sauvegarde cloud réussie');
      setSyncStatus('synced');
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('✗ Erreur de sauvegarde cloud:', err);
      setSyncStatus('error');
    } finally {
      isSyncingRef.current = false;
    }
  };

  const handleManualSave = () => {
    if (!userPin || !hasUnsavedChanges) return;

    const raritiesObj: Record<number, string[]> = {};
    ownedRarities.forEach((r, id) => { raritiesObj[id] = [...r]; });
    const quantitiesObj: Record<number, number> = {};
    ownedQuantities.forEach((q, id) => { quantitiesObj[id] = q; });
    const wishlistObj: Record<number, string[]> = {};
    wishlistRarities.forEach((r, id) => { wishlistObj[id] = [...r]; });

    // Annuler le timeout automatique et sauvegarder immédiatement
    if (window.cloudSaveTimeout) {
      clearTimeout(window.cloudSaveTimeout);
    }

    handleSaveToCloud({
      ownedCards: [...ownedCards],
      ownedRarities: raritiesObj,
      ownedQuantities: quantitiesObj,
      wishlistCards: [...wishlistCards],
      wishlistRarities: wishlistObj,
    });
  };

  const handlePinLogin = async (pin: string) => {
    console.log('🔐 Connexion avec PIN:', pin);
    setUserPin(pin);
    localStorage.setItem('yugioh-user-pin', pin);
    setShowPinAuth(false);

    // Charger les données existantes depuis le cloud
    await handleLoadFromCloud(pin);

    console.log('✅ Connexion terminée');
  };

  const handleSignOut = () => {
    setShowUserMenu(false);
    setUserPin(null);
    localStorage.removeItem('yugioh-user-pin');
    setSyncStatus('idle');
  };

  // Sauvegarde locale + cloud avec debounce (réduction des écritures Firebase)
  useEffect(() => {
    if (isLoadingRef.current) {
      console.log('⏸️ Sauvegarde bloquée (chargement en cours)');
      return;
    }

    console.log('🔄 Sauvegarde locale déclenchée - ownedCards:', ownedCards.size);

    // Sauvegarde LOCALE immédiate (gratuit)
    localStorage.setItem('yugioh-owned-cards', JSON.stringify([...ownedCards]));
    const raritiesObj: Record<number, string[]> = {};
    ownedRarities.forEach((r, id) => { raritiesObj[id] = [...r]; });
    localStorage.setItem('yugioh-owned-rarities', JSON.stringify(raritiesObj));
    const quantitiesObj: Record<number, number> = {};
    ownedQuantities.forEach((q, id) => { quantitiesObj[id] = q; });
    localStorage.setItem('yugioh-owned-quantities', JSON.stringify(quantitiesObj));
    const wishlistObj: Record<number, string[]> = {};
    wishlistRarities.forEach((r, id) => { wishlistObj[id] = [...r]; });
    localStorage.setItem('yugioh-wishlist-cards', JSON.stringify([...wishlistCards]));
    localStorage.setItem('yugioh-wishlist-rarities', JSON.stringify(wishlistObj));

    // Sauvegarde CLOUD avec debounce de 3 secondes (économiser Firebase)
    if (userPin) {
      console.log('⏱️ Sauvegarde cloud planifiée dans 3s...');
      setHasUnsavedChanges(true); // Marquer comme non sauvegardé

      // Annuler la sauvegarde précédente si elle existe
      if (window.cloudSaveTimeout) {
        clearTimeout(window.cloudSaveTimeout);
      }

      // Planifier une nouvelle sauvegarde dans 3 secondes
      window.cloudSaveTimeout = setTimeout(() => {
        console.log('☁️ Sauvegarde cloud automatique en cours...');
        handleSaveToCloud({
          ownedCards: [...ownedCards],
          ownedRarities: raritiesObj,
          ownedQuantities: quantitiesObj,
          wishlistCards: [...wishlistCards],
          wishlistRarities: wishlistObj,
        });
      }, 3000); // Attendre 3 secondes d'inactivité avant de sauvegarder
    } else {
      console.log('⚠️ Pas de PIN - sauvegarde locale uniquement');
    }
  }, [ownedCards, ownedRarities, ownedQuantities, wishlistCards, wishlistRarities, userPin]);

  // Fetch all cards from API (re-fetch when language changes)
  useEffect(() => {
    // Reset filters when language changes
    setFilterType('Tous');
    setFilterRace('Tous');
    setFilterSet('Tous');
    setFilterRarity('Tous');
    fetchCards(false, apiCode);

    // Vérification automatique toutes les heures
    const checkInterval = setInterval(() => {
      console.log('🔍 Vérification automatique des nouvelles cartes...');
      fetchCards(true, apiCode);
    }, 60 * 60 * 1000);

    return () => clearInterval(checkInterval);
  }, [language]);

  // Fermer le menu utilisateur en cliquant ailleurs
  useEffect(() => {
    if (!showUserMenu) return;
    const close = () => setShowUserMenu(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [showUserMenu]);

  // Initialize PWA
  useEffect(() => {
    // Ajouter les métadonnées PWA au head
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#4F46E5';
      document.head.appendChild(meta);
    }

    const metaAppleMobile = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!metaAppleMobile) {
      const meta = document.createElement('meta');
      meta.name = 'apple-mobile-web-app-capable';
      meta.content = 'yes';
      document.head.appendChild(meta);
    }

    const metaAppleStatus = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!metaAppleStatus) {
      const meta = document.createElement('meta');
      meta.name = 'apple-mobile-web-app-status-bar-style';
      meta.content = 'black-translucent';
      document.head.appendChild(meta);
    }

    const linkManifest = document.querySelector('link[rel="manifest"]');
    if (!linkManifest) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '/manifest.json';
      document.head.appendChild(link);
    }

    // Détecter si l'app est déjà installée (mode standalone)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // Enregistrer le service worker
    registerSW();
    setupInstallPrompt((promptFn) => {
      setInstallPrompt(() => promptFn);
    });

    // Détecter quand l'app est installée
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
    });
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      await installPrompt();
      setInstallPrompt(null);
    } else {
      // Fallback : afficher modale avec instructions manuelles
      setShowInstallModal(true);
    }
  };

  const fetchCards = async (isAutoCheck = false, langCode?: string) => {
    if (!isAutoCheck) setLoading(true);
    setError(null);
    const lang = langCode || apiCode;
    const url = lang === 'en'
      ? 'https://db.ygoprodeck.com/api/v7/cardinfo.php'
      : `https://db.ygoprodeck.com/api/v7/cardinfo.php?language=${lang}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Échec du chargement des cartes');
      const data = await response.json();
      const newCards = data.data || [];

      // Vérifier s'il y a de nouvelles cartes
      const lastKnownCount = localStorage.getItem('yugioh-last-card-count');
      const lastCount = lastKnownCount ? parseInt(lastKnownCount) : 0;
      const currentCount = newCards.length;

      if (lastCount > 0 && currentCount > lastCount) {
        const diff = currentCount - lastCount;
        setNewCardsCount(diff);
        setShowNewCardsNotif(true);
        console.log(`🎉 ${diff} nouvelle${diff > 1 ? 's' : ''} carte${diff > 1 ? 's' : ''} détectée${diff > 1 ? 's' : ''} !`);
      } else if (isAutoCheck) {
        console.log('✓ Aucune nouvelle carte détectée');
      }

      // Sauvegarder le nouveau total et la date de mise à jour
      localStorage.setItem('yugioh-last-card-count', currentCount.toString());
      const now = new Date().toLocaleString('fr-FR');
      localStorage.setItem('yugioh-last-update', now);
      setLastUpdateTime(now);
      setCards(newCards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      if (!isAutoCheck) setLoading(false);
    }
  };


  // Get unique types and races for filters
  const availableTypes = useMemo(() => {
    const types = new Set(cards.map(c => translateText(c.type, typeTranslations, language)));
    return ['Tous', ...Array.from(types).sort()];
  }, [cards]);

  const availableRaces = useMemo(() => {
    const races = new Set(cards.map(c => c.race ? translateText(c.race, raceTranslations, language) : '').filter(Boolean));
    return ['Tous', ...Array.from(races).sort()];
  }, [cards]);

  const availableArchetypes = useMemo(() => {
    const archetypes = new Set(cards.map(c => c.archetype).filter(Boolean));
    return ['Tous', ...Array.from(archetypes).sort()];
  }, [cards]);

  const availableRarities = useMemo(() => {
    const rarities = new Set<string>();
    cards.forEach(card => {
      card.card_sets?.forEach(set => {
        if (set.set_rarity) rarities.add(set.set_rarity);
      });
    });
    return ['Tous', ...Array.from(rarities).sort()];
  }, [cards]);

  const availableSets = useMemo(() => {
    const sets = new Set<string>();
    cards.forEach(card => {
      card.card_sets?.forEach(set => sets.add(translateSetName(set.set_name, language)));
    });
    return ['Tous', ...Array.from(sets).sort()];
  }, [cards]);

  const filteredCards = useMemo(() => {
    let filtered = cards.filter(card => {
      // Filter by active tab
      if (activeTab === 'owned' && !ownedCards.has(card.id)) {
        return false;
      }
      if (activeTab === 'wishlist' && !wishlistCards.has(card.id)) {
        return false;
      }

      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'Tous' || translateText(card.type, typeTranslations, language) === filterType;
      const matchesRace = filterRace === 'Tous' || (card.race && translateText(card.race, raceTranslations, language) === filterRace);
      const matchesArchetype = filterArchetype === 'Tous' || card.archetype === filterArchetype;
      const matchesSet = filterSet === 'Tous' || card.card_sets?.some(set => translateSetName(set.set_name, language) === filterSet);
      const matchesRarity = filterRarity === 'Tous' || card.card_sets?.some(set => set.set_rarity === filterRarity);
      const matchesOwnership = !showOnlyMissing || !ownedCards.has(card.id);

      // Additional rarity filter for owned cards tab
      const matchesOwnedRarity = activeTab !== 'owned' || ownedFilterRarity === 'Tous' ||
        card.card_sets?.some(set => set.set_rarity === ownedFilterRarity);

      // Additional rarity filter for wishlist tab
      const matchesWishlistRarity = activeTab !== 'wishlist' || wishlistFilterRarity === 'Tous' ||
        card.card_sets?.some(set => set.set_rarity === wishlistFilterRarity);

      return matchesSearch && matchesType && matchesRace && matchesArchetype && matchesSet && matchesRarity && matchesOwnership && matchesOwnedRarity && matchesWishlistRarity;
    });

    // Sort owned and wishlist cards
    if (activeTab === 'owned' || activeTab === 'wishlist') {
      filtered = filtered.sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'type') {
          return translateText(a.type, typeTranslations, language).localeCompare(translateText(b.type, typeTranslations, language));
        } else if (sortBy === 'rarity') {
          const rarityOrder = ['Common', 'Rare', 'Super Rare', 'Ultra Rare', 'Secret Rare', 'Ultimate Rare',
                              'Ghost Rare', 'Starlight Rare', "Collector's Rare", 'Prismatic Secret Rare',
                              'Quarter Century Secret Rare'];
          const getRarityScore = (card: YuGiOhCard) => {
            const rarities = card.card_sets?.map(set => set.set_rarity) || [];
            const maxRarity = rarities.reduce((max, rarity) => {
              const scoreA = rarityOrder.indexOf(rarity);
              const scoreB = rarityOrder.indexOf(max);
              return scoreA > scoreB ? rarity : max;
            }, 'Common');
            return rarityOrder.indexOf(maxRarity);
          };
          return getRarityScore(b) - getRarityScore(a);
        }
        return 0;
      });
    }

    return filtered;
  }, [cards, searchTerm, filterType, filterRace, filterArchetype, filterSet, filterRarity, showOnlyMissing, ownedCards, wishlistCards, activeTab, sortBy, ownedFilterRarity, wishlistFilterRarity]);

  const toggleCard = (cardId: number) => {
    setOwnedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
        // Also remove rarities and quantities when removing card
        setOwnedRarities(prevRarities => {
          const newRarities = new Map(prevRarities);
          newRarities.delete(cardId);
          return newRarities;
        });
        setOwnedQuantities(prevQuantities => {
          const newQuantities = new Map(prevQuantities);
          newQuantities.delete(cardId);
          return newQuantities;
        });
      } else {
        newSet.add(cardId);
        // Initialize quantity to 1 when adding a card
        setOwnedQuantities(prevQuantities => {
          const newQuantities = new Map(prevQuantities);
          newQuantities.set(cardId, 1);
          return newQuantities;
        });
      }
      return newSet;
    });
  };

  const incrementQuantity = (cardId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOwnedQuantities(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(cardId) || 1;
      newMap.set(cardId, current + 1);
      return newMap;
    });
    // Ensure the card is marked as owned
    if (!ownedCards.has(cardId)) {
      setOwnedCards(prev => new Set(prev).add(cardId));
    }
  };

  const decrementQuantity = (cardId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOwnedQuantities(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(cardId) || 1;
      if (current > 1) {
        newMap.set(cardId, current - 1);
      }
      // Keep minimum quantity at 1
      return newMap;
    });
  };

  const getCardPriceUrl = (cardName: string) => {
    // Utiliser CardMarket (site européen populaire pour les cartes Yu-Gi-Oh)
    const encodedName = encodeURIComponent(cardName);
    return `https://www.cardmarket.com/fr/YuGiOh/Products/Search?searchString=${encodedName}`;
  };

  const openPriceLink = (cardName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getCardPriceUrl(cardName), '_blank', 'noopener,noreferrer');
  };

  const toggleRarity = (cardId: number, rarity: string, e: React.MouseEvent) => {
    e.stopPropagation();

    setOwnedRarities(prev => {
      const newMap = new Map(prev);
      const cardRarities = newMap.get(cardId) || new Set();
      const newRarities = new Set(cardRarities);

      if (newRarities.has(rarity)) {
        newRarities.delete(rarity);
      } else {
        newRarities.add(rarity);
      }

      if (newRarities.size === 0) {
        newMap.delete(cardId);
      } else {
        newMap.set(cardId, newRarities);
      }

      return newMap;
    });

    // Auto-mark card as owned when selecting a rarity
    if (!ownedCards.has(cardId)) {
      setOwnedCards(prev => new Set(prev).add(cardId));
    }
  };

  const toggleWishlist = (cardId: number) => {
    setWishlistCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
        // Also remove rarities when removing from wishlist
        setWishlistRarities(prevRarities => {
          const newRarities = new Map(prevRarities);
          newRarities.delete(cardId);
          return newRarities;
        });
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const toggleWishlistRarity = (cardId: number, rarity: string, e: React.MouseEvent) => {
    e.stopPropagation();

    setWishlistRarities(prev => {
      const newMap = new Map(prev);
      const cardRarities = newMap.get(cardId) || new Set();
      const newRarities = new Set(cardRarities);

      if (newRarities.has(rarity)) {
        newRarities.delete(rarity);
      } else {
        newRarities.add(rarity);
      }

      if (newRarities.size === 0) {
        newMap.delete(cardId);
      } else {
        newMap.set(cardId, newRarities);
      }

      return newMap;
    });

    // Auto-mark card as in wishlist when selecting a rarity
    if (!wishlistCards.has(cardId)) {
      setWishlistCards(prev => new Set(prev).add(cardId));
    }
  };

  const stats = useMemo(() => {
    let totalRarities = 0;
    ownedRarities.forEach(rarities => {
      totalRarities += rarities.size;
    });

    let totalWishlistRarities = 0;
    wishlistRarities.forEach(rarities => {
      totalWishlistRarities += rarities.size;
    });

    let totalPhysicalCards = 0;
    ownedQuantities.forEach(quantity => {
      totalPhysicalCards += quantity;
    });

    return {
      total: cards.length,
      owned: ownedCards.size,
      wishlist: wishlistCards.size,
      percentage: cards.length > 0 ? Math.round((ownedCards.size / cards.length) * 100) : 0,
      totalRarities,
      totalWishlistRarities,
      totalPhysicalCards
    };
  }, [cards.length, ownedCards.size, wishlistCards.size, ownedRarities, wishlistRarities, ownedQuantities]);

  const getTypeColor = (type: string) => {
    if (type.includes('Monster')) return 'bg-orange-50 border-orange-300';
    if (type.includes('Spell')) return 'bg-emerald-50 border-emerald-300';
    if (type.includes('Trap')) return 'bg-pink-50 border-pink-300';
    return 'bg-gray-50 border-gray-300';
  };

  const getAttributeColor = (attribute?: string) => {
    switch (attribute?.toUpperCase()) {
      case 'DARK': return 'bg-purple-100 text-purple-700';
      case 'LIGHT': return 'bg-yellow-100 text-yellow-700';
      case 'WATER': return 'bg-blue-100 text-blue-700';
      case 'FIRE': return 'bg-red-100 text-red-700';
      case 'EARTH': return 'bg-amber-100 text-amber-700';
      case 'WIND': return 'bg-green-100 text-green-700';
      case 'DIVINE': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="flex items-center gap-3 mb-2">
                <Star className="w-10 h-10 text-amber-500 fill-amber-500" />
                <span className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Checklist Yu-Gi-Oh!
                </span>
              </h1>
              <p className="text-gray-600 ml-13 text-sm md:text-base">Suivez votre collection de cartes</p>
            </div>
            <div className="flex gap-2 items-center">
              {/* Bouton de sauvegarde cloud manuelle */}
              {userPin && (
                <CloudSaveButton
                  syncStatus={syncStatus}
                  hasUnsavedChanges={hasUnsavedChanges}
                  onManualSave={handleManualSave}
                />
              )}

              {/* Bouton connexion PIN */}
              <div className="relative">
                {userPin ? (
                  <button
                    onClick={() => setShowUserMenu((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    title="Synchronisation active"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Key className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:inline text-sm text-gray-700 font-medium font-mono">
                      PIN {userPin.substring(0, 3)}***
                    </span>
                    {syncStatus === 'syncing' && <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />}
                    {syncStatus === 'synced' && <Cloud className="w-3.5 h-3.5 text-green-500" />}
                    {syncStatus === 'error' && <CloudOff className="w-3.5 h-3.5 text-red-500" />}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPinAuth(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                    title="Activer la synchronisation cloud"
                  >
                    <Key className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-medium">Cloud</span>
                  </button>
                )}

                {/* Menu utilisateur */}
                {showUserMenu && userPin && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Key className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">Synchronisation Cloud</p>
                        <p className="text-xs text-gray-500 font-mono">PIN: {userPin}</p>
                      </div>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-xs text-gray-500 pb-2">
                      {syncStatus === 'synced' && <><Cloud className="w-3.5 h-3.5 text-green-500" /> Sauvegarde en ligne active</>}
                      {syncStatus === 'syncing' && <><Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" /> Synchronisation…</>}
                      {syncStatus === 'error' && <><CloudOff className="w-3.5 h-3.5 text-red-500" /> Erreur de sync</>}
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                      <p className="text-xs text-blue-900">
                        💡 Notez votre code PIN pour accéder à votre collection depuis n'importe quel appareil.
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnecter
                    </button>
                  </div>
                )}
              </div>

              {/* Sélecteur de langue */}
              <LanguageSwitcher variant="light" />

              {/* Bouton Contact Reddit */}
              <a
                href="https://www.reddit.com/u/KoperShuFF"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md"
                title="Contactez-moi pour signaler un bug ou suggérer une amélioration"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">Contact</span>
              </a>

              {!isInstalled && (
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                  title="Installer l'application"
                >
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline">Installer l'app</span>
                </button>
              )}
              <button
                onClick={() => {
                  setShowNewCardsNotif(false);
                  setNewCardsCount(0);
                  fetchCards(false);
                }}
                disabled={loading}
                className="relative flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualiser</span>
                {newCardsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {newCardsCount > 99 ? '99+' : newCardsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Chargement des cartes...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <p className="text-red-700 font-medium mb-2">Erreur de chargement</p>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => fetchCards(false)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1.5 sm:p-2 mb-6">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-base font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Toutes les cartes</span>
              <span className="sm:hidden">Toutes</span>
            </button>
            <button
              onClick={() => setActiveTab('owned')}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-base font-medium transition-all ${
                activeTab === 'owned'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden md:inline">Possédées ({ownedCards.size})</span>
              <span className="md:hidden">({ownedCards.size})</span>
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-base font-medium transition-all ${
                activeTab === 'wishlist'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden md:inline">Souhaits ({wishlistCards.size})</span>
              <span className="md:hidden">({wishlistCards.size})</span>
            </button>
          </div>
        </div>

        {/* Info optimisation Firebase (uniquement si connecté) */}
        {userPin && (
          <FirebaseOptimizationInfo />
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Total de cartes</div>
            <div className="text-xl sm:text-3xl font-bold text-gray-900">{stats.total}</div>
            {lastUpdateTime && (
              <div className="text-[10px] text-gray-400 mt-1">
                MAJ: {lastUpdateTime.split(' ')[1]}
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-3 sm:p-6">
            <div className="text-xs sm:text-sm text-green-600 mb-1">Cartes uniques</div>
            <div className="text-xl sm:text-3xl font-bold text-green-600">{stats.owned}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-emerald-200 p-3 sm:p-6">
            <div className="text-xs sm:text-sm text-emerald-600 mb-1">Cartes physiques</div>
            <div className="text-xl sm:text-3xl font-bold text-emerald-600">{stats.totalPhysicalCards}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-purple-200 p-3 sm:p-6">
            <div className="text-xs sm:text-sm text-purple-600 mb-1">Raretés possédées</div>
            <div className="text-xl sm:text-3xl font-bold text-purple-600">{stats.totalRarities}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-pink-200 p-3 sm:p-6">
            <div className="text-xs sm:text-sm text-pink-600 mb-1">Liste de souhaits</div>
            <div className="text-xl sm:text-3xl font-bold text-pink-600">{stats.wishlist}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-rose-200 p-3 sm:p-6">
            <div className="text-xs sm:text-sm text-rose-600 mb-1">Raretés souhaitées</div>
            <div className="text-xl sm:text-3xl font-bold text-rose-600">{stats.totalWishlistRarities}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-indigo-200 p-3 sm:p-6">
            <div className="text-xs sm:text-sm text-indigo-600 mb-1">Progression</div>
            <div className="flex items-baseline gap-2">
              <div className="text-xl sm:text-3xl font-bold text-indigo-600">{stats.percentage}%</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nom de la carte..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {availableTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Race Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Race/Catégorie</label>
              <select
                value={filterRace}
                onChange={(e) => setFilterRace(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {availableRaces.map(race => (
                  <option key={race} value={race}>{race}</option>
                ))}
              </select>
            </div>

            {/* Archetype Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Archétype/Deck</label>
              <select
                value={filterArchetype}
                onChange={(e) => setFilterArchetype(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {availableArchetypes.map(archetype => (
                  <option key={archetype} value={archetype}>{archetype}</option>
                ))}
              </select>
            </div>

            {/* Set Filter */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Extension</label>
              <select
                value={filterSet}
                onChange={(e) => setFilterSet(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {availableSets.map(set => (
                  <option key={set} value={set}>{set}</option>
                ))}
              </select>
            </div>

            {/* Rarity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rareté</label>
              <select
                value={filterRarity}
                onChange={(e) => setFilterRarity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {availableRarities.map(rarity => (
                  <option key={rarity} value={rarity}>
                    {rarity === 'Tous' ? 'Tous' : (rarityTranslations[rarity] || rarity)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={showOnlyMissing}
                onChange={(e) => setShowOnlyMissing(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Afficher uniquement les cartes manquantes</span>
            </label>
          </div>
        </div>

        {/* Owned Cards Controls */}
        {activeTab === 'owned' && (
          <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <List className="w-5 h-5 text-green-700" />
              <h2 className="text-lg font-semibold text-green-900">Options de tri et filtrage</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-green-800 mb-2">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'type' | 'rarity')}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                >
                  <option value="name">Nom (A-Z)</option>
                  <option value="type">Type</option>
                  <option value="rarity">Rareté (plus rare en premier)</option>
                </select>
              </div>

              {/* Rarity Filter for Owned */}
              <div>
                <label className="block text-sm font-medium text-green-800 mb-2">Filtrer par rareté</label>
                <select
                  value={ownedFilterRarity}
                  onChange={(e) => setOwnedFilterRarity(e.target.value)}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                >
                  {availableRarities.map(rarity => (
                    <option key={rarity} value={rarity}>
                      {rarity === 'Tous' ? 'Toutes les raretés' : (rarityTranslations[rarity] || rarity)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
              <div className="text-sm text-green-700">
                <span className="font-semibold">{filteredCards.length}</span> carte{filteredCards.length > 1 ? 's' : ''} affichée{filteredCards.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Controls */}
        {activeTab === 'wishlist' && (
          <div className="bg-pink-50 rounded-xl shadow-sm border border-pink-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-pink-700" />
              <h2 className="text-lg font-semibold text-pink-900">Options de tri et filtrage</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-pink-800 mb-2">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'type' | 'rarity')}
                  className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none bg-white"
                >
                  <option value="name">Nom (A-Z)</option>
                  <option value="type">Type</option>
                  <option value="rarity">Rareté (plus rare en premier)</option>
                </select>
              </div>

              {/* Rarity Filter for Wishlist */}
              <div>
                <label className="block text-sm font-medium text-pink-800 mb-2">Filtrer par rareté</label>
                <select
                  value={wishlistFilterRarity}
                  onChange={(e) => setWishlistFilterRarity(e.target.value)}
                  className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none bg-white"
                >
                  {availableRarities.map(rarity => (
                    <option key={rarity} value={rarity}>
                      {rarity === 'Tous' ? 'Toutes les raretés' : (rarityTranslations[rarity] || rarity)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded-lg border border-pink-200">
              <div className="text-sm text-pink-700">
                <span className="font-semibold">{filteredCards.length}</span> carte{filteredCards.length > 1 ? 's' : ''} affichée{filteredCards.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(activeTab === 'owned' || activeTab === 'wishlist' ? filteredCards : filteredCards.slice(0, 100)).map(card => {
            const isOwned = ownedCards.has(card.id);
            const isWishlisted = wishlistCards.has(card.id);
            const isMonster = card.type.includes('Monster');
            return (
              <div
                key={card.id}
                className={`
                  relative bg-white rounded-xl border-2 shadow-sm p-4 transition-all hover:shadow-md
                  ${getTypeColor(card.type)}
                `}
              >
                {/* Top Left - Wishlist Heart */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(card.id);
                  }}
                  className={`absolute top-3 left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 ${
                    isWishlisted ? 'bg-pink-500' : 'bg-gray-200 hover:bg-pink-300'
                  }`}
                  title={isWishlisted ? 'Retirer de la liste de souhaits' : 'Ajouter à la liste de souhaits'}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'text-white fill-white' : 'text-gray-500'}`} strokeWidth={2} />
                  {isWishlisted && wishlistRarities.get(card.id) && wishlistRarities.get(card.id)!.size > 0 && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white">
                      {wishlistRarities.get(card.id)!.size}
                    </div>
                  )}
                </button>

                {/* Top Right - Owned Checkmark */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCard(card.id);
                  }}
                  className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 ${
                    isOwned ? 'bg-green-500' : 'bg-gray-200 hover:bg-green-300'
                  }`}
                  title={isOwned ? 'Retirer des cartes possédées' : 'Marquer comme possédée'}
                >
                  <Check className={`w-5 h-5 ${isOwned ? 'text-white' : 'text-gray-500'}`} strokeWidth={3} />
                  {isOwned && ownedRarities.get(card.id) && ownedRarities.get(card.id)!.size > 0 && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white">
                      {ownedRarities.get(card.id)!.size}
                    </div>
                  )}
                </button>

                {/* Card Image */}
                <div className="relative mb-3">
                  {card.card_images?.[0] && (
                    <CardImage
                      cardId={card.id}
                      cardName={card.name}
                      imageUrl={card.card_images[0].image_url}
                      imageUrlSmall={card.card_images[0].image_url_small}
                      className="w-full h-48 object-contain rounded-lg"
                    />
                  )}
                  {/* Price Link Icon */}
                  <button
                    onClick={(e) => openPriceLink(card.name, e)}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all border-2 border-white"
                    title="Voir le prix sur CardMarket"
                  >
                    <DollarSign className="w-5 h-5 text-white" strokeWidth={3} />
                  </button>
                </div>

                {/* Card Info */}
                <div className="mb-3">
                  <h3 className="font-bold text-base text-gray-900 mb-1 pr-10 line-clamp-2">{card.name}</h3>
                  <p className="text-xs text-gray-600 line-clamp-3">{card.desc}</p>
                </div>

                {/* Quantity Counter */}
                {isOwned && (
                  <div className="mb-3 flex items-center justify-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-2">
                    <button
                      onClick={(e) => decrementQuantity(card.id, e)}
                      className="w-7 h-7 rounded-full bg-white border-2 border-green-500 flex items-center justify-center hover:bg-green-50 transition-colors"
                      title="Diminuer la quantité"
                    >
                      <Minus className="w-4 h-4 text-green-600" strokeWidth={3} />
                    </button>
                    <div className="flex items-center gap-1.5 px-3">
                      <span className="text-sm font-semibold text-green-700">Quantité:</span>
                      <span className="text-lg font-bold text-green-600">{ownedQuantities.get(card.id) || 1}</span>
                    </div>
                    <button
                      onClick={(e) => incrementQuantity(card.id, e)}
                      className="w-7 h-7 rounded-full bg-white border-2 border-green-500 flex items-center justify-center hover:bg-green-50 transition-colors"
                      title="Augmenter la quantité"
                    >
                      <Plus className="w-4 h-4 text-green-600" strokeWidth={3} />
                    </button>
                  </div>
                )}

                {/* Stats for Monsters */}
                {isMonster && (
                  <div className="flex flex-wrap gap-2 mb-3 text-xs">
                    {card.atk !== undefined && (
                      <div className="bg-white/70 px-2 py-1 rounded border border-gray-200">
                        <span className="text-gray-500">ATK:</span>{' '}
                        <span className="font-semibold text-gray-900">{card.atk}</span>
                      </div>
                    )}
                    {card.def !== undefined && (
                      <div className="bg-white/70 px-2 py-1 rounded border border-gray-200">
                        <span className="text-gray-500">DEF:</span>{' '}
                        <span className="font-semibold text-gray-900">{card.def}</span>
                      </div>
                    )}
                    {card.level !== undefined && (
                      <div className="bg-white/70 px-2 py-1 rounded border border-gray-200">
                        <span className="text-gray-500">★</span>{' '}
                        <span className="font-semibold text-gray-900">{card.level}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Type and Attribute */}
                <div className="flex flex-wrap gap-2 text-xs mb-2">
                  {card.race && (
                    <span className="px-2 py-1 bg-white/70 border border-gray-300 rounded font-medium text-gray-700">
                      {translateText(card.race, raceTranslations, language)}
                    </span>
                  )}
                  {card.attribute && (
                    <span className={`px-2 py-1 rounded font-medium ${getAttributeColor(card.attribute)}`}>
                      {translateText(card.attribute, attributeTranslations, language)}
                    </span>
                  )}
                </div>

                {/* Archetype */}
                {card.archetype && (
                  <div className="text-xs mb-2">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded font-medium">
                      {card.archetype}
                    </span>
                  </div>
                )}

                {/* Rarities - Show unique rarities */}
                {card.card_sets && card.card_sets.length > 0 && (() => {
                  const uniqueRarities = Array.from(new Set(card.card_sets.map(s => s.set_rarity)));

                  return (
                    <div className="text-xs border-t border-gray-200 pt-2 mt-2">
                      <div className="font-medium mb-2 text-gray-600 flex items-center justify-between">
                        <span>Raretés disponibles:</span>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <span className="flex items-center gap-0.5">
                            <Heart className="w-3 h-3 text-pink-600" />
                            Souhaits
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                            Possédées
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {uniqueRarities.map((rarity, idx) => {
                          const hasOwnedRarity = ownedRarities.get(card.id)?.has(rarity) || false;
                          const hasWishlistRarity = wishlistRarities.get(card.id)?.has(rarity) || false;

                          return (
                            <div key={idx} className={`flex items-center gap-1 px-2 py-1 rounded ${getRarityStyle(rarity)}`}>
                              <span className="text-[10px] font-semibold">
                                {rarityTranslations[rarity] || rarity}
                              </span>
                              <div className="flex items-center gap-0.5 ml-1">
                                {/* Wishlist Heart */}
                                <button
                                  onClick={(e) => toggleWishlistRarity(card.id, rarity, e)}
                                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                                    hasWishlistRarity ? 'bg-pink-600' : 'bg-white/70 hover:bg-pink-200'
                                  }`}
                                  title={hasWishlistRarity ? 'Retirer des souhaits' : 'Ajouter aux souhaits'}
                                >
                                  <Heart className={`w-2.5 h-2.5 ${hasWishlistRarity ? 'text-white fill-white' : 'text-pink-600'}`} strokeWidth={2} />
                                </button>
                                {/* Owned Check */}
                                <button
                                  onClick={(e) => toggleRarity(card.id, rarity, e)}
                                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                                    hasOwnedRarity ? 'bg-green-600' : 'bg-white/70 hover:bg-green-200'
                                  }`}
                                  title={hasOwnedRarity ? 'Retirer des possédées' : 'Marquer comme possédée'}
                                >
                                  <Check className={`w-2.5 h-2.5 ${hasOwnedRarity ? 'text-white' : 'text-green-600'}`} strokeWidth={3} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>

        {/* Showing limited results */}
        {activeTab === 'all' && filteredCards.length > 100 && (
          <div className="mt-6 text-center bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600">
              Affichage de 100 cartes sur {filteredCards.length} résultats.{' '}
              <span className="text-indigo-600 font-medium">
                Affinez votre recherche pour voir plus de cartes spécifiques.
              </span>
            </p>
          </div>
        )}

        {/* Tips Section */}
        {activeTab === 'all' && filteredCards.length > 0 && (
          <div className="mt-6 space-y-3">
            {/* Control Tips */}
            <div className="text-center bg-gradient-to-r from-pink-50 to-green-50 rounded-xl border border-gray-200 p-3 sm:p-4">
              <p className="text-gray-700 text-xs sm:text-sm flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-600 fill-pink-600" />
                  <span><strong>Cœur</strong> : Souhaits</span>
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" strokeWidth={3} />
                  <span><strong>Coche</strong> : Possédée</span>
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" strokeWidth={3} />
                  <span><strong>Prix</strong> : Valeur</span>
                </span>
              </p>
            </div>

            {/* PWA Install Tip - Only show if not installed */}
            {!isInstalled && (
              <div className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-3 sm:p-4">
                <p className="text-indigo-700 text-xs sm:text-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>
                    💡 <strong>Astuce :</strong> Installez cette app sur votre mobile pour un accès rapide et hors ligne !
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {filteredCards.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">Aucune carte ne correspond à vos critères de recherche.</p>
          </div>
        )}
        </>
        )}
      </div>

      {/* Modal d'authentification PIN */}
      {showPinAuth && <PinAuth onLogin={handlePinLogin} onClose={() => setShowPinAuth(false)} />}

      {/* Debug Firestore - Appuyez sur Shift+D pour afficher/masquer */}
      {typeof window !== 'undefined' && window.location.search.includes('debug') && <FirestoreDebug />}

      {/* Notification de nouvelles cartes */}
      {showNewCardsNotif && newCardsCount > 0 && (
        <div
          className="fixed top-4 right-4 z-50 transition-all duration-300 ease-out"
          style={{
            animation: 'slideInRight 0.5s ease-out'
          }}
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-2xl p-4 flex items-start gap-3 max-w-sm border-2 border-green-400">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-white fill-white animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">🎉 Nouvelles cartes !</h3>
              <p className="text-sm text-green-50 mb-2">
                <span className="font-semibold text-white">{newCardsCount}</span> nouvelle{newCardsCount > 1 ? 's' : ''} carte{newCardsCount > 1 ? 's' : ''} disponible{newCardsCount > 1 ? 's' : ''} dans la base de données.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowNewCardsNotif(false);
                    setNewCardsCount(0);
                    fetchCards(false);
                  }}
                  className="text-xs bg-white text-green-600 font-semibold hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors shadow-md"
                >
                  Voir les cartes
                </button>
                <button
                  onClick={() => setShowNewCardsNotif(false)}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Plus tard
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowNewCardsNotif(false)}
              className="text-white/80 hover:text-white transition-colors mt-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Modal d'installation manuelle */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowInstallModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Installer l'application</h2>
                <p className="text-xs text-gray-500">Accès rapide depuis votre écran d'accueil</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 font-medium">Sur iPhone / iPad :</p>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Appuyez sur le bouton <strong>Partager</strong> (carré avec flèche vers le haut) dans Safari</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Faites défiler et appuyez sur <strong>« Sur l'écran d'accueil »</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Appuyez sur <strong>Ajouter</strong> en haut à droite</span>
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 font-medium">Sur Android / Chrome :</p>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Ouvrez le menu Chrome (<strong>⋮</strong> en haut à droite)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Appuyez sur <strong>« Ajouter à l'écran d'accueil »</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Confirmez en appuyant sur <strong>Ajouter</strong></span>
                  </li>
                </ol>
              </div>
            )}

            <button
              onClick={() => setShowInstallModal(false)}
              className="mt-5 w-full py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Compris !
            </button>
          </div>
        </div>
      )}
    </div>
  );
}