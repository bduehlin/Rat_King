// Cloud Save and load

l('save').onclick = function save() {
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

l('load').onclick = function load() {
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

// Export and import

l('export').setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(localStorage.getItem('save') || '{}'))
l('export').setAttribute('download', 'rat_king' + Date.now())

l('import').setAttribute('accept', '.txt')
l('import').addEventListener('change', (event) => {
    var input = event.target
    
    var reader = new FileReader()
    reader.onload = function(){
        localStorage.setItem('save', reader.result)
        game.load()
    }
    reader.readAsText(input.files[0])
}
)


// Clear local save
l('clearSave').addEventListener('click', () => game.clearSave())