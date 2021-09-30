export function getDatasetUuid(dataset: string, year: number): string {
    return `${dataset}-${year.toString()}`;
}