import { Check, Star, Cloud, Download, Zap, Heart, Database, Users, Gift, Bell, Shield, Smartphone } from 'lucide-react';
import { Link } from 'react-router';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Star className="w-16 h-16 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              Yu-Gi-Oh! Collection Tracker
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Gérez votre collection de cartes Yu-Gi-Oh gratuitement avec plus de 12,000 cartes, synchronisation cloud et notifications automatiques
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/app"
                className="flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all shadow-2xl hover:scale-105"
              >
                <Zap className="w-6 h-6" />
                Commencer gratuitement
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border-2 border-white/30"
              >
                Découvrir les fonctionnalités
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-purple-100">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                100% Gratuit
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                Sans publicité
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                12,000+ cartes
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">12,000+</div>
              <div className="text-gray-600">Cartes disponibles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Gratuit</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">PWA</div>
              <div className="text-gray-600">Installable</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">Cloud</div>
              <div className="text-gray-600">Synchronisation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une application complète pour gérer votre collection de cartes Yu-Gi-Oh avec toutes les fonctionnalités essentielles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">12,000+ Cartes</h3>
              <p className="text-gray-600 leading-relaxed">
                Accédez à la base de données complète Yu-Gi-Oh en français avec images officielles, statistiques et informations détaillées
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Synchronisation Cloud</h3>
              <p className="text-gray-600 leading-relaxed">
                Code PIN unique à 6 chiffres pour synchroniser votre collection sur tous vos appareils instantanément
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Liste de souhaits</h3>
              <p className="text-gray-600 leading-relaxed">
                Créez votre wishlist avec raretés spécifiques et suivez les cartes que vous voulez acquérir
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Raretés & Quantités</h3>
              <p className="text-gray-600 leading-relaxed">
                Gérez les raretés spécifiques de chaque carte et suivez le nombre d'exemplaires que vous possédez
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h3>
              <p className="text-gray-600 leading-relaxed">
                Recevez des notifications automatiques quand de nouvelles cartes sont ajoutées à la base de données
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mb-6">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">PWA Installable</h3>
              <p className="text-gray-600 leading-relaxed">
                Installez l'app sur votre mobile comme une application native et utilisez-la hors ligne
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Simple, rapide et gratuit
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Créez votre code PIN</h3>
              <p className="text-gray-600 leading-relaxed">
                Cliquez sur "Cloud" et créez un code PIN à 6 chiffres. C'est votre identifiant unique pour synchroniser votre collection.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ajoutez vos cartes</h3>
              <p className="text-gray-600 leading-relaxed">
                Recherchez et ajoutez les cartes que vous possédez. Gérez les raretés, quantités et créez votre wishlist.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Synchronisez partout</h3>
              <p className="text-gray-600 leading-relaxed">
                Utilisez le même code PIN sur tous vos appareils. Votre collection est toujours à jour, partout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à gérer votre collection ?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Rejoignez la communauté et commencez à organiser votre collection Yu-Gi-Oh dès maintenant
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-xl font-bold text-xl hover:bg-purple-50 transition-all shadow-2xl hover:scale-105"
          >
            <Zap className="w-7 h-7" />
            Commencer maintenant
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-6">
            <details className="bg-gray-50 rounded-xl p-6 group">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Est-ce vraiment gratuit ?</span>
                <span className="text-indigo-600">+</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Oui, 100% gratuit sans publicité et sans version premium cachée. L'application est optimisée pour minimiser les coûts serveur et reste accessible à tous.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6 group">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Comment fonctionne le code PIN ?</span>
                <span className="text-indigo-600">+</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Votre code PIN à 6 chiffres est votre identifiant unique. Toute personne avec ce code peut accéder à votre collection. Ne le partagez qu'avec des personnes de confiance et notez-le en lieu sûr.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6 group">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Mes données sont-elles sécurisées ?</span>
                <span className="text-indigo-600">+</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Vos données sont sauvegardées localement sur votre appareil et dans le cloud Firebase (Google). Seules les personnes ayant votre code PIN peuvent y accéder.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6 group">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Les nouvelles cartes sont-elles ajoutées automatiquement ?</span>
                <span className="text-indigo-600">+</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Oui ! L'application vérifie automatiquement toutes les heures si de nouvelles cartes sont disponibles dans l'API YGOPRODeck et vous envoie une notification.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6 group">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Puis-je utiliser l'app sur plusieurs appareils ?</span>
                <span className="text-indigo-600">+</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Absolument ! Utilisez le même code PIN sur votre téléphone, tablette et ordinateur. Vos modifications sont synchronisées instantanément sur tous vos appareils.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
              <span className="text-2xl font-bold">Yu-Gi-Oh! Collection Tracker</span>
            </div>
            <p className="text-gray-400 mb-6">
              Application gratuite et open-source pour gérer votre collection Yu-Gi-Oh
            </p>
            <div className="flex flex-col items-center gap-3 mb-6">
              <p className="text-gray-400 text-sm">
                Des questions, bugs ou suggestions ?
              </p>
              <a
                href="https://www.reddit.com/u/KoperShuFF"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-semibold transition-all hover:scale-105"
              >
                <Users className="w-5 h-5" />
                Contactez-moi sur Reddit
              </a>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span>© 2025 - Fait avec ❤️ pour la communauté Yu-Gi-Oh</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
