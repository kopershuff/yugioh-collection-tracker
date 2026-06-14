import { Zap, Database, Users } from 'lucide-react';

export function FirebaseOptimizationInfo() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span>Application optimisée pour un usage gratuit</span>
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <Database className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Économies Firebase :</strong> Sauvegarde cloud toutes les 3 secondes d'inactivité au lieu de chaque modification (réduction de ~90% des écritures)
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Database className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Cache intelligent :</strong> Les données sont mises en cache pendant 5 minutes pour éviter les lectures répétées
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Usage gratuit :</strong> Avec ces optimisations, l'app peut supporter des centaines d'utilisateurs gratuitement
              </div>
            </div>
          </div>
          <div className="mt-3 bg-blue-100 rounded-lg p-3 text-xs text-blue-900">
            <strong>💡 Astuce :</strong> Vos données sont sauvegardées localement instantanément. La synchronisation cloud se fait automatiquement après 3 secondes, ou cliquez sur "Sauvegarder" pour forcer la sauvegarde immédiate.
          </div>
        </div>
      </div>
    </div>
  );
}
