export class Logger {
    static info(msg: string, ...params: any[]): void {
        console.log(this.msgParams(msg, params));
    }

    static warn(msg: string, ...params: any[]): void {
        console.log('Warning!! - ' + this.msgParams(msg, params));
    }

    static error(msg: string, ...params: any[]): void {
        console.log('Error!! - ' + this.msgParams(msg, params));
    }

    private static msgParams(msg: string, params: any[]): string {
        params.forEach((param) => {
            msg += ' ' + param;
        });
        return msg;
    }
}
