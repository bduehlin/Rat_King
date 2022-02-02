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

    boughtUpgrades: [],
    avail: [],
}

var mods = {
    clickBase: 3, 
    clickMod: 0,
    percentOnClick: 0,

    nestValue: 5,
    cageValue: 100,
    hutchValue: 0,
    bedroomValue: 0,
    grandHallValue: 0,
}


pointName.innerText = data.pointsName

function l(what) {return document.getElementById(what)}

// Declare game functions
var game = {

// Click calcs
    getPoint() {
        data.points += clickValue
        data.clickPointsTotal += clickValue
        data.clickCount++
        game.updateDisplay()
    },

    updateClick() {
        clickValue = mods.clickBase * (1 + mods.clickMod) + (data.rats * mods.percentOnClick)
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
            for(var upgrade in upgrades ){
                if(upgrade > 100 && upgrade < 200 && upgrades[upgrade]['requires']()){
                    console.log('passed the check!')
                    console.log(upgrades[upgrade]['requires']())
                    data.avail.push(upgrade)
                    game.updateUpgrades()
                }
            }
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
        data.popLimit = data.cages * mods.cageValue + data.nests * mods.nestValue
    },

// Upgrades

    updateUpgrades() {
        document.getElementById('upgrades').innerHTML = ''
        for(var i = 0; i<data.avail.length; i++){
            let upgrade = data.avail[i]
            document.getElementById('upgrades').insertAdjacentHTML('beforeend', `<div class="upgrade" id="${upgrade}"><div class="hoverbox"><p class = 'upgradeName'>${upgrades[upgrade]['name']}</p><p class = 'upgradeCost'>Cost: ${upgrades[upgrade]['cost']}</p><p class = 'upgradeDescription'>${upgrades[upgrade]['description']}</p></div></div>`)
        }
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
        for(var i = 0; i<data.boughtUpgrades.length; i++){
            for(var upgrade in upgrades){
                if(upgrade == data.boughtUpgrades[i]){
                    upgrades[upgrade]['effect']()
                    delete(upgrade)
                }
            }
        }
        game.updateClick()
        game.updateUpgrades()
        game.updateDisplay()
    },
    // clearSave(savename = 'save') {
    //     localStorage.setItem(savename, '{}')
    //     location.reload()
    //     game.saveAlert()
    // },
}

var upgrades = {
    1: {
        name: 'Friend of the small',
        requires: () => data.clickCount == 10? true : false,
        cost: 100,
        description: 'Inspire your rats to gather 2 more ' + data.pointsName + ' per click', 
        effect: () => data.clickBase += 2
    },
    2: {
        name: 'Unlikely leader',
        requires: () => data.clickCount == 100? true : false,
        cost: 10000,
        description: 'You gain 100% more ' + data.pointsName + ' per click', 
        effect: () => data.clickMod + 1
    },
    3: {
        name: 'Colonel',
        requires: () => data.clickPointsTotal >= 5000? true : false,
        cost: 100000,
        description: 'You gain 2% of your ' + data.pointsName + ' per second on click', 
        effect: () => data.percentOnClick += 0.02
    },
    4: {
        name: 'General',
        requires: () => data.clickPointsTotal >= 100000 ? true : false,
        cost: 500000,
        description: 'You gain 100% more ' + data.pointsName + ' per click', 
        effect: () => data.clickMod + 1
    },


// building upgrades
    101: {
        name: 'Scrap organization',
        requires: () => data.nests == 10 ? true : false,
        cost: 1000,
        description: 'Your rats create more efficient nests. They hold 3 more rats, each.', 
        effect: () => mods.nestValue += 3
    },

    102: {
        name: 'Larger nests',
        requires: () => data.nests == 50 && data.upgrades.includes(101) ? true : false,
        cost: 1000000,
        description: 'Your rats create larger nests. They twice as many rats, each.', 
        effect: () => mods.nestValue * 2
    },
}


// game.save()
game.load()
game.start()

