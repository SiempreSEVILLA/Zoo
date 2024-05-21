const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const {faker} = require('@faker-js/faker');
const assert = require('assert');
const { connect } = require('http2');
/*
class Faketier{
    constructor(){
        this.art = faker.animal.type();
        this.name = faker.person.firstName();
    }
}

class Fakeabteilung{
    constructor(){
        this.name = faker.animal.type();
    }
}

class Fakezoo{
    constructor(){
        this.land = faker.location.country();
        this.stadt = faker.location.city();
        this.adresse = faker.location.streetAddress();
        this.baujahr = faker.date.past({years:150}).getFullYear();
    }
}

class Fakemitarbeiter{
    constructor(){
        this.name = faker.person.fullName();
    }
}
*/
async function main() {
    await prisma.tier.deleteMany();
    await prisma.mitarbeiter.deleteMany();
    await prisma.abteilung.deleteMany();
    await prisma.zoo.deleteMany();

    const animals = Array.from(
        new Set(new Array(100).fill().map((_) => faker.animal.type()))
    );

    const zooliste = [];
    for(let i = 0; i < 5; i++){
        zooliste.push(await prisma.zoo.create({
            data: {
                land: faker.location.country(),
                stadt: faker.location.city(),
                adresse: faker.location.streetAddress(),
                baujahr: faker.date.past({years: 150}).getFullYear(),
            },
        }));
    }

    const abteilungliste = [];
    for(zoo of zooliste){
        const numabteilung = faker.number.int({min:2, max:7});
        const abteilungtype = Array.from(animals).toSorted((_) => Math.random() - 0.5).slice(0, numabteilung);
        for(let i = 0; i < numabteilung; i++){
            const animaltype = abteilungtype.pop();
            abteilungliste.push(await prisma.abteilung.create({
                data: {
                    zooid: zoo.id,
                    name: animaltype,
                },
            }));

        }
    }

    const tierliste = [];
    for(let abteilung of abteilungliste){
        const numtiere = faker.number.int({min: 5, max: 20});
        for(let i = 0; i < numtiere; i++){
            tierliste.push(await prisma.tier.create({
                data: {
                    art: faker.animal[abteilung.name](),
                    name: `${abteilung.name}: ${faker.person.firstName()}`,
                    abteilungid: abteilung.id,
                },
            }));
        }
    }

    const mitarbeiterliste = [];
    for(let i = 0; i<100; i++){
        mitarbeiterabt = abteilungliste
            .toSorted((_) => Math.random() - 0.5)
            .slice(0, faker.number.int({min:1, max:4}));
        assert.ok(mitarbeiterabt.length>0);
        mitarbeiterliste.push(await prisma.mitarbeiter.create({
            data: {
                name: faker.person.fullName(),
                abteilung: {
                    connect: mitarbeiterabt,
                },
            },
        }));
    }

    console.log(zooliste.length + ' Zoos created');
    console.log(abteilungliste.length + ' Abteilungen created');
    console.log(tierliste.length + ' Tiere created');
    console.log(mitarbeiterliste.length + ' Mitarbeiter created');
    
    console.log('Zoos: ', zooliste.map(zoo => zoo.id));
    console.log('Abteilungen: ', abteilungliste.map(abteilung => abteilung.name));
    console.log('Tiere: ', tierliste.map(tier => tier.name));
    console.log('Mitarbeiter: ', mitarbeiterliste.map(mitarbeiter => mitarbeiter.name));
}

main().then(()=>{
    prisma.$disconnect();
    console.log('done');
}).catch((e)=>{
    console.log(e);
    process.exit();
})
