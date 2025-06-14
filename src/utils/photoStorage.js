const PHOTO_STORAGE_KEY = "treasure_hunt_photos";

// Créer ce nouveau fichier si il n'existe pas
export const savePhoto = (photoData) => {
  try {
    const photos = getStoredPhotos();
    const photoId = `photo_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const photoRecord = {
      id: photoId,
      enigmaId: photoData.enigmaId,
      enigmaTitle: photoData.enigmaTitle,
      timestamp: photoData.timestamp,
      filename: photoData.filename,
      dataUrl: photoData.dataUrl, // Base64 de l'image
      // NOUVEAU: Créer une URL temporaire
      shareUrl: createShareableUrl(photoData.dataUrl, photoId),
    };

    photos.push(photoRecord);
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(photos));

    return photoRecord;
  } catch (error) {
    console.error("Erreur sauvegarde photo:", error);
    return null;
  }
};

export const getStoredPhotos = () => {
  try {
    const photos = localStorage.getItem(PHOTO_STORAGE_KEY);
    return photos ? JSON.parse(photos) : [];
  } catch (error) {
    console.error("Erreur récupération photos:", error);
    return [];
  }
};

// NOUVEAU: Créer une URL partageable temporaire
const createShareableUrl = (dataUrl, photoId) => {
  // Option 1: Utiliser un service comme imgbb, imgur, ou cloudinary
  // Option 2: Créer un blob URL (temporaire)
  try {
    const blob = dataURLtoBlob(dataUrl);
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Erreur création URL:", error);
    return null;
  }
};

// Convertir dataURL en Blob
const dataURLtoBlob = (dataURL) => {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const deletePhoto = (photoId) => {
  try {
    const existingPhotos = getStoredPhotos();
    const updatedPhotos = existingPhotos.filter(
      (photo) => photo.id !== photoId
    );
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(updatedPhotos));
    return true;
  } catch (error) {
    console.error("Erreur suppression photo:", error);
    return false;
  }
};

export const clearAllPhotos = () => {
  try {
    localStorage.removeItem(PHOTO_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Erreur suppression photos:", error);
    return false;
  }
};

export const getPhotosByEnigma = (enigmaId) => {
  const allPhotos = getStoredPhotos();
  return allPhotos.filter((photo) => photo.enigmaId === enigmaId);
};
