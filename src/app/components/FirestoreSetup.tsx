import { AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export function FirestoreSetup() {
  const [copied, setCopied] = useState(false);

  const firestoreRules = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre l'accès anonyme à la collection "collections"
    match /collections/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`;

  const copyRules = async () => {
    try {
      await navigator.clipboard.writeText(firestoreRules);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur de copie', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900 mb-1">
              Configuration Firestore requise
            </h2>
            <p className="text-sm text-gray-600">
              L'authentification anonyme doit être activée pour permettre la synchronisation
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Accédez à Firebase Console
              </h3>
              <a
                href="https://console.firebase.google.com/project/yu-gi-oh-checklist/authentication/providers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Firebase Authentication
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Activez l'authentification anonyme
              </h3>
              <p className="text-sm text-gray-600">
                Dans l'onglet "Sign-in method", activez le fournisseur <strong>"Anonymous"</strong>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Configurez les règles Firestore
              </h3>
              <a
                href="https://console.firebase.google.com/project/yu-gi-oh-checklist/firestore/rules"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline mb-2"
              >
                Firestore Rules
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-sm text-gray-600 mb-2">
                Copiez et collez ces règles :
              </p>
              <div className="relative bg-gray-900 rounded-lg p-3">
                <pre className="text-xs text-green-400 font-mono overflow-x-auto whitespace-pre">
                  {firestoreRules}
                </pre>
                <button
                  onClick={copyRules}
                  className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white rounded text-xs font-medium hover:bg-gray-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copier
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Publiez les règles
              </h3>
              <p className="text-sm text-gray-600">
                Cliquez sur <strong>"Publier"</strong> pour appliquer les nouvelles règles
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <h3 className="font-semibold text-blue-900 mb-2 text-sm">
            📌 Note importante
          </h3>
          <p className="text-xs text-blue-800">
            Ces règles permettent à tout utilisateur authentifié anonymement de lire et écrire dans la collection "collections".
            Votre code PIN à 6 chiffres sert d'identifiant unique pour votre collection.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
        >
          J'ai configuré, recharger la page
        </button>
      </div>
    </div>
  );
}
