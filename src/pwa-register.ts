// Enregistrement du Service Worker pour PWA
export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.ts')
        .then((registration) => {
          console.log('Service Worker enregistré avec succès:', registration);
        })
        .catch((error) => {
          console.log('Échec de l\'enregistrement du Service Worker:', error);
        });
    });
  }
}

// Fonction pour afficher le prompt d'installation PWA
export function setupInstallPrompt(onInstallAvailable: (promptFn: () => Promise<void>) => void) {
  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Empêcher l'affichage automatique du prompt
    e.preventDefault();
    // Sauvegarder l'événement pour l'utiliser plus tard
    deferredPrompt = e;

    // Créer une fonction pour déclencher l'installation
    const promptInstall = async () => {
      if (deferredPrompt) {
        // Afficher le prompt d'installation
        deferredPrompt.prompt();
        // Attendre que l'utilisateur réponde au prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Résultat de l'installation: ${outcome}`);
        // Réinitialiser la variable
        deferredPrompt = null;
      }
    };

    // Notifier que l'installation est disponible
    onInstallAvailable(promptInstall);
  });

  window.addEventListener('appinstalled', () => {
    console.log('Application installée avec succès');
    deferredPrompt = null;
  });
}
