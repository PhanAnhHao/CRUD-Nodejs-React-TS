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