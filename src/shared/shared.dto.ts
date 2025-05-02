export class SussessResDTO<T> {
    statusCode: number;
    data: T;

    constructor(data: T) {
        this.statusCode = 200;
        this.data = data;
    }
}
