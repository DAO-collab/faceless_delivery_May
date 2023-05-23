import CryptoJS from "crypto-js";

class BlobCheckPoint {
  blob: File;

  constructor(blob: File) {
    this.blob = blob;
  }

  readMd5(interceptSize: number = 1024 * 1024 * 5): Promise<string> {
    return new Promise(resolve => {
      const { type } = this.blob;
      const extractBlob = this.blob.slice(0, interceptSize, type);

      const reader = new FileReader();
      reader.readAsBinaryString(extractBlob);

      reader.onload = (res: any) => {
        const md5 = CryptoJS.MD5(res.target.result).toString();
        resolve(md5);
      };
    });
  }

  readPiecesCount(interceptSize: number = 1024 * 1024 * 3): number {
    const { size } = this.blob;
    const piecesCount = Math.ceil(size / interceptSize);

    return piecesCount;
  }

  readPiecesArray(interceptSize: number = 1024 * 1024 * 3): Blob[] {
    const piecesCount = this.readPiecesCount(interceptSize);
    const piecesArray: Blob[] = [];
    const { type } = this.blob;
    let n = 0;

    while (n < piecesCount) {
      const start = n * interceptSize;
      const end = (n + 1) * interceptSize;
      const extractBlob = this.blob.slice(start, end, type);
      piecesArray.push(extractBlob);
      n++;
    }

    return piecesArray;
  }
}

export { BlobCheckPoint };
