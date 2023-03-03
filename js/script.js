const arrow = document.querySelector('#totop-arrow')
arrow.addEventListener('click', () => {
    window.scrollTo({top:0, behavior: 'smooth'})
})


window.addEventListener('scroll', () => {
    const scrollPosY = window.scrollY

    if (scrollPosY >= 100) {
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
    const element = document.querySelector('target')

    const response = await fetch(`https://kyh-net22.azurewebsites.net/api/products/${tag}`)
    const data = await response.json()

    for (let item of data) {
        element.innerHTML += 
        `
            <div class="collection-card">
                <div class="card-content">
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="card-menu">
                    <nav class="icons">
                    <a class="link" href="#"><i class="fa-regular fa-heart"></i></a>
                    <a class="link" href="#"><i class="fa-regular fa-bag-shopping"></i></a>
                    </nav>
                    <a class="btn-theme" href="#">QUICK VIEW</a>
                </div>
                <div class="card-body">
                    <p class="category">${item.category}</p>
                    <p class="name">${item.name}</p>
                    <div class="ranking">
                    <i class="fa-solid fa-sharp fa-star"></i>
                    <i class="fa-solid fa-sharp fa-star"></i>
                    <i class="fa-solid fa-sharp fa-star"></i>
                    <i class="fa-solid fa-sharp fa-star"></i>
                    <i class="fa-regular fa-sharp fa-star"></i>
                    </div>
                    <p class="price">${item.originalPrice} ${item.currency}</p>
                </div>
            </div>
        `
    }
}

// Danger zone
async function handleContactForm(e) {
    e.preventDefault()

    const form = {
        name: "",
        email: "",
        comments: ""
    }

    const res = await fetch('https://kyh-net22.azurewebsites.net/api/contacts', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })

    if (res.status === 200) {
        console.log('tack för din förfrågan')
    }

}