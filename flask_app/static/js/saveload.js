document.getElementById('save').onclick = function save() {
    let form = new FormData()
    form.append('save', JSON.stringify(data))
    fetch("/save", { method :'POST', body: form})
        .then( response => response.json() )
        .then( data => {
            if(!l('cloudsave-message')){
                l('save').insertAdjacentHTML('afterend', `<p id='cloudsave-message'>${data.status}</p>`)
            }
            if(l('cloudsave-message')){
                setTimeout(() => {
                    l('cloudsave-message').remove()
                }, 5000);
            }
        } )
}

document.getElementById('load').onclick = function load() {
    if(confirm('Warning! This will overwrite your local save. Are you sure you wish to cloud load?')){
        fetch("/load")
            .then( response => response.json())
            .then( data => {
                if(!l('cloudload-message') && data.hasOwnProperty('status')){
                    l('load').insertAdjacentHTML('afterend', `<p id='cloudload-message'>${data.status}</p>`)
                }
                else{
                    localStorage.setItem('save', data)
                    game.load()
                }
                if(l('cloudload-message')){
                    setTimeout(() => {
                        l('cloudload-message').remove()
                    }, 5000);
                }
            })
        }
}
