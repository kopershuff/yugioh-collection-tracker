import { useState } from 'react';
import { Bug, Loader2 } from 'lucide-react';
import { loadFromCloudWithPin } from '../../pin-auth';

export function FirestoreDebug() {
  const [pin, setPin] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testLoad = async () => {
    if (!pin || pin.length !== 6) {
      setError('Entrez un PIN à 6 chiffres');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      const result = await loadFromCloudWithPin(pin);
      console.log('Test Firestore - Résultat:', result);
      setData(result);
      if (!result) {
        setError('Aucune donnée trouvée pour ce PIN');
      }
    } catch (err: any) {
      console.error('Test Firestore - Erreur:', err);
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-xl shadow-2xl border-2 border-purple-500 p-4 z-40 max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <Bug className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold text-purple-900">Test Firestore</h3>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Code PIN"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />

        <button
          onClick={testLoad}
          disabled={loading}
          className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Tester le chargement
        </button>

        {error && (
          <div className="bg-red-50 border border-red-300 rounded p-2">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {data && (
          <div className="bg-green-50 border border-green-300 rounded p-2">
            <p className="text-xs font-semibold text-green-900 mb-1">Données trouvées :</p>
            <div className="text-xs text-green-800 font-mono">
              <div>Cartes possédées: {(data.ownedCards as any[])?.length || 0}</div>
              <div>Wishlist: {(data.wishlistCards as any[])?.length || 0}</div>
              <div>lastSync: {data.lastSync ? new Date(data.lastSync).toLocaleString() : 'N/A'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
