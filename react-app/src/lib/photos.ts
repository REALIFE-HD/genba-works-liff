import type { PhotoType } from "./constants";

export type LocalPhoto = { data: string; type: PhotoType };

export function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const rd = new FileReader();
    rd.onload = () => {
      img.onload = () => {
        const max = 1280;
        let w = img.width;
        let h = img.height;
        if (w > max || h > max) {
          if (w > h) {
            h = Math.round((h * max) / w);
            w = max;
          } else {
            w = Math.round((w * max) / h);
            h = max;
          }
        }
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        c.getContext("2d")?.drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
      img.src = rd.result as string;
    };
    rd.onerror = reject;
    rd.readAsDataURL(file);
  });
}

export async function filesToPhotos(files: FileList | File[], max = 6): Promise<LocalPhoto[]> {
  const out: LocalPhoto[] = [];
  for (const f of Array.from(files)) {
    if (out.length >= max) break;
    out.push({ data: await resizeImage(f), type: "during" });
  }
  return out;
}
