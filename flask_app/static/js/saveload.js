document.getElementById('save').onclick = function save() {
    // console.log(data)
    // console.log(typeof(data))
    let form = new FormData()
    form.append('save', JSON.stringify(data))
    fetch("/save", { method :'POST', body: form})
        .then( response => response.json() )
        .then( data => console.log(data) )
}

document.getElementById('load').onclick = function load() {
    fetch("/load")
        .then( response => response.json())
        .then( data => {
            localStorage.setItem('save', data)
            // console.log('game loaded from db', localStorage.getItem('save'))
            game.load()
        })
}
