import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Key, Compass, Zap, Award, Flame, Plus } from 'lucide-react';
import type { ShopItem } from '../types/game';

interface OasisShopProps {
  coins: number;
  inventory: string[];
  shopItems: ShopItem[];
  onPurchaseItem: (id: string, cost: number) => void;
  onAddShopItem: (item: ShopItem) => void;
  playSound: (type: 'click' | 'xp' | 'levelup' | 'success' | 'purchase') => void;
}

export const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'copper_key',
    name: 'Llave de Cobre',
    description: 'La primera llave de James Halliday. Oculta en la Tumba de los Horrores.',
    cost: 100,
    iconName: 'key_copper',
    rarity: 'Común',
    unlocked: false,
  },
  {
    id: 'jade_key',
    name: 'Llave de Jade',
    description: 'La segunda llave. Escondida tras una partida perfecta de Zork.',
    cost: 500,
    iconName: 'key_jade',
    rarity: 'Raro',
    unlocked: false,
  },
  {
    id: 'crystal_key',
    name: 'Llave de Cristal',
    description: 'La llave final. Protegida por los caballeros de la música clásica y Rush.',
    cost: 1000,
    iconName: 'key_crystal',
    rarity: 'Épico',
    unlocked: false,
  },
  {
    id: 'extra_life',
    name: 'Moneda de Vida Extra',
    description: 'Una moneda de 25 centavos de 1981 ganada en un Pac-Man perfecto.',
    cost: 750,
    iconName: 'quarter',
    rarity: 'Épico',
    unlocked: false,
  },
  {
    id: 'delorean',
    name: 'DeLorean DMC-12',
    description: 'Vehículo insignia equipado con capacitor de flujo y circuitos temporales.',
    cost: 1500,
    iconName: 'car',
    rarity: 'Legendario',
    unlocked: false,
  },
  {
    id: 'gundam_mech',
    name: 'Robot Gigante RX-78-2',
    description: 'Meca de combate legendario desplegable para la batalla final contra IOI.',
    cost: 2500,
    iconName: 'robot',
    rarity: 'Legendario',
    unlocked: false,
  },
];

export const OasisShop: React.FC<OasisShopProps> = ({
  coins,
  inventory,
  shopItems,
  onPurchaseItem,
  onAddShopItem,
  playSound,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(150);
  const [rarity, setRarity] = useState<'Común' | 'Raro' | 'Épico' | 'Legendario'>('Común');
  const [imageFile, setImageFile] = useState<string>('');

  const handleBuy = (item: ShopItem) => {
    if (inventory.includes(item.id)) return;
    if (coins < item.cost) {
      playSound('click');
      alert("Créditos insuficientes en tu monedero del OASIS. Completa más misiones cotidianas.");
      return;
    }

    playSound('purchase');
    onPurchaseItem(item.id, item.cost);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB
      alert("La imagen excede el límite de 1MB. Por favor, selecciona una imagen de menor tamaño.");
      e.target.value = ''; // Reset uploader
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !imageFile) {
      alert("Por favor completa el nombre y selecciona una imagen para el premio.");
      return;
    }

    playSound('success');

    const newItem: ShopItem = {
      id: `custom_${Date.now()}`,
      name,
      description: description.trim() || 'Premio personalizado creado por el operador.',
      cost,
      iconName: 'custom_reward',
      rarity,
      unlocked: false,
      imageUrl: imageFile,
    };

    onAddShopItem(newItem);
    setName('');
    setDescription('');
    setCost(150);
    setRarity('Común');
    setImageFile('');
    setShowForm(false);
  };

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'Legendario':
        return 'border-yellow-500/40 text-yellow-400 bg-yellow-950/10';
      case 'Épico':
        return 'border-pink-500/40 text-pink-400 bg-pink-950/10';
      case 'Raro':
        return 'border-cyan-500/40 text-cyan-400 bg-cyan-950/10';
      default:
        return 'border-zinc-700 text-zinc-300 bg-zinc-900/10';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'Legendario':
        return 'bg-yellow-500 text-black';
      case 'Épico':
        return 'bg-pink-500 text-white';
      case 'Raro':
        return 'bg-cyan-500 text-black';
      default:
        return 'bg-zinc-700 text-white';
    }
  };

  const renderIcon = (iconName: string) => {
    const size = "w-10 h-10";
    if (iconName.startsWith('key_')) {
      let colorClass = "text-amber-500";
      if (iconName === 'key_jade') colorClass = "text-emerald-500 text-glow-green";
      if (iconName === 'key_crystal') colorClass = "text-cyan-400 text-glow-cyan animate-pulse";
      return <Key className={`${size} ${colorClass}`} />;
    }
    if (iconName === 'quarter') return <Compass className="w-10 h-10 text-yellow-400 text-glow-gold animate-spin" style={{ animationDuration: '6s' }} />;
    if (iconName === 'car') return <Zap className="w-10 h-10 text-cyan-400 text-glow-cyan animate-pulse" />;
    return <ShoppingBag className="w-10 h-10 text-pink-500 text-glow-pink" />;
  };

  return (
    <div className="space-y-6">
      {/* HUD Header */}
      <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4">
        <div>
          <h2 className="font-orbitron text-xl font-bold tracking-wider text-cyan-400 text-glow-cyan flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400 animate-pulse" />
            MERCADO DEL OASIS // TIENDA DIGITAL
          </h2>
          <p className="text-xs font-share text-cyan-300/60 mt-1">
            CANJEA TUS MONEDAS POR COLECCIONABLES DE COLECCIÓN Y LLAVES DE HALLIDAY
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { playSound('click'); setShowForm(!showForm); }}
            className="px-3 py-1.5 font-share font-bold text-xs bg-pink-950/40 border border-pink-500 hover:bg-pink-500 hover:text-black rounded text-pink-400 transition-all cursor-pointer uppercase tracking-wider"
          >
            {showForm ? 'Cancelar' : 'Crear Premio'}
          </button>
          <div className="py-1 px-4 bg-yellow-950/20 border border-yellow-500/30 rounded text-yellow-400 font-orbitron font-bold text-xs tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-yellow-400 animate-bounce" />
            MONEDERO: {coins} COINS
          </div>
        </div>
      </div>

      {/* Custom Reward Form */}
      {showForm && (
        <form onSubmit={handleCreateReward} className="glass-panel glow-pink rounded-xl p-5 border border-pink-500/20 space-y-4 max-w-xl mx-auto crt-flicker">
          <h3 className="font-orbitron font-bold text-xs text-pink-500 tracking-wider">CREAR PREMIO PERSONALIZADO</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-share text-cyan-400 uppercase tracking-widest mb-1">Nombre del Premio</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. Sesión de cine, Comprar un helado, 1 Hora de PS5"
                className="w-full px-3 py-2 bg-cyan-950/20 border border-cyan-500/30 rounded focus:border-cyan-400 text-cyan-100 font-share text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-share text-cyan-400 uppercase tracking-widest mb-1">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ingresa qué obtienes al reclamar este premio..."
                rows={2}
                className="w-full px-3 py-2 bg-cyan-950/20 border border-cyan-500/30 rounded focus:border-cyan-400 text-cyan-100 font-share text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-share text-cyan-400/80 uppercase mb-1">Costo en Monedas</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={cost}
                  onChange={(e) => setCost(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-cyan-950/20 border border-cyan-500/30 rounded text-cyan-100 font-share text-xs text-center focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-share text-cyan-400/80 uppercase mb-1">Rareza</label>
                <select
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-cyan-950/20 border border-cyan-500/30 rounded text-cyan-100 font-share text-xs focus:outline-none"
                >
                  <option value="Común">🟢 Común</option>
                  <option value="Raro">🔵 Raro</option>
                  <option value="Épico">🟣 Épico</option>
                  <option value="Legendario">🟡 Legendario</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-share text-cyan-400 uppercase tracking-widest mb-1">Cargar Imagen (Máx 1MB)</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleImageUpload}
                className="w-full px-3 py-2 bg-cyan-950/20 border border-cyan-500/30 rounded focus:border-cyan-400 text-cyan-100 font-share text-xs"
              />
              {imageFile && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg border border-pink-500/30 overflow-hidden flex items-center justify-center bg-black/40">
                    <img src={imageFile} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-share text-emerald-400">Imagen precargada correctamente.</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-orbitron font-black text-xs rounded tracking-widest uppercase transition-all hover:brightness-110 flex items-center justify-center gap-1.5 cursor-pointer border-0"
          >
            <Plus className="w-3.5 h-3.5" /> CREAR PREMIO EN EL OASIS
          </button>
        </form>
      )}

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopItems.map((item) => {
          const isUnlocked = inventory.includes(item.id);
          return (
            <div 
              key={item.id} 
              className={`glass-panel border rounded-xl p-5 flex flex-col justify-between hover:border-cyan-400 transition-all ${getRarityStyles(item.rarity)}`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="p-1.5 bg-black/40 border border-cyan-500/10 rounded-lg w-14 h-14 flex items-center justify-center overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      renderIcon(item.iconName)
                    )}
                  </div>
                  <span className={`text-[9px] font-share font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getRarityBadge(item.rarity)}`}>
                    {item.rarity}
                  </span>
                </div>

                <h3 className="font-orbitron font-bold text-sm tracking-wider mb-1 text-white">{item.name}</h3>
                <p className="font-share text-[11px] text-gray-300/80 leading-relaxed mb-4">{item.description}</p>
              </div>

              <div className="border-t border-cyan-500/10 pt-3 flex justify-between items-center">
                <span className="font-orbitron font-extrabold text-sm text-yellow-400 tracking-wider">
                  {isUnlocked ? 'ADQUIRIDO' : `${item.cost} Monedas`}
                </span>
                
                <button
                  disabled={isUnlocked}
                  onClick={() => handleBuy(item)}
                  className={`px-3 py-1.5 font-share font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer ${
                    isUnlocked
                      ? 'bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 opacity-60 cursor-default'
                      : 'bg-yellow-950/40 border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-400'
                  }`}
                >
                  {isUnlocked ? 'Desbloqueado' : 'Comprar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inventory Panel */}
      <div className="border-t border-cyan-500/20 pt-6">
        <h3 className="font-orbitron text-xs font-bold text-cyan-400 tracking-widest uppercase mb-4 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-cyan-400" />
          INVENTARIO ACTUAL DE PARZIVAL
        </h3>

        {inventory.length === 0 ? (
          <div className="glass-panel rounded-xl p-8 text-center text-gray-600 font-share border border-cyan-500/5">
            Tu mochila digital está vacía. ¡Reclama tu primera recompensa en el Mercado!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {inventory.map((itemId) => {
              const item = shopItems.find(i => i.id === itemId);
              if (!item) return null;
              return (
                <div 
                  key={itemId} 
                  className="py-1.5 px-3 bg-cyan-950/30 border border-cyan-500/40 rounded-lg flex items-center gap-2 font-share text-xs font-bold text-cyan-300 text-glow-cyan"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" style={{ animationDuration: '8s' }} />
                  {item.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
