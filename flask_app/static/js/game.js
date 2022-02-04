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

var dataEmpty = {
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
    reset: function(){
        mods.clickBase = 3
        mods.clickMod = 0
        mods.percentOnClick = 0
        mods.nestValue = 5
        mods.cageValue = 100
        mods.hutchValue = 5000
        mods.bedroomValue = 1000000
        mods.grandHallValue = 5000000
    }
}


pointName.innerText = data.pointsName

function l(what) {return document.getElementById(what)}
function exponify(num){
    if(num > 999999 ){
        return num.toExponential(2)
    }
    else{
        return Math.floor(num)
    }
}


// Declare game functions
var game = {

// Click calcs
    getPoint() {
        data.points += clickValue + + (mods.percentOnClick * data.rats)
        data.clickPointsTotal += clickValue + + (mods.percentOnClick * data.rats)
        data.clickCount++
        game.clickListener()
        game.updateDisplay()
    },

    updateClick() {
        clickValue = mods.clickBase * (1 + mods.clickMod)
    },

    clickListener() {
        for(var upgrade in upgrades ){
            if(upgrade < 100 && !data.boughtUpgrades.includes(upgrade) && !data.avail.includes(upgrade) && upgrades[upgrade]['requires']()){
                data.avail.push(upgrade)
                game.updateUpgrades()
            }
        }
    },


// Buildings
    getNestCost() {
        return Math.floor(10 * Math.pow(1.3, data.nests))
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
                if(upgrade > 100 && upgrade < 200 && !data.boughtUpgrades.includes(upgrade) && !data.avail.includes(upgrade) && upgrades[upgrade]['requires']()){
                    data.avail.push(upgrade)
                    game.updateUpgrades()
                }
            }
            if ( data.nests == 1){
                l('buyCage').style.display = 'flex'
            }
        }
        game.updateBuildings()
    },

    getCageCost() {
        return Math.floor(10000 * Math.pow(1.3, data.cages))
    },
    canGetCage() {
        return data.points >= game.getCageCost()
    },
    getCage() {
        if (game.canGetCage()) {
            data.points -= game.getCageCost()
            data.cages++
            game.getPopulation()
            for(var upgrade in upgrades ){
                if(upgrade > 200 && upgrade < 300 && !data.boughtUpgrades.includes(upgrade) && !data.avail.includes(upgrade) && upgrades[upgrade]['requires']()){
                    data.avail.push(upgrade)
                    game.updateUpgrades()
                }
            }
            if ( data.cages == 1){
                l('buyHutch').style.display = 'flex'
            }
        }
        game.updateBuildings()
    },

    getHutchCost() {
        return Math.floor(10000000 * Math.pow(1.3, data.hutches))
    },
    canGetHutch() {
        return data.points >= game.getHutchCost()
    },
    getHutch() {
        if (game.canGetHutch()) {
            data.points -= game.getHutchCost()
            data.hutches++
            game.getPopulation()
            for(var upgrade in upgrades ){
                if(upgrade > 300 && upgrade < 400 && !data.boughtUpgrades.includes(upgrade) && !data.avail.includes(upgrade) && upgrades[upgrade]['requires']()){
                    data.avail.push(upgrade)
                    game.updateUpgrades()
                }
            }
            if ( data.hutches == 1){
                l('buyBedroom').style.display = 'flex'
            }
        }
        game.updateBuildings()
    },

    getBedroomCost() {
        return Math.floor(1000000000 * Math.pow(1.3, data.bedrooms))
    },
    canGetBedroom() {
        return data.points >= game.getBedroomCost()
    },
    getBedroom() {
        if (game.canGetBedroom()) {
            data.points -= game.getBedroomCost()
            data.bedrooms++
            game.getPopulation()
            for(var upgrade in upgrades ){
                if(upgrade > 400 && upgrade < 500 && !data.boughtUpgrades.includes(upgrade) && !data.avail.includes(upgrade) && upgrades[upgrade]['requires']()){
                    data.avail.push(upgrade)
                    game.updateUpgrades()
                }
            }
            if ( data.bedrooms == 1){
                l('buyGrandHall').style.display = 'flex'
            }
        }
        game.updateBuildings()
    },

    getGrandHallCost() {
        return Math.floor(10000000000 * Math.pow(1.3, data.grandHalls))
    },
    canGetGrandHall() {
        return data.points >= game.getGrandHallCost()
    },
    getGrandHall() {
        if (game.canGetGrandHall()) {
            data.points -= game.getGrandHallCost()
            data.grandHalls++
            game.getPopulation()
            for(var upgrade in upgrades ){
                if(upgrade > 500 && upgrade < 600 && !data.boughtUpgrades.includes(upgrade) && !data.avail.includes(upgrade) && upgrades[upgrade]['requires']()){
                    data.avail.push(upgrade)
                    game.updateUpgrades()
                }
            }
        }
        game.updateBuildings()
    },

    getPopulation(){
        data.popLimit = 1 + data.cages * mods.cageValue + data.nests * mods.nestValue + data.hutches * mods.hutchValue + data.bedrooms * mods.bedroomValue + data.grandHalls * mods.grandHallValue
    },

// Upgrades

    updateUpgrades() {
        document.getElementById('upgrades').innerHTML = ''
        for(let i = 0; i<data.avail.length; i++){
            let upgrade = data.avail[i]
            let upgradeObject = upgrades[upgrade]
            l('upgrades').insertAdjacentHTML('beforeend', `<div class="upgrade" id="${upgrade}"><div class="hoverbox"><p class = 'upgradeName'>${upgrades[upgrade]['name']}</p><p class = 'upgradeCost'>Cost: ${exponify(upgrades[upgrade]['cost'])}</p><p class = 'upgradeDescription'>${upgrades[upgrade]['description']}</p></div></div>`)
            l(`${upgrade}`).addEventListener('click', function(){
                if(data.points >= upgradeObject['cost']){
                    data.points -= upgradeObject['cost']
                    data.avail.splice(i, 1)
                    upgradeObject.effect()
                    data.boughtUpgrades.push(upgrade)
                    game.updateUpgrades()
                }
            })
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
        pointValue.innerText = exponify(data.points)
        ratTotal.innerText = exponify(data.rats)
    },

    updateBuildings() {
        game.getPopulation()
        popTotal.innerText = exponify(data.popLimit)
        nestCost.innerText = exponify(game.getNestCost())
        cageCost.innerText = exponify(game.getCageCost())
        hutchCost.innerText = exponify(game.getHutchCost())
        bedroomCost.innerText = exponify(game.getBedroomCost())
        grandHallCost.innerText = exponify(game.getGrandHallCost())
        nestAmount.innerText = data.nests
        cageAmount.innerText = data.cages
        hutchAmount.innerText = data.hutches
        bedroomAmount.innerText = data.bedrooms
        grandHallAmount.innerText = data.grandHalls
        nestPop.innerText = exponify(mods.nestValue)
        cagePop.innerText = exponify(mods.cageValue)
        hutchPop.innerText = exponify(mods.hutchValue)
        bedroomPop.innerText = exponify(mods.bedroomValue)
        grandHallPop.innerText = exponify(mods.grandHallValue)
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
        data = JSON.parse(JSON.stringify(dataEmpty))
        for(key in JSON.parse(localStorage.getItem(savename))){
            data[key] = JSON.parse(localStorage.getItem(savename))[key]
        }
        mods.reset()
        for(var i = 0; i<data.boughtUpgrades.length; i++){
            for(var upgrade in upgrades){
                if(upgrade == data.boughtUpgrades[i]){
                    upgrades[upgrade].effect()
                }
            }
        }
        let buildingKey = [l('buyNest'), l('buyCage'), l('buyHutch'), l('buyBedroom'), l('buyGrandHall')]
        let buildingAmount = [data.nests, data.cages, data.hutches, data.bedrooms, data.grandHalls]
        for(let building in buildingAmount){
            if(buildingAmount[building] > 0){
                buildingKey[building].style.display = 'flex'
                buildingKey[parseInt(building) + 1].style.display = 'flex'
            }
        }
        game.updateClick()
        game.updateUpgrades()
        game.updateBuildings()
        game.updateDisplay()
    },
    clearSave(savename = 'save') {
        confirm('This deletes your local savefile.')
        localStorage.setItem(savename, '{}')
        location.reload()
    },
}

var upgrades = {
    1: {
        name: 'Friend of the small',
        requires: () => data.clickCount >= 10? true : false,
        cost: 100,
        description: 'Inspire your rats to gather 2 more ' + data.pointsName + ' per click', 
        effect: function(){
            mods.clickBase += 2
            game.updateClick()
        }
    },

    2: {
        name: 'Unlikely leader',
        requires: function(){
            return data.clickCount >= 100 && data.boughtUpgrades.includes('1')? true : false
        },
        cost: 1000,
        description: 'You gain 200% more ' + data.pointsName + ' per click', 
        effect: function(){
            mods.clickMod += 2
            game.updateClick()
        }
    },

    3: {
        name: 'Colonel',
        requires: () => data.clickPointsTotal >= 5000? true : false,
        cost: 100000,
        description: 'You gain an additional 2% of your ' + data.pointsName + ' per second on click', 
        effect: function(){
            mods.percentOnClick += 0.02
            game.updateClick()
        }
    },

    4: {
        name: 'General',
        requires: () => data.clickPointsTotal >= 100000 ? true : false,
        cost: 500000,
        description: 'You gain an additional 1% of your ' + data.pointsName + ' per second on click', 
        effect: function(){
            mods.percentOnClick += 0.01
            game.updateClick()
        }
    },

    5: {
        name: 'Emperor',
        requires: () => data.clickPointsTotal >= 1000000 ? true : false,
        cost: 5000000,
        description: 'You gain an additional 2% of your ' + data.pointsName + ' per second on click', 
        effect: function(){
            mods.percentOnClick += 0.02
            game.updateClick()
        }
    },

    6: {
        name: 'Tired Finger',
        requires: function(){
            return data.clickCount >= 1000 && data.boughtUpgrades.includes('2')? true : false
        },
        cost: 500000,
        description: 'Wow, you clicked a lot. Or you held the enter key! Your base clicking power increases by 100 ' + data.pointsName, 
        effect: function(){
            mods.clickBase += 100
            game.updateClick()
        }
    },

    7: {
        name: 'Exhausted Finger',
        requires: function(){
            return data.clickCount >= 10000 && data.boughtUpgrades.includes('6')? true : false
        },
        cost: 5000000,
        description: 'Wow, you must have carpal tunnel! You gain 5000% more ' + data.pointsName + ' per click', 
        effect: function(){
            mods.clickMod += 50
            game.updateClick()
        }
    },



// building upgrades

// Nest
    101: {
        name: 'Scrap Organization',
        requires: function(){
            return data.nests >= 10? true : false
        },
        cost: 1000,
        description: 'Your rats create more efficient nests. They hold 3 more rats, each', 
        effect: function(){
            mods.nestValue += 3
            game.getPopulation()
            game.updateBuildings()
        }
    },

    102: {
        name: 'Larger Nests',
        requires: function(){
            return data.nests >= 25 && data.boughtUpgrades.includes('101')? true : false
        },
        cost: 100000,
        description: 'Your rats create larger nests. They hold thrice as many rats, each', 
        effect: function(){
            mods.nestValue *= 3
            game.getPopulation()
            game.updateBuildings()
        }
    },

    103: {
        name: 'Rancid Organization',
        requires: function(){
            return data.nests >= 50 && data.boughtUpgrades.includes('102')? true : false
        },
        cost: 5000000,
        description: 'Your rats have learned to fold themselves around their various scraps. Nests hold twice as many rats, each', 
        effect: function(){
            mods.nestValue *= 2
            game.getPopulation()
            game.updateBuildings()
        }
    },

// Cage
    201: {
        name: 'Open Doors',
        requires: () => data.cages >= 10 ? true : false,
        cost: 500000,
        description: 'Your rats are allowed to spill out of their cages. Each cage holds 75 more rats', 
        effect: function(){
            mods.cageValue += 75
            game.getPopulation()
            game.updateBuildings()
        }
    },

    202: {
        name: 'Larger Cages',
        requires: function(){
            return data.cages >= 25 && data.boughtUpgrades.includes('201')? true : false
        },
        cost: 25000000,
        description: 'You decided to painstakingly weld each of your existing cages to another cage. Cages can hold twice as many rats', 
        effect: function(){
            mods.cageValue *= 2
            game.getPopulation()
            game.updateBuildings()
        }
    },

    203: {
        name: 'Megacage',
        requires: function(){
            return data.cages >= 50 && data.boughtUpgrades.includes('202')? true : false
        },
        cost: 1000000000,
        description: 'You stacked a cage on every cage. How innovative. They hold twice as many rats', 
        effect: function(){
            mods.cageValue *= 2
            game.getPopulation()
            game.updateBuildings()
        }
    },

// Hutch
    301: {
        name: 'Fancy glass',
        requires: () => data.hutches >= 10 ? true : false,
        cost: 10000000,
        description: 'You add glass to the doors of your hutches. Seeing inside them makes it feel like they hold 3000 more rats each', 
        effect: function(){
            mods.hutchValue += 3000
            game.getPopulation()
            game.updateBuildings()
        }
    },

    302: {
        name: 'Hutch Condominium',
        requires: function(){
            return data.hutches >= 25 && data.boughtUpgrades.includes('301')? true : false
        },
        cost: 300000000,
        description: 'Each hutch has been divided into small units for each rat. They seem to like the private space. Plus, your hutches hold twice as many rats', 
        effect: function(){
            mods.hutchValue *= 2
            game.getPopulation()
            game.updateBuildings()
        }
    },

    303: {
        name: 'Skyhutch',
        requires: function(){
            return data.hutches >= 50 && data.boughtUpgrades.includes('302')? true : false
        },
        cost: 10000000000,
        description: 'Your hutches are so tall they reach into the sky. But they only hold twice as many rats', 
        effect: function(){
            mods.hutchValue *= 2
            game.getPopulation()
            game.updateBuildings()
        }
    },

// Bedroom
401: {
    name: 'Fully-stocked Vanity',
    requires: () => data.bedrooms >= 10 ? true : false,
    cost: 10000000000,
    description: 'You provide cosmetic products for your rats and they come rushing in. Bedrooms hold 500,000 more rats each', 
    effect: function(){
        mods.bedroomValue += 500000
        game.getPopulation()
        game.updateBuildings()
    }
},

402: {
    name: 'Extra Linens',
    requires: function(){
        return data.bedrooms >= 25 && data.boughtUpgrades.includes('401')? true : false
    },
    cost: 300000000000,
    description: 'because of the nice new sheets your provide, your bedrooms hold twice as many rats', 
    effect: function(){
        mods.bedroomValue *= 2
        game.getPopulation()
        game.updateBuildings()
    }
},

403: {
    name: 'Bunk Bed',
    requires: function(){
        return data.bedrooms >= 50 && data.boughtUpgrades.includes('402')? true : false
    },
    cost: 100000000000,
    description: 'Bedrooms hold twice as many rats, because you added a bunk bed', 
    effect: function(){
        mods.hutchValue *= 2
        game.getPopulation()
        game.updateBuildings()
    }
},
}

game.load()
game.start()

