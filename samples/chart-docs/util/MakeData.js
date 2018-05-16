import Namor from 'namor';

const range = (len) => {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

const newPerson = () => {
    const statusChance = Math.random();
    return [
        Namor.generate({ words: 1, numbers: 0 }),
        Namor.generate({ words: 1, numbers: 0 }),
        Math.floor(Math.random() * 30),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        statusChance > 0.66
            ? 'relationship'
            : statusChance > 0.33 ? 'complicated' : 'single',
    ];
};

export function makeData() {
    const dataSet = [];

    for (let i = 0; i < 100 ; i++) {
        dataSet.push(newPerson());
    }

    return dataSet;
}
