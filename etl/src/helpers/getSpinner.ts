import ora from "ora"

export function getSpinner() {
    const spinner = ora()
    return spinner;
}
