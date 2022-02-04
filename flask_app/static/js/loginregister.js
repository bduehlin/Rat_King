var loginForm = document.getElementById('loginForm')
if(loginForm){
    guestButton = document.getElementById('guestButton')
    guestButton.addEventListener('click', function(e){
        e.preventDefault()
        fetch('/guest')
            .then(() => document.getElementById('landing').remove())
    })

    loginForm.addEventListener('submit', function(e){
        e.preventDefault()
        let form = new FormData(loginForm)
        fetch('/login', { method :'POST', body: form})
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if(data.message.includes('unsuccessful') && !document.getElementById('error-message')){
                    let button = document.querySelector('#loginForm > button' )
                    button.insertAdjacentHTML('afterend', `<p id='error-message'>${data.message}</p>`)
                }
                else if(data.message.includes('Log in successful')){
                    document.getElementById('landing').remove()
                }
            })
    })

    var registerButton = document.getElementById('register-switch')

    registerButton.addEventListener('click', function(e){
        e.preventDefault()
        document.getElementById('login').innerHTML = ('afterend', "<form id='register-form'><label for='email-register'>Email:</label><input type='text' name='email' id='email-register'><label for='password-register'>Password:</label><input type='password' name='password' id='password-register'><label for='password-confirm'>Confirm Password:</label><input type='password' name='password_confirm' id='password_confirm'><button>Register</button></form>")
        var registerForm = document.getElementById('register-form')
        registerForm.addEventListener('submit', function(e){
            e.preventDefault()
            let form = new FormData(registerForm)
            fetch('/create', { method :'POST', body: form})
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if(data.message.includes('unsuccessful') && !document.getElementById('error-message')){
                        let button = document.querySelector('#register-form > button')
                        button.insertAdjacentHTML('afterend', `<p id='error-message'>${data.message}</p>`)
                    }
                    else if(data.message.includes('Register successful')){
                        document.getElementById('landing').remove()
                    }
                })
        })  
    })
}

