import { ref, uploadBytes, getDownloadURL as getStorageDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase.config";
import { format } from "date-fns";

const BUCKET_URL = "gs://expense-tracker-99274.appspot.com";

export const uploadImage = async (image: Blob, uid: string) => {
  const formattedDate = format(new Date(), "yyyy-mm-dd'T'HH:mm:ss'Z'");
  const bucket = `${BUCKET_URL}/${uid}/${formattedDate}.jpg`;
  const storageRef = ref(storage, bucket);
  await uploadBytes(storageRef, image);
  return bucket;
}

export const getDownloadURL = async (bucket: string | undefined) => {
  return await getStorageDownloadURL(ref(storage, bucket));
}

export const deleteImage = async (bucket: string | undefined) => {
  await deleteObject(ref(storage, bucket));
}

export const replaceImage = async (image: Blob | Uint8Array | ArrayBuffer, bucket: string | undefined) => {
  await uploadBytes(ref(storage, bucket), image);
}