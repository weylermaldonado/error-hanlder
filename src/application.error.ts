import IError from "./interfaces/error.interface";
import IErrorJSON from "./interfaces/error-json.interface";
import IOptions from "./interfaces/options.interface";
import IEventsStack from "./interfaces/stack.interface";

const events: IEventsStack[] = [];
const config: IOptions = {};

export default class ApplicationError extends Error {

    private _message: string;
    private _code: number;
    private _status: number;
    private _debug: boolean;
    private _error: IError = {
        name: '',
        message: '',
        status: 0,
        code: 0,
    };

    /**
     * Error Class Constructor.
     * @param message Error Message
     * @param status HTTP Status
     * @param code Application specific error code
     */
    constructor(message: string, status: number, code: number) {
        super();
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this.constructor);
        this._message = message ?? 'Something went wrong. Please try again.';
        this._status = status ?? 500;
        this._code = code ?? 0;
        this.name = this.name;
        this._error.name = this.constructor.name;
        this._debug = config.debug ?? true;
        this._error.message = this._message;
        this._error.code = this._code;
        this._error.status = this._status;
        this.runEvents();
    }

    /**
     * Add to stack a hook event to exec
     * when the instance is created.
     * @static
     * @param callback Event function
     */
    public static $addEvent(callback: Function): void {
        events.push({ id: this.name, event: callback});
    }

    /**
     * Attach the options to the instance.
     * @static
     * @param options Configuration options.
     */
    public static $config(options: IOptions): void {
        Object.assign(config, options);
    }

    /**
     * Execute the stack of hook events.
     */
    private runEvents(): void {
        events.forEach((cb) => {
            if(cb.id === this.constructor.name || cb.id === 'ApplicationError') {
                cb.event.call(this)
            }
        });
    }

    /**
     * Return the Error object in JSON format.
     * @returns Error
     */
    public toJSON(): IErrorJSON {
        return {
            status: this._status,
            data: {
                error: this._error 
            }
        }
    }

    /**
     * Return the current error in a single format.
     * @returns Error 
     */
    public getError() {
        return this._error;
    }
} 

function logger(this: any) {
    if (this._debug) {
        const dateFormat:string = new Date(Date.now()).toUTCString();
        console.log({
            date: dateFormat,
            http_status: this._status,
            message: this._message,
            code: this._code,
            stack: this.stack,
        });
    }
}

ApplicationError.$addEvent(logger);

