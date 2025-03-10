const arrow = document.querySelector('#totop-arrow')
arrow.addEventListener('click', () => {
    window.scrollTo({top:0, behavior: 'smooth'})
})


window.addEventListener('scroll', () => {
    const scrollPosY = window.scrollY

    if (scrollPosY >= 100 && scrollPosY !== window.outerHeight - window.innerHeight) {
        arrow.style.display = 'block'
    }
    else {
        arrow.style.display = 'none'
    }
})

try {
    const toggleButton = document.querySelector('[data-toggle="toggle"]')
    const target = toggleButton.getAttribute('data-target')

    const toggleTarget = () => {
        const element = document.querySelector(target)

        if (!element.classList.contains('hide')) {
            element.classList.add('hide')
        }
        else {
            element.classList.remove('hide')
        }
    }

    toggleButton.addEventListener('click', toggleTarget)
}   
catch {}

async function getProducts(target, tag) {
    const element = document.querySelector(target)

    const response = await fetch(`https://kyh-net22.azurewebsites.net/api/products/${tag}`)
    const data = await response.json()

    for (let item of data) {
        let stars = ratingCalculator(item.starRating)
        element.innerHTML += 
        `
            <div class="collection-card">
                <div class="card-content">
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="card-menu">
                    <nav class="icons">
                    <a class="link" href="#"><i class="fa-regular fa-heart"></i></a>
                    <a id="productCart" class="link" href="#" onclick=addToCart()><i class="fa-regular fa-bag-shopping"></i></a>
                    </nav>
                    <a class="btn-theme" href="#">QUICK VIEW</a>
                </div>
                <div class="card-body">
                    <p class="category">${item.category}</p>
                    <p class="name">${item.name}</p>
                    <div class="ranking">
                    ${stars}
                    </div>
                    <p class="price">${item.originalPrice} ${item.currency}</p>
                </div>
            </div>
        `
    }
}

const ratingCalculator = (starRating) => {
    let counter = 0;
    let stars  = '';
    while (counter < 5){
        if ( counter <= starRating ) {
            stars += '<i class="fa-solid fa-sharp fa-star"></i>'
        }
        else {
            stars += '<i class="fa-regular fa-sharp fa-star"></i>'
        }
        counter += 1;
    }
    return (stars)
}

// Need to double click for it to work? 
// When I used this instead of elementbyid on productcart it lets me click everywhere 
// to increase the counter once I've clicked on the button.
// Also only works on first one now?
const addToCart = () => {
    if (localStorage.getItem('productCount') === null) {
        localStorage.setItem('productCount', 0)
    }
    const productCart = document.getElementById('productCart')
    const shoppingCart = document.getElementById('shoppingCart')
    let getCount = localStorage.getItem('productCount')
    let count = parseInt(getCount)
    productCart.addEventListener('click', (event) => {
        event.preventDefault();
        count += 1;
        localStorage.setItem('productCount', `${count}`)
        shoppingCart.classList.remove('hide')
        shoppingCart.innerHTML = (`${count}`)
    })
}

// Danger zone
async function handleContactForm(e) {
    e.preventDefault()
    const errors = []
    const errorMessage = document.getElementById('errorMessage')
    errorMessage.innerHTML = ''

    for (let element of e.target){
        if (element.required) {
            const errorElement = document.getElementById(`error-${element.id}`)

            if (element.value.length === 0) {
                errorElement.innerHTML = `${element.id} is required`
                errors.push(false)
            }
            else {
                errorElement.innerHTML = ` `

                switch(element.id){
                    case 'email':
                        errors.push(validateEmail)
                        break;
                    case 'name':
                        errors.push(validateName)
                        break;
                    case 'comments':
                        errors.push(validateComments)
                        break;
                }
            }   
        }
    }
    if (!errors.includes(false)) {
        const form = {
            name: e.target['name'].value,
            email: e.target['email'].value,
            comments: e.target['comments'].value
        }
    
        const res = await fetch('https://kyh-net22.azurewebsites.net/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })
        let submitMessage = document.getElementById('submitMessage')
        if (res.status === 200) {
            submitMessage.innerHTML = ('Tack för din förfrågan.')
        }
        else {
            submitMessage.innerHTML = ('Förfrågan kunde inte skickas.')
        }
        let inputs = document.querySelectorAll('#name, #email, #comments')
        inputs.forEach((input) => {
            input.value = '';
        })
    }
}

const validatePost = (event) => {
    switch(event.target.id){
        case 'email':
            validateEmail(event.target)
            break;
        case 'name':
            validateName(event.target)
            break;
        case 'comments':
            validateComments(event.target)
            break;
    }
}

const validateEmail = (element) => {
    
    const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
    const errorElement = document.getElementById(`error-${element.id}`)

    if (!regEx.test(element.value)) {
        errorElement.innerHTML = `Input must be a valid email.`
        return false
    }
        
    errorElement.innerHTML = ``
    return true
}

const validateName = (element) => {
    
    const regEx = /^[a-zA-Z]{2,20}\s?[a-zA-Z]{0,20}\s?[a-zA-Z]{0,20}$/;
    const errorElement = document.getElementById(`error-${element.id}`)

    if (!regEx.test(element.value.trim())) {
        errorElement.innerHTML = `Input must be a valid name.`
        return false
    }

    errorElement.innerHTML = ``
    return true
}

const validateComments = (element) => {
    
    const regEx = /^.{10,250}$/;
    const errorElement = document.getElementById(`error-${element.id}`)

    if (!regEx.test(element.value)) {
        errorElement.innerHTML = `Input must be a valid comment.`
        return false
    }

    errorElement.innerHTML = ``
    return true
}