const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const data = []
const dataPanel = document.getElementById('data-panel')
const changePage = document.querySelector('.change-page')
const searchBar = document.querySelector('.search-bar')
const filterAll = ['male' , 'female' , 'twtoth' , 'thtofo']
const favoriteList = JSON.parse(localStorage.getItem('favoritePeople')) || []
let filterUser = []
let filterGenderData = []
let filterAgeData = []
let page = 'all'

function allPeople () {
	axios.get(INDEX_URL).then((response) => {
	data.push(...response.data.results)
	displayDataList(data)
})
.catch((err) => console.log(err))
}

function showPeople (id) {
    // get elements
    const modalImage = document.querySelector('#show-people-image')
    const modalName = document.querySelector('#show-people-name')
    const modalGender = document.querySelector('#show-people-gender')
    const modalAge = document.querySelector('#show-people-age')
    const modalEmail = document.querySelector('#show-people-email')
    const modalUpdate = document.querySelector('#show-people-update')

    // set request url
    const url = INDEX_URL + id

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data

      // insert data into modal ui
      modalImage.innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="Responsive image" >`
      modalName.innerHTML = `${data.name}`
      modalGender.innerHTML  = `gender: ${data.gender}`
      modalAge.innerHTML  = `age: ${data.age}`
      modalEmail.innerHTML  = `e-mail: ${data.email}`
      modalUpdate.innerHTML  = `Updated at ${data.updated_at}`
    })
 }
function displayDataList (data) {   
	let htmlContent = ''

	if (page === 'all') {
		data.forEach(function (item, index) {
		htmlContent += `
		  <div class="col-sm-3">
		    <div class="card mb-2">
		      <img class="card-img-top show-by-img" src="${item.avatar}" alt="Card image cap" data-id="${item.id}" data-toggle="modal" data-target="#show-people-modal"> <div class="card-body movie-item-body">
		        <h6 class="card-name">${item.name}</h6>
		        <span class='card-surname'>${item.surname}</span>
		      </div>
		      <!-- "More" button -->
	            <div class="card-footer">
	              <button class="btn btn-primary btn-show-people " data-toggle="modal" data-target="#show-people-modal" data-id="${item.id}">Info</button>
	              <i class="fa fa-heart" data-id="${item.id}"></i>
	            </div>
		    </div>
		  </div>
		`
		})
	} else if (page === 'interest') {
		data.forEach(function (item, index) {
		htmlContent += `
		  <div class="col-sm-3">
		    <div class="card mb-2">
		      <img class="card-img-top show-by-img" src="${item.avatar}" alt="Card image cap" data-id="${item.id}" data-toggle="modal" data-target="#show-people-modal"> <div class="card-body movie-item-body">
		        <h6 class="card-name">${item.name}</h6>
		        <span class='card-surname'>${item.surname}</span>
		      </div>
		      <!-- "More" button -->
	            <div class="card-footer">
	              <button class="btn btn-primary btn-show-people " data-toggle="modal" data-target="#show-people-modal" data-id="${item.id}">Info</button>
	              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
	            </div>
		    </div>
		  </div>
		`
		})
	}
	
	dataPanel.innerHTML = htmlContent
}

function addFavorite (peopleId) {
	const people = data.find(item => item.id === Number(peopleId))

	if (favoriteList.some(item => item.id === Number(peopleId))) {
		removeFavoriteItem (peopleId)
    } else {
      	favoriteList.push(people)
    }
    localStorage.setItem('favoritePeople', JSON.stringify(favoriteList))
}


function removeFavoriteItem (removeId) {
  const index = favoriteList.findIndex(item => item.id === Number(removeId))
  if (index === -1) return

  // removie movie and update localStorage
  favoriteList.splice(index, 1)
  localStorage.setItem('favoritePeople', JSON.stringify(favoriteList))
  if (page === 'all') {
  	displayDataList (data)
  } else if (page === 'interest') {
  	displayDataList (favoriteList)
  }
  
}


changePage.addEventListener('click', (event) => {
	if (event.target.matches('#interest-people')) {
		page = 'interest'
		const interestData = JSON.parse(localStorage.getItem('favoritePeople')) || []
		displayDataList (interestData)
	} else if (event.target.matches('#all-people')) {
		page = 'all'
		displayDataList (data)
	}
})


searchBar.addEventListener('submit', (event) => {
	event.preventDefault()
	let filterUser = []
	let filterGenderData = []
	let filterAgeData = []

	for (i=0 ; i< filterAll.length ; i++) {
		//使用getElementById比querySelector減少一個去除＃的步驟，便於後續利用
		let a = document.getElementById(`${filterAll[i]}`)
		if (a.checked === true) {
			console.log(filterAll[i])
			filterUser.push(`${filterAll[i]}`)
			console.log(filterUser)
		}
	}
	filterUser.forEach((rule) =>{
		if (rule === 'male') {
			data.filter (someone => {
				if (someone.gender === 'male') {
					filterGenderData.push(someone)
				}
			})
		} else if (rule === 'female') {
			data.filter (someone => {
				if (someone.gender === 'female') {
					filterGenderData.push(someone)
				}
			})			
		} else if (rule === 'twtoth') { 
			filterGenderData.filter (someone => {
				if (someone.age <= 30) {
					filterAgeData.push(someone)
				}			
			})	
		} else if (rule === 'thtofo') {
			filterGenderData.filter (someone => {
				if (someone.age > 30) {
					filterAgeData.push(someone)
				}			
			})
		}	
	})
	displayDataList(filterAgeData)

})


dataPanel.addEventListener('click', (event) => {
	if (event.target.matches('.btn-show-people') || event.target.matches('.show-by-img')) {
	  	showPeople(event.target.dataset.id)
	} else if (event.target.matches('.fa-heart')) {
		event.target.classList.toggle('favorite-people')
		addFavorite (event.target.dataset.id)
	} else if (event.target.matches('.btn-remove-favorite')) {
		removeFavoriteItem (event.target.dataset.id)
	}
})

allPeople()
