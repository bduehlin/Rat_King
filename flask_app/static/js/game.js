// Declare things that save

var data = {
    points: 0,
    pointsTotal: 0,
    pointsName: 'crumbs',
    rats: 1,
    ratsTotal: 1,
    clickCount: 0,
    clickPointsTotal: 0,


    popLimit: 1,
    nests: 0,
    cages: 0,
    hutches: 0,
    bedrooms: 0,
    grandHalls: 0,

    upgrades: [],
    achievements: [],

    clickBase: 3, 
    clickMod: 0,
    percentOnClick: 0,
}

pointName.innerText = data.pointsName

// Declare game functions
var game = {

// Click calcs
    getPoint() {
        data.points += data.clickValue
        data.clickPointsTotal += data.clickValue
        clickCount++
        game.updateDisplay()
    },


    updateClick() {
        clickValue = data.clickBase * (1 + data.clickMod) + (data.rats * data.percentOnClick)
    },


// Buildings
    getNestCost() {
        return Math.floor(10 * Math.pow(1.4, data.nests))
    },
    canGetNest() {
        return data.points >= game.getNestCost()
    },
    getNest() {
        if (game.canGetNest()) {
            data.points -= game.getNestCost()
            data.nests++
            game.getPopulation()
        }
        game.updateDisplay()
    },

    getCageCost() {
        return Math.floor(10000 * Math.pow(1.4, data.cages))
    },
    canGetCage() {
        return data.points >= game.getCageCost()
    },
    getCage() {
        if (game.canGetCage()) {
            data.points -= game.getCageCost()
            data.cages++
            game.getPopulation()
        }
        game.updateDisplay()
    },


    getPopulation(){
        data.popLimit = data.cages * 100 + data.nests * 5
    },


// Core functions
    tick() {
        data.points += data.rats / 10
        data.pointsTotal += data.rats / 10
        if (data.rats < data.popLimit){
            data.rats += data.rats * 0.003
            data.ratsTotal += data.rats * 0.003
        }
        if (data.rats > data.popLimit) {
            data.rats = data.popLimit
        }
        game.updateDisplay()
    }, 

    updateDisplay() {
        pointValue.innerText = Math.floor(data.points)
        ratTotal.innerText = Math.floor(data.rats)
        nestCount.innerText = data.nests
        population.innerText = data.popLimit
        nestCost.innerText = game.getNestCost()
        cageCost.innerText = game.getCageCost()
    },

    start() {
        setInterval(() => game.tick(), 100)
        setInterval(() => game.save(), /* 10 seconds */ 10e3)
        document.getElementById('buyNest').addEventListener('click', () => game.getNest())
        document.getElementById('buyCage').addEventListener('click', () => game.getCage())
    },

    save(savename = 'save') {
        localStorage.setItem(savename, JSON.stringify(data))
    },
    load(savename = 'save') {
        Object.assign(data, JSON.parse(localStorage.getItem(savename) || '{}'))
        game.updateDisplay()
    },
    clearSave(savename = 'save') {
        localStorage.setItem(savename, '{}')
        location.reload()
        game.saveAlert()
    },
}

game.load()
game.start()


var upgrades = {
    1: {
        name: 'Friend of the small',
        requires: data.clickCount == 10,
        cost: 100,
        description: 'Inspire your rats to gather 2 more ' + data.pointsName + ' per click', 
        effect: () => data.clickBase += 2
    },
    2: {
        name: 'Unlikely leader',
        requires: data.clickCount == 100,
        cost: 10000,
        description: 'You gain 100% more ' + data.pointsName + ' per click', 
        effect: () => data.clickMod + 1
    },
    3: {
        name: 'Colonel',
        requires: data.clickPointsTotal == 5000,
        cost: 100000,
        description: 'You gain 2% of your ' + data.pointsName + ' per second on click', 
        effect: () => data.percentOnClick += 0.02
    },
    4: {
        name: 'General',
        requires: data.clickPointsTotal == 100000,
        cost: 10000,
        description: 'You gain 100% more ' + data.pointsName + ' per click', 
        effect: () => data.clickMod + 1
    },
}