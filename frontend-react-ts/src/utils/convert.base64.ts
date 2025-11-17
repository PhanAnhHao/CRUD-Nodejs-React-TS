// Hàm convert Base64 → Object URL
export const base64ToUrl = (base64: string) => {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([intArray], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
};

// Hàm convert file → base64
export const getBase64 = (file: File | Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });