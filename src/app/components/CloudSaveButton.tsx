import { useState, useEffect } from 'react';
import { Cloud, CloudOff, Check, Loader2 } from 'lucide-react';

interface CloudSaveButtonProps {
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  hasUnsavedChanges: boolean;
  onManualSave: () => void;
}

export function CloudSaveButton({ syncStatus, hasUnsavedChanges, onManualSave }: CloudSaveButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (syncStatus === 'idle') return null;

  return (
    <div className="relative">
      <button
        onClick={onManualSave}
        disabled={syncStatus === 'syncing' || !hasUnsavedChanges}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          hasUnsavedChanges
            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            : syncStatus === 'synced'
            ? 'bg-green-100 text-green-700'
            : syncStatus === 'error'
            ? 'bg-red-100 text-red-700'
            : 'bg-gray-100 text-gray-500'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {syncStatus === 'syncing' && <Loader2 className="w-4 h-4 animate-spin" />}
        {syncStatus === 'synced' && !hasUnsavedChanges && <Check className="w-4 h-4" />}
        {syncStatus === 'error' && <CloudOff className="w-4 h-4" />}
        {hasUnsavedChanges && <Cloud className="w-4 h-4" />}

        <span className="text-xs font-medium hidden sm:inline">
          {syncStatus === 'syncing' && 'Sauvegarde...'}
          {syncStatus === 'synced' && !hasUnsavedChanges && 'Sauvegardé'}
          {syncStatus === 'error' && 'Erreur'}
          {hasUnsavedChanges && 'Sauvegarder'}
        </span>
      </button>

      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-50">
          {hasUnsavedChanges
            ? 'Cliquez pour sauvegarder manuellement dans le cloud'
            : 'Toutes les modifications sont sauvegardées'}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
