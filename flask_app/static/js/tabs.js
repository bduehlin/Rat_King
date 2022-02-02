var settingsButton = l('settingsButton')

settingsButton.addEventListener('click', function(){
    let settings = l('settings')
    if(window.getComputedStyle(settings).display == 'none'){
        settings.style.display = 'flex'
    }
    else{
        settings.style.display = 'none'
    }
})

