import ApplicationError from './application.error';

// export {
//     ApplicationError
// }

 ApplicationError.$config({ debug: true });


class TestError extends ApplicationError {
    constructor(message: string, status: number, code: number) {
        super(message, status, code);
    }
}

class SecondTestError extends ApplicationError {
    constructor(message: string, status: number, code: number) {
        super(message, status, code);
    }
}

function log2(this: any) {
    console.log(`Inside from ${this.constructor.name}`)
}

SecondTestError.$addEvent(log2)

const a = new SecondTestError('test', 200, 500);
const b = new TestError('test2', 202, 502);


// console.log(a.getError());