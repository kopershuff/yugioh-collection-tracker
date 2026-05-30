import { useState } from 'react';
import { Key, Loader2, Copy, Check, X } from 'lucide-react';
import { generatePin, checkPinExists } from '../../pin-auth';
import { FirestoreSetup } from './FirestoreSetup';

interface PinAuthProps {
  onLogin: (pin: string) => void;
  onClose?: () => void;
}

export function PinAuth({ onLogin, onClose }: PinAuthProps) {
  const [mode, setMode] = useState<'choice' | 'login' | 'create'>('choice');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedPin, setGeneratedPin] = useState('');
  const [copied, setCopied] = useState(false);
  const [showFirestoreSetup, setShowFirestoreSetup] = useState(false);

  const handleCreatePin = () => {
    const newPin = generatePin();
    setGeneratedPin(newPin);
    setMode('create');
  };

  const handleConfirmCreate = async () => {
    setLoading(true);
    setError('');
    try {
      // Vérifier que le PIN n'existe pas déjà (très peu probable)
      const exists = await checkPinExists(generatedPin);
      if (exists) {
        setError('Ce PIN existe déjà, réessayez');
        handleCreatePin();
        return;
      }
      onLogin(generatedPin);
    } catch (err: any) {
      console.error('Erreur création PIN:', err);
      if (err.code === 'permission-denied' || err.message?.includes('permission') || err.message?.includes('PERMISSION_DENIED')) {
        setShowFirestoreSetup(true);
      } else {
        setError(`Erreur: ${err.message || 'Problème de connexion au serveur'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (pin.length !== 6) {
      setError('Le code PIN doit contenir 6 chiffres');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const exists = await checkPinExists(pin);
      if (!exists) {
        setError('Aucune collection trouvée avec ce code PIN');
        setLoading(false);
        return;
      }
      onLogin(pin);
    } catch (err: any) {
      console.error('Erreur connexion PIN:', err);
      if (err.code === 'permission-denied' || err.message?.includes('permission') || err.message?.includes('PERMISSION_DENIED')) {
        setShowFirestoreSetup(true);
      } else {
        setError(`Erreur: ${err.message || 'Problème de connexion au serveur'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyPin = async () => {
    try {
      await navigator.clipboard.writeText(generatedPin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur de copie', err);
    }
  };

  if (showFirestoreSetup) {
    return <FirestoreSetup />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Key className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900">
              Synchronisation Cloud
            </h2>
            <p className="text-sm text-gray-600">
              Sauvegardez votre collection en ligne
            </p>
          </div>
        </div>

        {mode === 'choice' && (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-900">
                💡 <strong>Comment ça marche ?</strong>
              </p>
              <p className="text-xs text-blue-800 mt-2">
                Créez un code PIN à 6 chiffres pour sauvegarder votre collection dans le cloud.
                Utilisez ce même code sur n'importe quel appareil pour retrouver vos données.
              </p>
            </div>

            <button
              onClick={handleCreatePin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <Key className="w-5 h-5" />
              Créer un nouveau code PIN
            </button>

            <button
              onClick={() => setMode('login')}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              J'ai déjà un code PIN
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="w-full px-6 py-3 text-gray-500 text-sm hover:text-gray-700 transition-colors"
              >
                Continuer sans synchronisation
              </button>
            )}
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 text-center">
              <p className="text-sm font-semibold text-green-900 mb-3">
                🎉 Votre code PIN personnel
              </p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="text-4xl font-bold text-green-700 tracking-wider font-mono bg-white px-6 py-3 rounded-lg border-2 border-green-400 shadow-md">
                  {generatedPin}
                </div>
                <button
                  onClick={copyPin}
                  className="w-10 h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  title="Copier le code"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-green-800">
                ⚠️ <strong>Notez ce code précieusement !</strong><br />
                Il vous permettra d'accéder à votre collection depuis n'importe quel appareil.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={handleConfirmCreate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              J'ai noté mon code, continuer
            </button>

            <button
              onClick={() => setMode('choice')}
              className="w-full px-6 py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Retour
            </button>
          </div>
        )}

        {mode === 'login' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entrez votre code PIN à 6 chiffres
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setPin(value);
                  setError('');
                }}
                placeholder="000000"
                className="w-full px-4 py-3 text-center text-2xl font-mono font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none tracking-wider"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || pin.length !== 6}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              Se connecter
            </button>

            <button
              onClick={() => setMode('choice')}
              className="w-full px-6 py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Retour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
