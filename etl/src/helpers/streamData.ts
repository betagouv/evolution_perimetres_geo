import { FileTypeEnum } from "@/interfaces";

export async function* streamData<T>(filepath: string, filetype: FileTypeEnum, batchSize: number = 100): AsyncIterator<T> { 

}