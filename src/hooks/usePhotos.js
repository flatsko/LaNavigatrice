import { useState, useEffect } from "react";
import { savePhoto, getStoredPhotos, deletePhoto } from "../utils/photoStorage";

export const usePhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    const storedPhotos = getStoredPhotos();
    setPhotos(storedPhotos);
  };

  const addPhoto = async (photoData) => {
    setLoading(true);
    try {
      const savedPhoto = savePhoto(photoData);
      if (savedPhoto) {
        setPhotos((prev) => [...prev, savedPhoto]);
        return { success: true, photo: savedPhoto };
      }
      return { success: false, error: "Erreur lors de la sauvegarde" };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = (photoId) => {
    const success = deletePhoto(photoId);
    if (success) {
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
    }
    return success;
  };

  const getPhotosByEnigma = (enigmaId) => {
    return photos.filter((photo) => photo.enigmaId === enigmaId);
  };

  return {
    photos,
    loading,
    addPhoto,
    removePhoto,
    getPhotosByEnigma,
    refreshPhotos: loadPhotos,
  };
};
