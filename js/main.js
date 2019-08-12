configurate = {
    ratioOfExpected: 3,
    ratioOfRandom: 5,
    range: 20,
    equationCount: 4
}

class EquationBlock {
    constructor(incoming) {
        this.incoming = incoming;
        this.a;
        this.b;
        this.c;
        this.x;
        this.values = [];
        this.arrayOfNumbers = [];
        this.button;
        this.eventListner = {
            "pass": false,
            "allCorrect": true,
            "pushed": false,
            "correct": false,
            "buttonController": this.buttonController,
            "buttonDisable": this.buttonDisable
        }
    }

    arrayOfNumbersFill(range) {

        for (let i = 1; i < range; i++) {
            this.arrayOfNumbers.push(i);
        }

    }
    valuesFill(range) {
        for (let i = 0; i < range; i++) {
            this.values.push(this.arrayOfNumbers[Math.floor(Math.random() * this.arrayOfNumbers.length)]);
        }
    }

    setNumbers(ratioOfIncoming, ratioOfRandom) {
        const arr = [];
        for (let i = 0; i < ratioOfIncoming; i++) {
            arr.push(this.incoming);
        }
        for (let i = 0; i < ratioOfRandom; i++) {
            arr.push(this.values[Math.floor(Math.random() * this.values.length)]);
        }

        const arr1 = _.shuffle(arr);
        this.a = {
            value: arr1[0]
        }
        this.b = {
            value: arr1[1]
        }
    }
    getRandomCalc() {
        const plus = () => this.a.value + this.b.value
        const minus = () => this.a.value - this.b.value
        const multiply = () => this.a.value * this.b.value
        const divideOrplus = () => this.a.value % this.b.value === 0 ? this.a.value / this.b.value : this.a.value + this.b.value
        const calcArray = [plus, minus, multiply, divideOrplus];
        this.c = calcArray[Math.floor(Math.random() * calcArray.length)]();
        return this.c;
    }

    getSign() {
        if (this.a.value + this.b.value === this.c) {
            return "+"
        }
        if (this.a.value * this.b.value === this.c) {
            return "*"
        }
        if (this.a.value - this.b.value === this.c) {
            return "-"
        }
        if (this.a.value / this.b.value === this.c) {
            return "/"
        }
    }

    createButton() {
        const el = document.createElement('button');
        this.button = el;
        eventListenersButtons.push(el);
        el.classList.add('equationButton');
        el.onclick = () => {

            if (!this.eventListner.pushed && !this.eventListner.correct) {
                this.eventListner.pushed = true;
                this.button.classList.add('active');
                this.eventListner.pass = false;
                this.blockTheButton();
                return
            }
            if (this.eventListner.pushed && !this.eventListner.correct) {
                this.eventListner.pushed = false;
                this.eventListner.pass = true;
                this.button.classList.remove('active');
                this.blockTheButton();
                return
            }
            if (this.eventListner.allCorrect === false && this.eventListner.correct) {
                this.eventListner.allCorrect = true;
                this.eventListner.pushed = true;
                this.eventListner.pass = true;
                this.button.classList.add('active');
                this.blockTheButton();
                return
            }
            if (this.eventListner.allCorrect === true && this.eventListner.correct) {
                this.eventListner.allCorrect = false;
                this.eventListner.pass = false;
                this.eventListner.pushed = false;
                this.button.classList.remove('active');
                this.blockTheButton();
                return
            }

        }
        let thirst = {
            value: this.a.value
        };
        let second = {
            value: this.b.value
        };
        let third = {
            value: this.c
        };
        const arr = _.shuffle([thirst, second]);
        this.x = arr[0].value;
        arr[0].value = "x";
        el.innerHTML = thirst.value + " " + this.getSign() + " " + second.value + " " + "= " + third.value;
        return el;
    }

    check() {
        if (this.x === this.incoming) {
            this.eventListner.allCorrect = false;
            this.eventListner.correct = true;
        } else {
            this.eventListner.pass = true;
        }
    }
    addEventListener() {
        eventListeners.push(this.eventListner);
    }
    buttonController = () => {
        this.button.classList.add('mistake');
        ready.classList.add('mistake');
        this.eventListner.pass = true;
        calculate.classList.add('toShow');
        notAll.classList.remove('toShow');
        for (let ev of eventListeners) {
            if (ev.correct) {
                ev.pass = false;
            }
        }
        setTimeout(() => {
            this.button.classList.remove('mistake');
            this.button.classList.remove('active');
            ready.classList.remove('mistake');
            this.eventListner.pushed = false;
        }, 1000)
    }

    buttonDisable = () => {
        setTimeout(() => {
            this.button.classList.remove('mistake');
            this.button.classList.remove('active');
            this.eventListner.pushed = false;
            this.blockTheButton();
            if (this.eventListner.correct) {
                this.eventListner.allCorrect = false;
            }
        }, 1000)
    }
    blockTheButton() {

        for (let ev of eventListeners) {
            if (ev.pushed) {
                buttonBlock = false;
                ready.classList.remove('buttonBlock');
                ready.classList.add('activeReady');
                ready.disabled = false;
                return;
            }
        }
        ready.classList.add('buttonBlock');
        ready.classList.remove('activeReady');
        ready.disabled = true;
        buttonBlock = true;

    }
}


const fabricateNum = () => {

    const arr = []
    for (let i = 0; i < baseRange; i++) {
        arr.push(i);
    }
    return arr[Math.floor(Math.random() * arr.length)]

}

const numberSet = (num) => {
    number.innerHTML = num;
}

const build = () => {
    eventListeners = [];
    field.classList.remove('toShow');
    cont.innerHTML = "";
    buttonBlock = true;
    ready.disabled = true;
    const num = fabricateNum();
    numberSet(num);
    for (let i = 0; i < configurate.equationCount; i++) {
        const equationBlock = new EquationBlock(num);
        equationBlock.arrayOfNumbersFill(baseRange);
        equationBlock.valuesFill(4);
        equationBlock.setNumbers(configurate.ratioOfExpected, configurate.ratioOfRandom);
        equationBlock.getRandomCalc();
        cont.appendChild(equationBlock.createButton());
        equationBlock.check();
        equationBlock.addEventListener();
    }
    for (ev of eventListeners) {
        if (ev.correct) {
            field.classList.add('toShow')
            return
        }
    }
    build();
}

const isPassed = () => {
    let countOfpass = 0;
    for (let ev of eventListeners) {
        if (ev.pass) {
            countOfpass++;
        }
    }
    console.log(countOfpass, eventListeners.length);

    if (countOfpass === eventListeners.length) {
        return true;
    }
}

const field = document.querySelector('.field');
const cont = document.querySelector('.cont');
const number = document.querySelector('.number');
const baseRange = configurate.range;
let buttonBlock;
let eventListeners;
const eventListenersButtons = [];
const ready = document.querySelector('.ready');
const calculate = document.querySelector('.calculate');
const notAll = document.querySelector('.notAll');



ready.onclick = function () {

    if (isPassed()) {
        ready.classList.add('allRight');
        notAll.classList.remove('toShow');
        calculate.classList.remove('toShow');
        setTimeout(function () {
            field.classList.remove('toShow');
        }, 1500)
    }

    if (!buttonBlock) {
        for (let ev of eventListeners) {
            if (ev.pushed && !ev.correct) {
                ev.buttonController();
                for (let ev of eventListeners) {
                    ev.buttonDisable();
                }
            }
            if (ev.allCorrect && ev.correct) {
                for (let ev of eventListeners) {
                    if (!ev.allCorrect) {
                        let count = 0;
                        for (let ev of eventListeners) {
                            if (ev.pushed && !ev.correct) {
                                count++;
                            }
                        }
                        if (count === 0) {
                            notAll.classList.add('toShow');
                            calculate.classList.remove('toShow');
                            ready.classList.add('mistake');
                            setTimeout(function () {
                                ready.classList.remove('mistake');
                            }, 1000)
                        }
                    }
                }
            }
        }
    }
}

build();