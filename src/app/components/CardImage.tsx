import { useState } from 'react';

interface CardImageProps {
  cardId: number;
  cardName: string;
  imageUrl: string;
  imageUrlSmall: string;
  className?: string;
}

export function CardImage({ cardId, cardName, imageUrl, imageUrlSmall, className = '' }: CardImageProps) {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);

  // Liste des sources d'images à essayer, dans l'ordre de préférence
  const imageSources = [
    // Source 1 : Essayer avec le suffixe _FR pour les images françaises
    imageUrlSmall.replace('.jpg', '_FR.jpg'),
    // Source 2 : Essayer via un chemin alternatif pour images françaises
    `https://images.ygoprodeck.com/images/cards_cropped/${cardId}_FR.jpg`,
    // Source 3 : Format avec fr/ dans le chemin
    imageUrlSmall.replace('/images/cards/', '/images/cards/fr/'),
    // Source 4 : Essayer depuis un autre CDN (db.ygorganization.com)
    `https://db.ygorganization.com/data/card/fr/${cardId}.jpg`,
    // Source 5 : Retour à l'original (anglais) comme fallback
    imageUrlSmall,
  ];

  const handleImageError = () => {
    // Passer à la source suivante
    if (currentSourceIndex < imageSources.length - 1) {
      setCurrentSourceIndex(prev => prev + 1);
    }
  };

  return (
    <img
      src={imageSources[currentSourceIndex]}
      alt={cardName}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
}
