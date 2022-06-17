import { ref, uploadBytes } from "firebase/storage";
import { Dimensions, PixelRatio, Platform } from "react-native";
import { storage } from "../InitApp";

export const sleep = (miliseconds: number = 1000) => {
    return new Promise((resolve) => setTimeout(resolve, miliseconds));
};

export const getBlob = async (image: string) => {
    return await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
    });
};

export const uploadImages = async (images: string[]) => {
    let imagesRef = [];
    for await (const image of images) {
        const blob: any = await getBlob(image);
        const fileName = image.substring(image.lastIndexOf("/") + 1);
        const fileRef = ref(storage, "products/" + fileName);
        await uploadBytes(fileRef, blob);
        imagesRef.push(fileRef.fullPath);
        await blob.close();
    }
    return imagesRef;
};

export const validateInputs = (values: any) => {
    Object.values(values).map((value) => {
        if (!value) {
            throw { code: "empty-fields" };
        }
    });
};

export const normalize = (size: number) => {
    const scale = Dimensions.get("window").width / 320;
    const newSize = size * scale;
    if (Platform.OS === "ios") {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
};

export const currencyFormat = (num:string) => {
    return '$' + num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
 }
